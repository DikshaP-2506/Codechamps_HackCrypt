import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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

export default function DashboardHome() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [todaysMedications, setTodaysMedications] = useState<any[]>([]);
  const [adherenceStats, setAdherenceStats] = useState({
    taken: 0,
    total: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);



  const fetchTodaysMedications = useCallback(async () => {
    try {
      // Mock data for Expo Go testing - no API calls needed
      const mockMedications = [
        {
          _id: 7756,
          patient_id: 9897,
          medication_name: "Metformin",
          dosage: "500mg",
          scheduled_time: "2026-01-17T08:00:00.000+00:00",
          instructions: "After meals",
          frequency: "Twice a day",
          taken: false,
          adherence_id: null,
          prescription_id: 2005,
        },
        {
          _id: 7757,
          patient_id: 9897,
          medication_name: "Lisinopril",
          dosage: "10mg",
          scheduled_time: "2026-01-17T09:00:00.000+00:00",
          instructions: "Once daily",
          frequency: "Once a day",
          taken: true,
          adherence_id: 1001,
          prescription_id: 2006,
        },
      ];

      setTodaysMedications(mockMedications);
      setAdherenceStats({ taken: 1, total: 2, streak: 5 });
      setLoading(false);
    } catch (error) {
      console.log("Error fetching medications:", error);
      setLoading(false);
    }
  }, [userId]);



  useEffect(() => {
    fetchTodaysMedications();
  }, [fetchTodaysMedications, userId]);



  const handleTakeMedication = async (medication: any) => {
    Alert.alert(
      "💊 Take Medication",
      `${medication.medication_name} ${medication.dosage}\\n${medication.instructions}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "📷 Take Photo",
          onPress: () => openCamera(medication),
          style: "default",
        },
        {
          text: "✓ Mark Taken",
          onPress: () => markAsTaken(medication, "manual"),
          style: "default",
        },
      ],
    );
  };

  const openCamera = async (medication: any) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to take photos",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await markAsTaken(medication, "photo", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const markAsTaken = async (
    medication: any,
    confirmationMethod = "manual",
    photoUri: string | null = null,
  ) => {
    try {
      const now = new Date().toISOString();

      // Create adherence record
      const adherenceData = {
        prescription_id: medication.prescription_id,
        patient_id: medication.patient_id,
        scheduled_time: medication.scheduled_time,
        taken_at: now,
        confirmed_by: userId,
        confirmation_method: confirmationMethod,
        photo_url: photoUri, // In real implementation, upload photo first
        notes: `Taken via ${confirmationMethod}`,
      };

      // Send to API
      try {
        const response = await fetch(API_ENDPOINTS.ADHERENCE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adherenceData),
        });

        if (!response.ok) {
          throw new Error("API call failed");
        }
      } catch (apiError) {
        console.log("API error, updating locally:", apiError);
        // Continue with local update even if API fails
      }

      // Update local state immediately
      setTodaysMedications((prev) =>
        prev.map((med) =>
          med === medication
            ? {
                ...med,
                taken: true,
                taken_at: now,
                confirmation_method: confirmationMethod,
              }
            : med,
        ),
      );

      setAdherenceStats((prev) => ({
        ...prev,
        taken: prev.taken + 1,
        streak: prev.streak + 1,
      }));

      const message =
        confirmationMethod === "photo"
          ? "✅ Medication recorded with photo confirmation!"
          : "✅ Medication marked as taken!";

      Alert.alert("Success", message);
    } catch (error) {
      Alert.alert("Error", "Failed to record medication");
      console.log("Error recording medication:", error);
    }
  };



  const MedicationCard = ({ medication }: { medication: any }) => {
    const scheduledTime = new Date(medication.scheduled_time);
    const isOverdue = scheduledTime < new Date() && !medication.taken;
    const timeStr = scheduledTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.medicationCard,
          medication.taken && styles.medicationCardTaken,
        ]}
      >
        <View style={styles.medicationHeader}>
          <View style={styles.medicationInfo}>
            <Text style={[styles.medicationName, fonts.bold]}>
              💊 {medication.medication_name}
            </Text>
            <Text style={[styles.medicationDosage, fonts.medium]}>
              {medication.dosage} • {timeStr}
            </Text>
            <Text style={[styles.medicationInstructions, fonts.regular]}>
              {medication.instructions}
            </Text>
          </View>
          <View style={styles.medicationStatus}>
            {medication.taken ? (
              <View style={styles.takenBadge}>
                <Text style={[styles.takenText, fonts.medium]}>✓ Taken</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.takeButton,
                  isOverdue && styles.takeButtonOverdue,
                ]}
                onPress={() => handleTakeMedication(medication)}
              >
                <Text style={[styles.takeButtonText, fonts.medium]}>
                  {isOverdue ? "⚠️ Overdue" : "📷 Take"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const QuickActionCard = ({
    icon,
    title,
    description,
    onPress,
    backgroundColor = colors.primary,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    backgroundColor?: string;
  }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { borderLeftColor: backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
        <View style={styles.quickActionText}>
          <Text style={[styles.quickActionTitle, fonts.bold]}>{title}</Text>
          <Text style={[styles.quickActionDescription, fonts.regular]}>
            {description}
          </Text>
        </View>
      </View>
      <Text style={styles.quickActionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Health Dashboard"
        subtitle={`Welcome back, ${user?.firstName || "User"}!`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, fonts.regular]}>
              Track your health journey with our comprehensive monitoring tools
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, fonts.bold]}>Quick Actions</Text>

            <QuickActionCard
              icon="🩺"
              title="Physical Vitals"
              description="Record blood pressure, heart rate, and more"
              onPress={() => router.push("/(tabs)/physical-vitals")}
              backgroundColor={colors.primary}
            />

            <QuickActionCard
              icon="🧠"
              title="Mental Health"
              description="Log your mood, stress, and wellness"
              onPress={() => router.push("/(tabs)/mental-health")}
              backgroundColor="#6B46C1"
            />

            <QuickActionCard
              icon="👤"
              title="Profile"
              description="View and manage your account"
              onPress={() => router.push("/(tabs)/profile")}
              backgroundColor={colors.accent}
            />
          </View>

          {/* Today's Medications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, fonts.bold]}>
                💊 Today&apos;s Medications
              </Text>
              <View style={styles.adherenceStats}>
                <Text style={[styles.adherenceText, fonts.medium]}>
                  {adherenceStats.taken}/{adherenceStats.total} taken •{" "}
                  {adherenceStats.streak} day streak
                </Text>
              </View>
            </View>



            {loading ? (
              <View style={styles.loadingCard}>
                <Text style={[styles.loadingText, fonts.regular]}>
                  Loading medications...
                </Text>
              </View>
            ) : todaysMedications.length > 0 ? (
              todaysMedications.map((medication, index) => (
                <MedicationCard key={index} medication={medication} />
              ))
            ) : (
              <View style={styles.noMedicationsCard}>
                <Text style={[styles.noMedicationsText, fonts.regular]}>
                  No medications scheduled for today
                </Text>
              </View>
            )}
          </View>

          {/* Health Summary */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, fonts.bold]}>
              Today&apos;s Summary
            </Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryIcon}>❤️</Text>
                  <Text style={[styles.summaryLabel, fonts.medium]}>
                    Vitals
                  </Text>
                  <Text style={[styles.summaryValue, fonts.regular]}>
                    Not recorded
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryIcon}>😊</Text>
                  <Text style={[styles.summaryLabel, fonts.medium]}>Mood</Text>
                  <Text style={[styles.summaryValue, fonts.regular]}>
                    Not recorded
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.summaryAction}>
                <Text style={[styles.summaryActionText, fonts.medium]}>
                  View Full History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, fonts.bold]}>Health Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, fonts.medium]}>
                  Daily Monitoring
                </Text>
                <Text style={[styles.tipText, fonts.regular]}>
                  Regular monitoring of your vitals and mental health helps
                  track patterns and improvements over time.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.lg,
  },
  welcomeSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  welcomeText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickActionCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    ...shadows.md,
  },
  quickActionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    fontSize: fontSizes.xxl,
    marginRight: spacing.md,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  quickActionArrow: {
    fontSize: fontSizes.xl,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryIcon: {
    fontSize: fontSizes.xl,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  summaryAction: {
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  summaryActionText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
  },
  tipCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    ...shadows.md,
  },
  tipIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Medication styles
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  adherenceStats: {
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  adherenceText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
  },
  medicationCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    ...shadows.md,
  },
  medicationCardTaken: {
    borderLeftColor: colors.success,
    opacity: 0.8,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  medicationDosage: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  medicationInstructions: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  medicationStatus: {
    alignItems: "flex-end",
  },
  takeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  takeButtonOverdue: {
    backgroundColor: colors.error,
  },
  takeButtonText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
  },
  takenBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  takenText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
  },
  loadingCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  noMedicationsCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  noMedicationsText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
