import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { API_ENDPOINTS } from "@/constants/api";
import { useColorScheme } from "@/hooks/use-color-scheme";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

function InitialLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!isLoaded) return;

    const handleAuthState = async () => {
      if (!isSignedIn || !userId) {
        // User not signed in - go to sign-in
        router.replace("/sign-in");
        return;
      }

      // User is signed in - check current route and redirect appropriately
      try {
        const response = await fetch(
          `${API_ENDPOINTS.USERS_PROFILE}/${userId}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.profileCompleted) {
            // Profile complete - go to new tab structure
            router.replace("/(tabs)");
          } else {
            // Profile incomplete - go to complete profile
            router.replace("/complete-profile");
          }
        } else {
          // API error - assume profile needed
          router.replace("/complete-profile");
        }
      } catch (error) {
        // Network error - assume profile needed
        console.log("Profile check failed:", error);
        router.replace("/complete-profile");
      }
    };

    handleAuthState();
  }, [isSignedIn, isLoaded, userId, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="complete-profile" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
