import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useAuth, useOAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
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

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already signed-in users
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/complete-profile");
    }
  }, [isSignedIn, router]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/complete-profile");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUpPress = useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive: oauthSetActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        const activeSetActive = oauthSetActive || setActive;
        if (activeSetActive) {
          await activeSetActive({ session: createdSessionId });
          router.replace("/complete-profile");
        }
      }
    } catch (err: any) {
      console.error("OAuth error:", err);

      // Handle already signed in case
      if (err.message && err.message.includes("You're already signed in")) {
        Alert.alert(
          "Already Signed In",
          "You are already signed in. Redirecting to profile completion.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/complete-profile"),
            },
          ],
        );
      } else {
        Alert.alert("Error", err.message || "Failed to sign up with Google");
      }
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow, setActive, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!pendingVerification ? (
          <>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>HC</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join HealthCrypt today</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.gray500}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder="Create a password"
                  placeholderTextColor={colors.gray500}
                  secureTextEntry
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, loading && styles.buttonDisabled]}
                onPress={onSignUpPress}
                disabled={loading}
              >
                <Text style={styles.signUpButtonText}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.googleButton, loading && styles.buttonDisabled]}
                onPress={onGoogleSignUpPress}
                disabled={loading}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.verificationContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>✉️</Text>
            </View>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              Enter the code sent to {emailAddress}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter code"
                placeholderTextColor={colors.gray500}
                onChangeText={setCode}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              onPress={onPressVerify}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  logoContainer: {
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
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  signUpButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  signUpButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  googleButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: spacing.sm,
  },
  googleButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  signInText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: fontSizes.sm,
    color: colors.primaryDark,
    fontWeight: "bold",
  },
  verificationContainer: {
    alignItems: "center",
  },
});
