import { API_ENDPOINTS } from "@/constants/api";
import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
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

const STRESS_LEVELS = [
  { label: "Select Stress Level", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const ANXIETY_LEVELS = [
  { label: "Select Anxiety Level", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function MentalHealthDashboard() {
  const { userId } = useAuth();
  const { user } = useUser();

  // Mental health log fields
  const [moodRating, setMoodRating] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [phq9Score, setPhq9Score] = useState("");
  const [gad7Score, setGad7Score] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!moodRating) {
      Alert.alert("Error", "Mood rating is required");
      return;
    }

    // Range validations
    const mood = parseInt(moodRating);
    const sleepHrs = sleepHours ? parseFloat(sleepHours) : null;
    const sleepQual = sleepQuality ? parseInt(sleepQuality) : null;
    const phq9 = phq9Score ? parseInt(phq9Score) : null;
    const gad7 = gad7Score ? parseInt(gad7Score) : null;

    if (mood < 1 || mood > 10) {
      Alert.alert("Invalid Range", "Mood rating should be between 1-10");
      return;
    }
    if (sleepHrs !== null && (sleepHrs < 0 || sleepHrs > 24)) {
      Alert.alert("Invalid Range", "Sleep hours should be between 0-24");
      return;
    }
    if (sleepQual !== null && (sleepQual < 1 || sleepQual > 10)) {
      Alert.alert("Invalid Range", "Sleep quality should be between 1-10");
      return;
    }
    if (phq9 !== null && (phq9 < 0 || phq9 > 27)) {
      Alert.alert("Invalid Range", "PHQ-9 score should be between 0-27");
      return;
    }
    if (gad7 !== null && (gad7 < 0 || gad7 > 21)) {
      Alert.alert("Invalid Range", "GAD-7 score should be between 0-21");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.MENTAL_HEALTH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: userId,
          mood_rating: mood,
          stress_level: stressLevel || null,
          anxiety_level: anxietyLevel || null,
          sleep_hours: sleepHrs,
          sleep_quality: sleepQual,
          phq9_score: phq9,
          gad7_score: gad7,
          notes: notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit mental health log");
      }

      Alert.alert("Success", "Mental health log recorded successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Clear all form fields
            setMoodRating("");
            setStressLevel("");
            setAnxietyLevel("");
            setSleepHours("");
            setSleepQuality("");
            setPhq9Score("");
            setGad7Score("");
            setNotes("");
          },
        },
      ]);
    } catch (err: any) {
      console.error("Submit mental health log error:", err);
      Alert.alert("Error", err.message || "Failed to submit mental health log");
    } finally {
      setLoading(false);
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mental Health Check-in</Text>
          <Text style={styles.subtitle}>
            Hi {user?.firstName}, how are you feeling today?
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Mood Rating */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>😊 Mood Rating</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                How&apos;s your mood today? (1-10) *
              </Text>
              <Text style={styles.helpText}>1 = Very Poor, 10 = Excellent</Text>
              <TextInput
                style={styles.input}
                placeholder="7"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={moodRating}
                onChangeText={setMoodRating}
              />
            </View>
          </View>

          {/* Stress Level */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>😰 Stress Level</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current stress level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={stressLevel}
                  onValueChange={setStressLevel}
                  style={styles.picker}
                >
                  {STRESS_LEVELS.map((level) => (
                    <Picker.Item
                      key={level.value}
                      label={level.label}
                      value={level.value}
                      color={colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Anxiety Level */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>😟 Anxiety Level</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current anxiety level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={anxietyLevel}
                  onValueChange={setAnxietyLevel}
                  style={styles.picker}
                >
                  {ANXIETY_LEVELS.map((level) => (
                    <Picker.Item
                      key={level.value}
                      label={level.label}
                      value={level.value}
                      color={colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Sleep Hours */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>😴 Sleep</Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Hours of sleep</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={sleepHours}
                  onChangeText={setSleepHours}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Sleep quality (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="7"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={sleepQuality}
                  onChangeText={setSleepQuality}
                />
              </View>
            </View>
          </View>

          {/* Clinical Assessments */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📋 Clinical Assessments</Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>PHQ-9 Score (0-27)</Text>
                <Text style={styles.helpText}>Depression scale</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={phq9Score}
                  onChangeText={setPhq9Score}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>GAD-7 Score (0-21)</Text>
                <Text style={styles.helpText}>Anxiety scale</Text>
                <TextInput
                  style={styles.input}
                  placeholder="3"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={gad7Score}
                  onChangeText={setGad7Score}
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📝 Additional Notes</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                How are you feeling today? (Optional)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any thoughts, feelings, or concerns you'd like to share..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Recording..." : "Record Mental Health Log"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  sectionContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
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
  rowInputs: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  helpText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray500,
  },
  submitButtonText: {
    color: colors.textWhite,
    fontSize: fontSizes.lg,
    fontWeight: "bold",
  },
});
