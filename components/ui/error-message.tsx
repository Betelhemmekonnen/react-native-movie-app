import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({
  message,
  title,
  onRetry,
  retryLabel = 'Try Again',
  icon,
  type = 'error',
}: ErrorMessageProps) {
  const getIconName = () => {
    if (icon) return icon;
    switch (type) {
      case 'warning':
        return 'warning-outline';
      case 'info':
        return 'information-circle-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return '#FFA500';
      case 'info':
        return Colors.dark.accent;
      default:
        return '#FF4444';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name={getIconName()}
          size={48}
          color={getIconColor()}
          style={styles.icon}
        />
        {title && (
          <ThemedText style={styles.title}>{title}</ThemedText>
        )}
        <ThemedText style={styles.message}>{message}</ThemedText>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.retryText}>{retryLabel}</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#9BA1A6',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
});

