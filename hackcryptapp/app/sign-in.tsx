import {
    borderRadius,
    colors,
    fontSizes,
    shadows,
    spacing,
} from "@/constants/healthcare-theme";
import { useAuth, useOAuth, useSignIn } from "@clerk/clerk-expo";
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

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already signed-in users
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/home");
    }
  }, [isSignedIn, router]);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/home");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInPress = useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive: oauthSetActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        const activeSetActive = oauthSetActive || setActive;
        if (activeSetActive) {
          await activeSetActive({ session: createdSessionId });
          router.replace("/home");
        }
      }
    } catch (err: any) {
      console.error("OAuth error:", err);

      // Handle already signed in case
      if (err.message && err.message.includes("You're already signed in")) {
        Alert.alert(
          "Already Signed In",
          "You are already signed in. Redirecting to home.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/home"),
            },
          ],
        );
      } else {
        Alert.alert("Error", err.message || "Failed to sign in with Google");
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
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>HC</Text>
          </View>
          <Text style={styles.title}>HealthCrypt</Text>
          <Text style={styles.subtitle}>Secure Healthcare Management</Text>
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
              placeholder="Enter your password"
              placeholderTextColor={colors.gray500}
              secureTextEntry
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.buttonDisabled]}
            onPress={onSignInPress}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={onGoogleSignInPress}
            disabled={loading}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  signInButtonText: {
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: fontSizes.sm,
    color: colors.primaryDark,
    fontWeight: "bold",
  },
});
