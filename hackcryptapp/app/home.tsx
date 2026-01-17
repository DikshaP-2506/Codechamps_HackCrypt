import { API_ENDPOINTS } from "@/constants/api";
import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
export default function HomeScreen() {
  const { signOut, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUserRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.USERS_PROFILE}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error("Fetch role error:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  const navigateToDashboard = () => {
    if (userRole === "doctor") {
      router.push("/doctor-dashboard" as any);
    } else if (userRole === "patient") {
      router.push("/patient-dashboard" as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>HC</Text>
        </View>
        <Text style={styles.title}>Welcome to HealthCrypt</Text>
        <Text style={styles.subtitle}>
          Hello,{" "}
          {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}!
        </Text>
      </View>

      {userRole === "doctor" && (
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={navigateToDashboard}
        >
          <Text style={styles.dashboardButtonText}>Go to Doctor Dashboard</Text>
        </TouchableOpacity>
      )}

      {userRole === "patient" && (
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={navigateToDashboard}
        >
          <Text style={styles.dashboardButtonText}>
            Go to Patient Dashboard
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>User Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>
            {user?.emailAddresses[0]?.emailAddress || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>
            {user?.firstName || user?.lastName
              ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
              : "Not set"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  dashboardButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  dashboardButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSizes.sm,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  signOutButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: colors.textWhite,
  },
});
