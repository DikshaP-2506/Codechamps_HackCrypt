import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
    colors,
    fontSizes,
    fonts,
    spacing,
} from "../constants/healthcare-theme";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
}

export default function Header({
  title,
  subtitle,
  backgroundColor = colors.primary,
}: HeaderProps) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={[styles.title, fonts.bold]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, fonts.regular]}>{subtitle}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: fontSizes.xxxl,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.primaryLight,
  },
});
