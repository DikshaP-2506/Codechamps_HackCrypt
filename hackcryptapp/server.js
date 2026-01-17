const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully");

    // Drop old incorrect indexes
    try {
      const collection = mongoose.connection.collection("users");
      await collection.dropIndex("clerkId_1").catch(() => {});
      console.log("✅ Old indexes cleaned");
    } catch (_err) {
      console.log("⚠️ Index cleanup skipped");
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["doctor", "nurse", "patient", "caregiver", "lab_reporter"],
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  profileCompleted: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const User = mongoose.model("User", userSchema);

// Patient Schema (matching existing database)
const patientSchema = new mongoose.Schema({
  clerk_user_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  blood_group: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  emergency_contact_name: {
    type: String,
  },
  emergency_contact_phone: {
    type: String,
  },
  address: {
    type: String,
  },
  allergies: [
    {
      type: String,
    },
  ],
  chronic_conditions: [
    {
      type: String,
    },
  ],
  past_surgeries: [
    {
      type: String,
    },
  ],
  family_history: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: "patient",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

patientSchema.pre("save", function () {
  this.updated_at = new Date();
});

const Patient = mongoose.model("Patient", patientSchema);

// Physical Vitals Schema (matching existing database structure)
const physicalVitalsSchema = new mongoose.Schema(
  {
    // Foreign Keys
    patient_id: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Patient ID is required"],
    },

    recorded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Can be optional if self-recorded
    },

    // Timestamp
    recorded_at: {
      type: Date,
      default: Date.now,
      required: [true, "Recording timestamp is required"],
    },

    // Vital Signs
    systolic_bp: {
      type: Number,
      min: [0, "Systolic BP cannot be negative"],
      max: [300, "Systolic BP seems too high"],
    },

    diastolic_bp: {
      type: Number,
      min: [0, "Diastolic BP cannot be negative"],
      max: [200, "Diastolic BP seems too high"],
    },

    heart_rate: {
      type: Number,
      min: [0, "Heart rate cannot be negative"],
      max: [300, "Heart rate seems too high"],
    },

    blood_sugar: {
      type: Number,
      min: [0, "Blood sugar cannot be negative"],
      max: [1000, "Blood sugar seems too high"],
    },

    respiratory_rate: {
      type: Number,
      min: [0, "Respiratory rate cannot be negative"],
      max: [100, "Respiratory rate seems too high"],
    },

    temperature: {
      type: Number,
      min: [90, "Temperature seems too low"],
      max: [110, "Temperature seems too high"],
    },

    spo2: {
      type: Number,
      min: [0, "SpO2 cannot be negative"],
      max: [100, "SpO2 cannot exceed 100%"],
    },

    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
      max: [500, "Weight seems too high"],
    },

    hb: {
      type: Number,
      min: [0, "Hemoglobin cannot be negative"],
      max: [25, "Hemoglobin seems too high"],
    },

    bmi: {
      type: Number,
      min: [0, "BMI cannot be negative"],
      max: [100, "BMI seems too high"],
    },

    // Metadata
    measurement_method: {
      type: String,
      enum: [
        "manual_entry",
        "patient_sync",
        "wearable_api",
        "clinical_device",
        "other",
      ],
      default: "manual_entry",
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual to check if blood pressure is normal
physicalVitalsSchema.virtual("bp_status").get(function () {
  if (this.systolic_bp && this.diastolic_bp) {
    if (this.systolic_bp < 120 && this.diastolic_bp < 80) return "Normal";
    if (this.systolic_bp < 130 && this.diastolic_bp < 80) return "Elevated";
    if (this.systolic_bp < 140 || this.diastolic_bp < 90) return "High Stage 1";
    if (this.systolic_bp < 180 || this.diastolic_bp < 120)
      return "High Stage 2";
    return "Hypertensive Crisis";
  }
  return null;
});

// Virtual to check temperature status
physicalVitalsSchema.virtual("temp_status").get(function () {
  if (this.temperature) {
    if (this.temperature < 97) return "Low";
    if (this.temperature <= 99) return "Normal";
    if (this.temperature <= 100.4) return "Slight Fever";
    if (this.temperature <= 103) return "Fever";
    return "High Fever";
  }
  return null;
});

// Indexes for better query performance
physicalVitalsSchema.index({ patient_id: 1 });
physicalVitalsSchema.index({ recorded_by: 1 });
physicalVitalsSchema.index({ recorded_at: -1 });
physicalVitalsSchema.index({ created_at: -1 });

// Use existing collection name from your database
const PhysicalVitals = mongoose.model(
  "PhysicalVitals",
  physicalVitalsSchema,
  "physical_vitals",
);

// Mental Health Log Schema
const mentalHealthLogSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
      index: true,
    },
    recorded_by: {
      type: String,
      required: true,
    },
    recorded_date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    mood_rating: {
      type: Number,
      min: 1,
      max: 10,
      required: false,
    },
    stress_level: {
      type: String,
      enum: ["Low", "Medium", "High", "low", "medium", "high"],
      required: false,
    },
    anxiety_level: {
      type: String,
      enum: ["Low", "Medium", "High", "low", "medium", "high"],
      required: false,
    },
    sleep_hours: {
      type: Number,
      min: 0,
      max: 24,
      required: false,
    },
    sleep_quality: {
      type: Number,
      min: 1,
      max: 10,
      required: false,
    },
    phq9_score: {
      type: Number,
      min: 0,
      max: 27,
      required: false,
    },
    gad7_score: {
      type: Number,
      min: 0,
      max: 21,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "mental_health_logs",
  },
);

// Indexes for efficient querying
mentalHealthLogSchema.index({ patient_id: 1, recorded_date: -1 });
mentalHealthLogSchema.index({ recorded_by: 1 });

// Virtual for anxiety severity
mentalHealthLogSchema.virtual("gad7_severity").get(function () {
  if (!this.gad7_score) return null;
  if (this.gad7_score <= 4) return "Minimal";
  if (this.gad7_score <= 9) return "Mild";
  if (this.gad7_score <= 14) return "Moderate";
  return "Severe";
});

// Virtual for depression severity
mentalHealthLogSchema.virtual("phq9_severity").get(function () {
  if (!this.phq9_score) return null;
  if (this.phq9_score <= 4) return "Minimal";
  if (this.phq9_score <= 9) return "Mild";
  if (this.phq9_score <= 14) return "Moderate";
  if (this.phq9_score <= 19) return "Moderately Severe";
  return "Severe";
});

// Ensure virtuals are included in JSON
mentalHealthLogSchema.set("toJSON", { virtuals: true });
mentalHealthLogSchema.set("toObject", { virtuals: true });

const MentalHealthLog = mongoose.model(
  "MentalHealthLog",
  mentalHealthLogSchema,
  "mental_health_logs",
);

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patient_id: {
    type: Number,
    required: true,
  },
  doctor_id: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  medication_name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration_days: {
    type: Number,
    required: true,
  },
  instructions: {
    type: String,
    default: "",
  },
  qr_code_url: {
    type: String,
    default: "",
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  completed_at: {
    type: Date,
    default: null,
  },
});

// Medical Adherence Schema
const medicalAdherenceSchema = new mongoose.Schema({
  prescription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    required: true,
  },
  patient_id: {
    type: Number,
    required: true,
  },
  scheduled_time: {
    type: Date,
    required: true,
  },
  taken_at: {
    type: Date,
    default: null,
  },
  confirmed_by: {
    type: String,
    required: true,
  },
  confirmation_method: {
    type: String,
    enum: ["manual", "photo", "scan"],
    default: "manual",
  },
  photo_url: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
});

const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema,
  "prescriptions",
);
const MedicalAdherence = mongoose.model(
  "MedicalAdherence",
  medicalAdherenceSchema,
  "medical_adherence",
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "HealthCrypt API Server Running" });
});

// Create/Update User Profile
app.post("/api/users/profile", async (req, res) => {
  try {
    const {
      clerkUserId,
      email,
      firstName,
      lastName,
      role,
      phone,
      dob,
      gender,
    } = req.body;

    // Validate required fields
    if (!clerkUserId || !email || !role || !phone || !dob || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists by clerkUserId OR email
    let user = await User.findOne({ $or: [{ clerkUserId }, { email }] });

    if (user) {
      // Update existing user
      user.clerkUserId = clerkUserId; // Update clerkUserId if it changed
      user.email = email;
      user.role = role;
      user.phone = phone;
      user.dob = new Date(dob);
      user.gender = gender;
      user.firstName = firstName;
      user.lastName = lastName;
      user.profileCompleted = true;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkUserId,
        email,
        firstName,
        lastName,
        role,
        phone,
        dob: new Date(dob),
        gender,
        profileCompleted: true,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Profile save error:", error);
    return res
      .status(500)
      .json({ error: "Failed to save profile", details: error.message });
  }
});

// Get User Profile by Clerk User ID
app.get("/api/users/profile/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res
      .status(500)
      .json({ error: "Failed to get profile", details: error.message });
  }
});

// ============= PATIENT MANAGEMENT APIs =============

// Get all patients with search and filters
app.get("/api/patients", async (req, res) => {
  try {
    const { search, is_active, blood_group, chronic_condition } = req.query;

    // Build query
    let query = { role: "patient" };

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by active status
    if (is_active !== undefined) {
      query.is_active = is_active === "true";
    }

    // Filter by blood group
    if (blood_group) {
      query.blood_group = blood_group;
    }

    // Filter by chronic condition
    if (chronic_condition) {
      query.chronic_conditions = { $in: [chronic_condition] };
    }

    const patients = await Patient.find(query).sort({ updated_at: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);
    return res
      .status(500)
      .json({ error: "Failed to get patients", details: error.message });
  }
});

// Get single patient by clerk_user_id
app.get("/api/patients/:clerk_user_id", async (req, res) => {
  try {
    const { clerk_user_id } = req.params;
    const patient = await Patient.findOne({ clerk_user_id });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient error:", error);
    return res
      .status(500)
      .json({ error: "Failed to get patient", details: error.message });
  }
});

// Create new patient
app.post("/api/patients", async (req, res) => {
  try {
    const {
      clerk_user_id,
      name,
      date_of_birth,
      gender,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      address,
      allergies,
      chronic_conditions,
      past_surgeries,
      family_history,
    } = req.body;

    // Validate required fields
    if (!clerk_user_id || !name || !date_of_birth || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const patient = await Patient.create({
      clerk_user_id,
      name,
      date_of_birth: new Date(date_of_birth),
      gender,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      address,
      allergies: allergies || [],
      chronic_conditions: chronic_conditions || [],
      past_surgeries: past_surgeries || [],
      family_history,
      is_active: true,
      role: "patient",
    });

    return res.status(201).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);
    return res
      .status(500)
      .json({ error: "Failed to create patient", details: error.message });
  }
});

// Update patient
app.put("/api/patients/:clerk_user_id", async (req, res) => {
  try {
    const { clerk_user_id } = req.params;
    const updates = req.body;

    const patient = await Patient.findOneAndUpdate(
      { clerk_user_id },
      { ...updates, updated_at: new Date() },
      { new: true, runValidators: true },
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update patient", details: error.message });
  }
});

// Delete patient
app.delete("/api/patients/:clerk_user_id", async (req, res) => {
  try {
    const { clerk_user_id } = req.params;
    const patient = await Patient.findOneAndDelete({ clerk_user_id });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete patient", details: error.message });
  }
});

// ============= MEDICATION MANAGEMENT APIs =============

// GET today's medications for a patient
app.get("/api/medications/today/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get active prescriptions for patient
    const prescriptions = await Prescription.find({
      patient_id: parseInt(patientId),
      is_active: true,
      $or: [{ completed_at: null }, { completed_at: { $gt: new Date() } }],
    });

    const todaysMedications = [];

    for (const prescription of prescriptions) {
      // Parse frequency to determine today's doses
      let doses = [];
      const freq = prescription.frequency.toLowerCase();

      if (freq.includes("once") || freq.includes("daily")) {
        doses = [{ hour: 8, minute: 0 }]; // 8 AM
      } else if (freq.includes("twice") || freq.includes("2")) {
        doses = [
          { hour: 8, minute: 0 }, // 8 AM
          { hour: 20, minute: 0 }, // 8 PM
        ];
      } else if (freq.includes("three") || freq.includes("3")) {
        doses = [
          { hour: 8, minute: 0 }, // 8 AM
          { hour: 14, minute: 0 }, // 2 PM
          { hour: 20, minute: 0 }, // 8 PM
        ];
      }

      // Create medication entries for today
      for (const dose of doses) {
        const scheduledTime = new Date();
        scheduledTime.setHours(dose.hour, dose.minute, 0, 0);

        // Check if already taken
        const adherenceRecord = await MedicalAdherence.findOne({
          prescription_id: prescription._id,
          scheduled_time: {
            $gte: new Date(scheduledTime.getTime() - 30 * 60 * 1000), // 30 min before
            $lte: new Date(scheduledTime.getTime() + 30 * 60 * 1000), // 30 min after
          },
        });

        todaysMedications.push({
          _id: prescription._id,
          patient_id: prescription.patient_id,
          medication_name: prescription.medication_name,
          dosage: prescription.dosage,
          scheduled_time: scheduledTime,
          instructions: prescription.instructions,
          frequency: prescription.frequency,
          taken: !!adherenceRecord?.taken_at,
          adherence_id: adherenceRecord?._id,
          prescription_id: prescription._id,
        });
      }
    }

    // Calculate adherence stats
    const totalToday = todaysMedications.length;
    const takenToday = todaysMedications.filter((med) => med.taken).length;

    // Get streak (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAdherence = await MedicalAdherence.find({
      patient_id: parseInt(patientId),
      taken_at: { $gte: sevenDaysAgo },
    }).sort({ taken_at: -1 });

    const streak = recentAdherence.length; // Simplified streak calculation

    return res.json({
      medications: todaysMedications,
      stats: {
        taken: takenToday,
        total: totalToday,
        streak: streak,
      },
    });
  } catch (error) {
    console.error("Get today's medications error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch medications", details: error.message });
  }
});

// POST record medication adherence
app.post("/api/medical-adherence", async (req, res) => {
  try {
    const {
      prescription_id,
      patient_id,
      scheduled_time,
      taken_at,
      confirmed_by,
      confirmation_method = "manual",
      photo_url = "",
      notes = "",
    } = req.body;

    const adherenceRecord = new MedicalAdherence({
      prescription_id,
      patient_id,
      scheduled_time: new Date(scheduled_time),
      taken_at: new Date(taken_at),
      confirmed_by,
      confirmation_method,
      photo_url,
      notes,
    });

    await adherenceRecord.save();

    return res.status(201).json({
      success: true,
      message: "Medication adherence recorded successfully",
      adherence: adherenceRecord,
    });
  } catch (error) {
    console.error("Record adherence error:", error);
    return res
      .status(500)
      .json({ error: "Failed to record adherence", details: error.message });
  }
});

// GET prescriptions for a patient
app.get("/api/prescriptions/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({
      patient_id: parseInt(patientId),
      is_active: true,
    }).sort({ created_at: -1 });

    return res.json({
      prescriptions,
    });
  } catch (error) {
    console.error("Get prescriptions error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch prescriptions", details: error.message });
  }
});

// GET adherence history
app.get("/api/medical-adherence/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const adherenceHistory = await MedicalAdherence.find({
      patient_id: parseInt(patientId),
      scheduled_time: { $gte: startDate },
    })
      .populate("prescription_id")
      .sort({ scheduled_time: -1 });

    return res.json({
      adherence: adherenceHistory,
    });
  } catch (error) {
    console.error("Get adherence history error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to fetch adherence history",
        details: error.message,
      });
  }
});

// ============= VITALS MANAGEMENT APIs =============

// Submit vitals
app.post("/api/vitals", async (req, res) => {
  try {
    const {
      patient_id,
      systolic_bp,
      diastolic_bp,
      blood_sugar,
      heart_rate,
      spo2,
      weight,
      temperature,
      respiratory_rate,
      hb,
      bmi,
      notes,
      measurement_method,
    } = req.body;

    // Validate required fields
    if (!patient_id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const vitals = await PhysicalVitals.create({
      patient_id,
      systolic_bp,
      diastolic_bp,
      blood_sugar,
      heart_rate,
      spo2,
      weight,
      temperature,
      respiratory_rate,
      hb,
      bmi,
      notes,
      measurement_method: measurement_method || "manual_entry",
    });

    return res.status(201).json({
      success: true,
      vitals,
    });
  } catch (error) {
    console.error("Submit vitals error:", error);
    return res
      .status(500)
      .json({ error: "Failed to submit vitals", details: error.message });
  }
});

// Get vitals history for a patient
app.get("/api/vitals/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { limit = 30 } = req.query;

    const vitals = await PhysicalVitals.find({ patient_id })
      .sort({ recorded_at: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: vitals.length,
      vitals,
    });
  } catch (error) {
    console.error("Get vitals error:", error);
    return res
      .status(500)
      .json({ error: "Failed to get vitals", details: error.message });
  }
});

// Get latest vitals for a patient
app.get("/api/vitals/:patient_id/latest", async (req, res) => {
  try {
    const { patient_id } = req.params;

    const vitals = await PhysicalVitals.findOne({ patient_id }).sort({
      recorded_at: -1,
    });

    if (!vitals) {
      return res.status(404).json({ error: "No vitals found" });
    }

    return res.status(200).json({
      success: true,
      vitals,
    });
  } catch (error) {
    console.error("Get latest vitals error:", error);
    return res
      .status(500)
      .json({ error: "Failed to get latest vitals", details: error.message });
  }
});

// ============= MENTAL HEALTH APIs =============

// Submit mental health log
app.post("/api/mental-health", async (req, res) => {
  try {
    const {
      patient_id,
      mood_rating,
      stress_level,
      anxiety_level,
      sleep_hours,
      sleep_quality,
      phq9_score,
      gad7_score,
      notes,
    } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const mentalHealthLog = await MentalHealthLog.create({
      patient_id,
      recorded_by: patient_id, // Self-reported
      mood_rating,
      stress_level: stress_level ? stress_level.toLowerCase() : null,
      anxiety_level: anxiety_level ? anxiety_level.toLowerCase() : null,
      sleep_hours,
      sleep_quality,
      phq9_score,
      gad7_score,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Mental health log recorded successfully",
      log: mentalHealthLog,
    });
  } catch (error) {
    console.error("Submit mental health log error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to submit mental health log",
        details: error.message,
      });
  }
});

// Get mental health logs for a patient
app.get("/api/mental-health/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;
    const limit = parseInt(req.query.limit) || 30;

    const logs = await MentalHealthLog.find({ patient_id })
      .sort({ recorded_date: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Get mental health logs error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to get mental health logs",
        details: error.message,
      });
  }
});

// Get latest mental health log for a patient
app.get("/api/mental-health/:patient_id/latest", async (req, res) => {
  try {
    const { patient_id } = req.params;

    const log = await MentalHealthLog.findOne({ patient_id }).sort({
      recorded_date: -1,
    });

    if (!log) {
      return res.status(404).json({ error: "No mental health logs found" });
    }

    return res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Get latest mental health log error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to get latest mental health log",
        details: error.message,
      });
  }
});

// Quick mood log (simplified for daily use)
app.post("/api/mental-health/quick-log", async (req, res) => {
  try {
    const { patient_id, mood_rating, stress_level, anxiety_level, notes } =
      req.body;

    if (!patient_id || !mood_rating) {
      return res
        .status(400)
        .json({ error: "Patient ID and mood rating are required" });
    }

    const mentalHealthLog = await MentalHealthLog.create({
      patient_id,
      recorded_by: patient_id,
      mood_rating,
      stress_level: stress_level ? stress_level.toLowerCase() : null,
      anxiety_level: anxiety_level ? anxiety_level.toLowerCase() : null,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Quick mood log recorded successfully",
      log: mentalHealthLog,
    });
  } catch (error) {
    console.error("Submit quick mood log error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to submit quick mood log",
        details: error.message,
      });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
