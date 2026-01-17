import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/Header";
import {
    borderRadius,
    colors,
    fonts,
    fontSizes,
    shadows,
    spacing,
} from "../../constants/healthcare-theme";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
}

export default function ProfileScreen() {
  const { userId, signOut } = useAuth();
  const { user } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock profile data for testing
    setProfileData({
      firstName: user?.firstName || "John",
      lastName: user?.lastName || "Doe",
      email: user?.emailAddresses?.[0]?.emailAddress || "john.doe@example.com",
      dateOfBirth: "1990-01-01",
      gender: "Male",
    });
    setLoading(false);
  }, [user]);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/sign-in");
          } catch {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const ProfileItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value?: string;
  }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemHeader}>
        <Text style={styles.profileIcon}>{icon}</Text>
        <Text style={[styles.profileLabel, fonts.medium]}>{label}</Text>
      </View>
      <Text style={[styles.profileValue, fonts.regular]}>
        {value || "Not provided"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Profile"
          subtitle="Your account information"
          backgroundColor={colors.accent}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, fonts.regular]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Header
        title="Profile"
        subtitle="Your account information"
        backgroundColor={colors.accent}
      />

      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.profilePhotoSection}>
          <View style={styles.profilePhotoContainer}>
            {user?.hasImage ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Text style={[styles.profilePhotoInitials, fonts.bold]}>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.profileName, fonts.bold]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.profileEmail, fonts.regular]}>
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, fonts.bold]}>
            Personal Information
          </Text>

          <ProfileItem
            icon="👤"
            label="Full Name"
            value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
          />

          <ProfileItem
            icon="📧"
            label="Email"
            value={user?.emailAddresses[0]?.emailAddress}
          />

          <ProfileItem
            icon="🎂"
            label="Date of Birth"
            value={profileData?.dateOfBirth}
          />

          <ProfileItem icon="⚧" label="Gender" value={profileData?.gender} />

          <ProfileItem
            icon="📱"
            label="Phone Number"
            value={
              user?.phoneNumbers?.[0]?.phoneNumber || profileData?.phone || ""
            }
          />

          <ProfileItem icon="🆔" label="User ID" value={userId || ""} />
        </View>

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, fonts.bold]}>Account Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Profile editing will be available soon",
              )
            }
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, fonts.medium]}>
                Edit Profile
              </Text>
              <Text style={[styles.actionSubtitle, fonts.regular]}>
                Update your personal information
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Coming Soon", "Settings will be available soon")
            }
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, fonts.medium]}>Settings</Text>
              <Text style={[styles.actionSubtitle, fonts.regular]}>
                App preferences and privacy
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Health history will be available soon",
              )
            }
          >
            <Text style={styles.actionIcon}>📊</Text>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, fonts.medium]}>
                Health History
              </Text>
              <Text style={[styles.actionSubtitle, fonts.regular]}>
                View your health data trends
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={[styles.signOutText, fonts.bold]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  profilePhotoSection: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  profilePhotoContainer: {
    marginBottom: spacing.md,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhotoInitials: {
    fontSize: fontSizes.xxxl,
    color: colors.textWhite,
  },
  profileName: {
    fontSize: fontSizes.xxl,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  infoSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  profileItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  profileItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  profileIcon: {
    fontSize: fontSizes.md,
    marginRight: spacing.sm,
  },
  profileLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  profileValue: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.xl,
  },
  actionsSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  actionIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  actionArrow: {
    fontSize: fontSizes.xl,
    color: colors.textSecondary,
  },
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  signOutText: {
    fontSize: fontSizes.lg,
    color: colors.textWhite,
  },
});
