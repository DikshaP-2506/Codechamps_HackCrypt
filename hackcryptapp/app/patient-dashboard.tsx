import { API_ENDPOINTS } from "@/constants/api";
import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PatientDashboard() {
  const { userId } = useAuth();

  // All fields from your physical vitals schema
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState(""); // spo2
  const [weight, setWeight] = useState("");
  const [hemoglobin, setHemoglobin] = useState(""); // hb
  const [bmi, setBmi] = useState("");
  const [notes, setNotes] = useState("");

  // Mental health fields
  const [moodRating, setMoodRating] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [mentalNotes, setMentalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [mentalHealthLoading, setMentalHealthLoading] = useState(false);

  const handleSubmit = async () => {
    // Core vital signs validation
    if (
      !bloodPressureSystolic ||
      !bloodPressureDiastolic ||
      !heartRate ||
      !oxygenLevel
    ) {
      Alert.alert(
        "Error",
        "Please fill all core vital signs (Blood Pressure, Heart Rate, Oxygen Level)",
      );
      return;
    }

    // Range validations with your schema limits
    const bpSys = parseInt(bloodPressureSystolic);
    const bpDia = parseInt(bloodPressureDiastolic);
    const hr = parseInt(heartRate);
    const o2 = parseInt(oxygenLevel);

    // Optional field parsing
    const sugar = bloodSugar ? parseInt(bloodSugar) : null;
    const respRate = respiratoryRate ? parseInt(respiratoryRate) : null;
    const temp = temperature ? parseFloat(temperature) : null;
    const wt = weight ? parseFloat(weight) : null;
    const hb = hemoglobin ? parseFloat(hemoglobin) : null;
    const bmiVal = bmi ? parseFloat(bmi) : null;

    // Validate core vitals according to your schema
    if (bpSys < 0 || bpSys > 300) {
      Alert.alert("Invalid Range", "Systolic BP should be between 0-300 mmHg");
      return;
    }
    if (bpDia < 0 || bpDia > 200) {
      Alert.alert("Invalid Range", "Diastolic BP should be between 0-200 mmHg");
      return;
    }
    if (hr < 0 || hr > 300) {
      Alert.alert("Invalid Range", "Heart Rate should be between 0-300 bpm");
      return;
    }
    if (o2 < 0 || o2 > 100) {
      Alert.alert("Invalid Range", "SpO2 should be between 0-100%");
      return;
    }

    // Validate optional fields if provided
    if (sugar !== null && (sugar < 0 || sugar > 1000)) {
      Alert.alert(
        "Invalid Range",
        "Blood Sugar should be between 0-1000 mg/dL",
      );
      return;
    }
    if (respRate !== null && (respRate < 0 || respRate > 100)) {
      Alert.alert(
        "Invalid Range",
        "Respiratory Rate should be between 0-100 breaths/min",
      );
      return;
    }
    if (temp !== null && (temp < 90 || temp > 110)) {
      Alert.alert("Invalid Range", "Temperature should be between 90-110°F");
      return;
    }
    if (wt !== null && (wt < 0 || wt > 500)) {
      Alert.alert("Invalid Range", "Weight should be between 0-500 kg");
      return;
    }
    if (hb !== null && (hb < 0 || hb > 25)) {
      Alert.alert("Invalid Range", "Hemoglobin should be between 0-25 g/dL");
      return;
    }
    if (bmiVal !== null && (bmiVal < 0 || bmiVal > 100)) {
      Alert.alert("Invalid Range", "BMI should be between 0-100");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.VITALS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: userId,
          systolic_bp: bpSys,
          diastolic_bp: bpDia,
          heart_rate: hr,
          blood_sugar: sugar,
          respiratory_rate: respRate,
          temperature: temp,
          spo2: o2,
          weight: wt,
          hb: hb,
          bmi: bmiVal,
          measurement_method: "manual_entry",
          notes: notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit vitals");
      }

      Alert.alert("Success", "Vitals recorded successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Clear all form fields
            setBloodPressureSystolic("");
            setBloodPressureDiastolic("");
            setHeartRate("");
            setBloodSugar("");
            setRespiratoryRate("");
            setTemperature("");
            setOxygenLevel("");
            setWeight("");
            setHemoglobin("");
            setBmi("");
            setNotes("");
          },
        },
      ]);
    } catch (err: any) {
      console.error("Submit vitals error:", err);
      Alert.alert("Error", err.message || "Failed to submit vitals");
    } finally {
      setLoading(false);
    }
  };

  const handleMentalHealthSubmit = async () => {
    // At least mood rating or stress/anxiety level required
    if (!moodRating && !stressLevel && !anxietyLevel) {
      Alert.alert(
        "Error",
        "Please fill at least mood rating or stress/anxiety level",
      );
      return;
    }

    setMentalHealthLoading(true);

    try {
      const payload = {
        patient_id: userId,
        mood_rating: moodRating ? parseInt(moodRating) : null,
        stress_level: stressLevel || null,
        anxiety_level: anxietyLevel || null,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
        sleep_quality: sleepQuality ? parseInt(sleepQuality) : null,
        notes: mentalNotes.trim() || null,
        recorded_by: userId,
      };

      const response = await fetch(API_ENDPOINTS.MENTAL_HEALTH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit mental health log");
      }

      Alert.alert("Success", "Mental health log recorded successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Clear mental health form fields
            setMoodRating("");
            setStressLevel("");
            setAnxietyLevel("");
            setSleepHours("");
            setSleepQuality("");
            setMentalNotes("");
          },
        },
      ]);
    } catch (err: any) {
      console.error("Submit mental health error:", err);
      Alert.alert("Error", err.message || "Failed to submit mental health log");
    } finally {
      setMentalHealthLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Track your physical vitals and mental health
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Blood Pressure */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🩺 Blood Pressure</Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Systolic (mmHg) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="120"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={bloodPressureSystolic}
                  onChangeText={setBloodPressureSystolic}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Diastolic (mmHg) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="80"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={bloodPressureDiastolic}
                  onChangeText={setBloodPressureDiastolic}
                />
              </View>
            </View>
          </View>

          {/* Heart Rate */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>💓 Heart Rate</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heart Rate (bpm) *</Text>
              <TextInput
                style={styles.input}
                placeholder="72"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={heartRate}
                onChangeText={setHeartRate}
              />
            </View>
          </View>

          {/* Oxygen Level (SpO2) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🫁 Oxygen Level (SpO2)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>SpO2 (%) *</Text>
              <TextInput
                style={styles.input}
                placeholder="98"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={oxygenLevel}
                onChangeText={setOxygenLevel}
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🩸 Blood Sugar</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={bloodSugar}
                onChangeText={setBloodSugar}
              />
            </View>
          </View>

          {/* Respiratory Rate */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🌬️ Respiratory Rate</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Respiratory Rate (breaths/min)</Text>
              <TextInput
                style={styles.input}
                placeholder="16"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={respiratoryRate}
                onChangeText={setRespiratoryRate}
              />
            </View>
          </View>

          {/* Temperature */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🌡️ Temperature</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Temperature (°F)</Text>
              <TextInput
                style={styles.input}
                placeholder="98.6"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={temperature}
                onChangeText={setTemperature}
              />
            </View>
          </View>

          {/* Weight */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>⚖️ Weight</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="70.5"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          {/* Hemoglobin */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🩸 Hemoglobin</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hemoglobin (g/dL)</Text>
              <TextInput
                style={styles.input}
                placeholder="14.0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={hemoglobin}
                onChangeText={setHemoglobin}
              />
            </View>
          </View>

          {/* BMI */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📊 BMI</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>BMI (kg/m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="22.5"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={bmi}
                onChangeText={setBmi}
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📝 Additional Notes</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any symptoms, medication changes, or observations..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Submitting..." : "Submit Vitals"}
            </Text>
          </TouchableOpacity>

          {/* Mental Health Section */}
          <View style={[styles.sectionContainer, { marginTop: spacing.xl }]}>
            <Text style={styles.sectionTitle}>🧠 Mental Health Log</Text>

            {/* Mood Rating */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mood Rating (1-10)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mood rating (1=Very sad, 10=Very happy)"
                placeholderTextColor={colors.textSecondary}
                value={moodRating}
                onChangeText={setMoodRating}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            {/* Stress Level */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Stress Level</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    stressLevel === "Low" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setStressLevel("Low")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      stressLevel === "Low" && styles.optionButtonTextSelected,
                    ]}
                  >
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    stressLevel === "Medium" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setStressLevel("Medium")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      stressLevel === "Medium" &&
                        styles.optionButtonTextSelected,
                    ]}
                  >
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    stressLevel === "High" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setStressLevel("High")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      stressLevel === "High" && styles.optionButtonTextSelected,
                    ]}
                  >
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Anxiety Level */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Anxiety Level</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    anxietyLevel === "Low" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setAnxietyLevel("Low")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      anxietyLevel === "Low" && styles.optionButtonTextSelected,
                    ]}
                  >
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    anxietyLevel === "Medium" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setAnxietyLevel("Medium")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      anxietyLevel === "Medium" &&
                        styles.optionButtonTextSelected,
                    ]}
                  >
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    anxietyLevel === "High" && styles.optionButtonSelected,
                  ]}
                  onPress={() => setAnxietyLevel("High")}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      anxietyLevel === "High" &&
                        styles.optionButtonTextSelected,
                    ]}
                  >
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sleep Hours */}
            <View style={styles.twoColumnContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sleep Hours</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hours (0-24)"
                  placeholderTextColor={colors.textSecondary}
                  value={sleepHours}
                  onChangeText={setSleepHours}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sleep Quality (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rate quality"
                  placeholderTextColor={colors.textSecondary}
                  value={sleepQuality}
                  onChangeText={setSleepQuality}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            {/* Mental Health Notes */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mental Health Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any thoughts, feelings, or mental health observations..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={mentalNotes}
                onChangeText={setMentalNotes}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: "#6B46C1" },
                mentalHealthLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleMentalHealthSubmit}
              disabled={mentalHealthLoading}
            >
              <Text style={styles.submitButtonText}>
                {mentalHealthLoading
                  ? "Submitting..."
                  : "Submit Mental Health Log"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Vitals history feature will be available soon",
              )
            }
          >
            <Text style={styles.historyButtonText}>View Vitals History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.primaryLight,
  },
  formContainer: {
    padding: spacing.lg,
  },
  sectionContainer: {
    backgroundColor: colors.textWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: spacing.md,
  },
  twoColumnContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  moodButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.gray200,
    minWidth: 70,
  },
  moodButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  moodLabelActive: {
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
    ...shadows.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  historyButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  historyButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: colors.primary,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  optionButtonTextSelected: {
    color: colors.primary,
  },
});
