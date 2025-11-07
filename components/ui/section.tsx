import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: ViewStyle;
  showDivider?: boolean;
  actionButton?: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  children,
  style,
  titleStyle,
  showDivider = false,
  actionButton,
}: SectionProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      {(title || subtitle || actionButton) && (
        <View style={[styles.header, titleStyle]}>
          <View style={styles.titleContainer}>
            {title && (
              <ThemedText style={styles.title}>{title}</ThemedText>
            )}
            {subtitle && (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            )}
          </View>
          {actionButton && <View>{actionButton}</View>}
        </View>
      )}
      {showDivider && <View style={styles.divider} />}
      <View style={styles.content}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
});

