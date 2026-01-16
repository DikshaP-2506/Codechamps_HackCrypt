import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Connect to MongoDB
  await connectToDatabase();

  // Handle the webhook
  const eventType = evt.type;

  // We don't create users via webhook anymore - users are created via /api/users/create-profile
  // But we still handle updates and deletes

  if (eventType === "user.updated") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = evt.data;

    try {
      const fullName =
        first_name && last_name
          ? `${first_name} ${last_name}`
          : email_addresses[0].email_address.split("@")[0];

      const updateData: any = {
        email: email_addresses[0].email_address,
        name: fullName,
        firstName: first_name,
        lastName: last_name,
        photoUrl: image_url,
        lastLogin: new Date(),
      };

      const user = await User.findOneAndUpdate(
        { clerkId: id },
        updateData,
        { new: true }
      );

      console.log("✅ User updated in MongoDB:", user?._id);
    } catch (error) {
      console.error("Error updating user in MongoDB:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      const user = await User.findOneAndDelete({ clerkId: id });
      console.log("✅ User deleted from MongoDB:", user?._id);
    } catch (error) {
      console.error("Error deleting user from MongoDB:", error);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
