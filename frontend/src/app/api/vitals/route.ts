import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the PhysicalVitals schema for the frontend
const physicalVitalsSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  recorded_by: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  recorded_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  systolic_bp: Number,
  diastolic_bp: Number,
  heart_rate: Number,
  blood_sugar: Number,
  respiratory_rate: Number,
  temperature: Number,
  spo2: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  measurement_method: {
    type: String,
    default: 'manual_entry'
  },
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'physical_vitals'
});

// Use existing model if available, otherwise create new one
const PhysicalVitals = mongoose.models.PhysicalVitals || mongoose.model('PhysicalVitals', physicalVitalsSchema);

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body.patient_id) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      );
    }

    // Calculate BMI if height and weight are provided
    if (body.height && body.weight) {
      const heightInMeters = body.height / 100; // Convert cm to meters
      body.bmi = parseFloat((body.weight / (heightInMeters * heightInMeters)).toFixed(2));
    }

    // Create new vitals record
    const vitals = new PhysicalVitals({
      patient_id: body.patient_id,
      recorded_by: body.recorded_by || null,
      recorded_at: body.recorded_at || new Date(),
      systolic_bp: body.systolic_bp || null,
      diastolic_bp: body.diastolic_bp || null,
      heart_rate: body.heart_rate || null,
      blood_sugar: body.blood_sugar || null,
      respiratory_rate: body.respiratory_rate || null,
      temperature: body.temperature || null,
      spo2: body.spo2 || null,
      weight: body.weight || null,
      height: body.height || null,
      bmi: body.bmi || null,
      measurement_method: body.measurement_method || 'manual_entry',
      notes: body.notes || ''
    });

    // Save to database
    await vitals.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Vitals saved successfully",
        data: vitals
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error saving vitals:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to save vitals" 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patient_id');

    let query = {};
    if (patientId) {
      query = { patient_id: patientId };
    }

    const vitals = await PhysicalVitals.find(query)
      .sort({ recorded_at: -1 })
      .limit(50);

    return NextResponse.json(
      { 
        success: true, 
        data: vitals,
        count: vitals.length
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching vitals:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch vitals" 
      },
      { status: 500 }
    );
  }
}
