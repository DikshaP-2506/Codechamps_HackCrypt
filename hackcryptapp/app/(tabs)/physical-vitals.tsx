import { useAuth } from "@clerk/clerk-expo";
import React, { useState } from "react";
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
import Header from "../../components/Header";
import { API_ENDPOINTS } from "../../constants/api";
import {
    borderRadius,
    colors,
    fonts,
    fontSizes,
    shadows,
    spacing,
} from "../../constants/healthcare-theme";

export default function PhysicalVitalsScreen() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  // Physical vitals state
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [spo2, setSpo2] = useState("");
  const [weight, setWeight] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [bmi, setBmi] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!bloodPressureSystolic || !bloodPressureDiastolic || !heartRate) {
      Alert.alert(
        "Error",
        "Please fill in at least blood pressure and heart rate",
      );
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
          systolic_bp: parseInt(bloodPressureSystolic),
          diastolic_bp: parseInt(bloodPressureDiastolic),
          heart_rate: parseInt(heartRate),
          blood_sugar: bloodSugar ? parseInt(bloodSugar) : null,
          respiratory_rate: respiratoryRate ? parseInt(respiratoryRate) : null,
          temperature: temperature ? parseFloat(temperature) : null,
          spo2: spo2 ? parseInt(spo2) : null,
          weight: weight ? parseFloat(weight) : null,
          hb: hemoglobin ? parseFloat(hemoglobin) : null,
          bmi: bmi ? parseFloat(bmi) : null,
          notes: notes.trim() || null,
          recorded_by: userId,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Vitals recorded successfully");
        // Clear form
        setBloodPressureSystolic("");
        setBloodPressureDiastolic("");
        setHeartRate("");
        setBloodSugar("");
        setRespiratoryRate("");
        setTemperature("");
        setSpo2("");
        setWeight("");
        setHemoglobin("");
        setBmi("");
        setNotes("");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to record vitals");
      }
    } catch {
      Alert.alert("Error", "Network request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header
        title="Physical Vitals"
        subtitle="Track your daily health measurements"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Blood Pressure */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              🩺 Blood Pressure
            </Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Systolic (mmHg) *
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="120"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={bloodPressureSystolic}
                  onChangeText={setBloodPressureSystolic}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Diastolic (mmHg) *
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
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
            <Text style={[styles.sectionTitle, fonts.bold]}>❤️ Heart Rate</Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, fonts.medium]}>
                Beats Per Minute *
              </Text>
              <TextInput
                style={[styles.input, fonts.regular]}
                placeholder="72"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={heartRate}
                onChangeText={setHeartRate}
              />
            </View>
          </View>

          {/* Blood Sugar */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              🩸 Blood Sugar
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, fonts.medium]}>mg/dL (Optional)</Text>
              <TextInput
                style={[styles.input, fonts.regular]}
                placeholder="100"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={bloodSugar}
                onChangeText={setBloodSugar}
              />
            </View>
          </View>

          {/* Additional Vitals */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              📊 Additional Measurements
            </Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Respiratory Rate
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="16"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={respiratoryRate}
                  onChangeText={setRespiratoryRate}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Temperature (°F)
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="98.6"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={temperature}
                  onChangeText={setTemperature}
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>SpO2 (%)</Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="98"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={spo2}
                  onChangeText={setSpo2}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>Weight (lbs)</Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="150"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Hemoglobin (g/dL)
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="12.5"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={hemoglobin}
                  onChangeText={setHemoglobin}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>BMI</Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="22.5"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={bmi}
                  onChangeText={setBmi}
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              📝 Additional Notes
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, fonts.medium]}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, fonts.regular]}
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
            <Text style={[styles.submitButtonText, fonts.bold]}>
              {loading ? "Submitting..." : "Submit Vitals"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  formContainer: {
    padding: spacing.lg,
  },
  sectionContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
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
  halfInput: {
    flex: 1,
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
    color: colors.textWhite,
  },
});
