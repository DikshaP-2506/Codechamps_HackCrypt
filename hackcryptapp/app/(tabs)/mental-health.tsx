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

export default function MentalHealthScreen() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mental health state
  const [moodRating, setMoodRating] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [mentalNotes, setMentalNotes] = useState("");

  const handleSubmit = async () => {
    if (!moodRating && !stressLevel && !anxietyLevel) {
      Alert.alert(
        "Error",
        "Please fill in at least mood rating or stress/anxiety level",
      );
      return;
    }

    setLoading(true);

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

      if (response.ok) {
        Alert.alert("Success", "Mental health log recorded successfully");
        // Clear form
        setMoodRating("");
        setStressLevel("");
        setAnxietyLevel("");
        setSleepHours("");
        setSleepQuality("");
        setMentalNotes("");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.error || "Failed to record mental health log",
        );
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
        title="Mental Health"
        subtitle="Track your mental wellness journey"
        backgroundColor="#6B46C1"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Mood Rating */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              😊 Mood Rating
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, fonts.medium]}>
                How would you rate your overall mood today? (1-10)
              </Text>
              <Text style={[styles.helpText, fonts.regular]}>
                1 = Very sad/depressed, 10 = Very happy/euphoric
              </Text>
              <TextInput
                style={[styles.input, fonts.regular]}
                placeholder="Enter mood rating (1-10)"
                placeholderTextColor={colors.textSecondary}
                value={moodRating}
                onChangeText={setMoodRating}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          {/* Stress Level */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              😰 Stress Level
            </Text>
            <Text style={[styles.label, fonts.medium]}>
              How stressed do you feel today?
            </Text>
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
                    fonts.medium,
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
                    fonts.medium,
                    stressLevel === "Medium" && styles.optionButtonTextSelected,
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
                    fonts.medium,
                    stressLevel === "High" && styles.optionButtonTextSelected,
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Anxiety Level */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              😨 Anxiety Level
            </Text>
            <Text style={[styles.label, fonts.medium]}>
              How anxious do you feel today?
            </Text>
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
                    fonts.medium,
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
                    fonts.medium,
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
                    fonts.medium,
                    anxietyLevel === "High" && styles.optionButtonTextSelected,
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sleep Tracking */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              😴 Sleep Tracking
            </Text>
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>Sleep Hours</Text>
                <Text style={[styles.helpText, fonts.regular]}>
                  How many hours did you sleep?
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="8.5"
                  placeholderTextColor={colors.textSecondary}
                  value={sleepHours}
                  onChangeText={setSleepHours}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={[styles.label, fonts.medium]}>
                  Sleep Quality (1-10)
                </Text>
                <Text style={[styles.helpText, fonts.regular]}>
                  How well did you sleep?
                </Text>
                <TextInput
                  style={[styles.input, fonts.regular]}
                  placeholder="7"
                  placeholderTextColor={colors.textSecondary}
                  value={sleepQuality}
                  onChangeText={setSleepQuality}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          {/* Mental Health Notes */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              📝 Mental Health Notes
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, fonts.medium]}>
                Additional Notes (Optional)
              </Text>
              <Text style={[styles.helpText, fonts.regular]}>
                Share any thoughts, feelings, or mental health observations from
                today
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, fonts.regular]}
                placeholder="Any thoughts, feelings, triggers, coping strategies, or observations..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={mentalNotes}
                onChangeText={setMentalNotes}
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
              {loading ? "Submitting..." : "Submit Mental Health Log"}
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
  rowInputs: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
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
    backgroundColor: "#EDE9FE",
    borderColor: "#6B46C1",
  },
  optionButtonText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  optionButtonTextSelected: {
    color: "#6B46C1",
  },
  submitButton: {
    backgroundColor: "#6B46C1",
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
