import { borderRadius, colors, fontSizes, shadows, spacing } from '@/constants/healthcare-theme';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, subtitle, trend, icon, color = colors.primary }: StatCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            {icon}
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trend, { color: trend.isPositive ? colors.success : colors.error }]}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  value: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  trendContainer: {
    marginTop: spacing.xs,
  },
  trend: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});
