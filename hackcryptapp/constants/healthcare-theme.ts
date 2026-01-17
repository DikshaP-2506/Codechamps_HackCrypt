// Healthcare Theme Colors
export const colors = {
  primary: "#767D66", // Sage green
  primaryDark: "#173B16", // Dark forest green
  primaryLight: "#E8EAE3", // Light sage
  accent: "#8B9274", // Medium sage
  mint: "#9DA587", // Lighter sage
  forest: "#0D2A0C", // Darker forest

  // Neutrals
  gray50: "#F9FAFB",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray900: "#1F2937",

  // Alerts
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  success: "#10B981",

  // Status
  critical: "#EF4444",
  high: "#F59E0B",
  medium: "#3B82F6",
  low: "#10B981",

  // Background
  background: "#FFFFFF",
  backgroundSecondary: "#F9FAFB",

  // Text
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Additional UI colors
  border: "#E5E7EB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Typography - Using system fonts with proper weights
export const fonts = {
  primary: "System",
  secondary: "System",
  regular: {
    fontWeight: "400" as "400",
  },
  medium: {
    fontWeight: "600" as "600",
  },
  bold: {
    fontWeight: "700" as "700",
  },
  light: {
    fontWeight: "300" as "300",
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
