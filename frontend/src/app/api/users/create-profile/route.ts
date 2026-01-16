import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { phone, role, dateOfBirth, gender } = body;

    // Validate required fields
    if (!phone || !role || !dateOfBirth || !gender) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user already exists by clerkId or email
    let user = await User.findOne({
      $or: [{ clerkId: userId }, { email: clerkUser.emailAddresses[0].emailAddress }],
    });

    if (user) {
      // User exists - update their profile instead
      user = await User.findOneAndUpdate(
        { _id: user._id },
        {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          phone,
          role,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          photoUrl: clerkUser.imageUrl,
          isActive: true,
          lastLogin: new Date(),
        },
        { new: true }
      );

      return Response.json(
        { message: "Profile updated successfully", user },
        { status: 200 }
      );
    }

    // Create new user in MongoDB
    user = await User.create({
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      phone,
      role,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      photoUrl: clerkUser.imageUrl,
      isActive: true,
      lastLogin: new Date(),
    });

    return Response.json(
      { message: "Profile created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
