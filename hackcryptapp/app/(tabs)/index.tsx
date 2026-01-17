import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const QuickActionCard = ({
    icon,
    title,
    description,
    onPress,
    backgroundColor = "#4A90A4",
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
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionDescription}>{description}</Text>
        </View>
      </View>
      <Text style={styles.quickActionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Health Dashboard</Text>
            <Text style={styles.welcomeText}>
              Welcome back! Track your health journey with our comprehensive
              monitoring tools
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <QuickActionCard
              icon="🩺"
              title="Physical Vitals"
              description="Record blood pressure, heart rate, and more"
              onPress={() => router.push("/(tabs)/physical-vitals")}
              backgroundColor="#4A90A4"
            />

            <QuickActionCard
              icon="🧠"
              title="Mental Health"
              description="Log your mood, stress, and wellness"
              onPress={() => router.push("/(tabs)/mental-health")}
              backgroundColor="#6B46C1"
            />

            <QuickActionCard
              icon="💊"
              title="Medication Reminders"
              description="Smart reminders with photo confirmation"
              onPress={() => router.push("/(tabs)/dashboard-home")}
              backgroundColor="#4A90A4"
            />

            <QuickActionCard
              icon="👤"
              title="Profile"
              description="View and manage your account"
              onPress={() => router.push("/(tabs)/profile")}
              backgroundColor="#4A90A4"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  quickActionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  quickActionArrow: {
    fontSize: 20,
    color: "#9CA3AF",
    marginLeft: 8,
  },
});
