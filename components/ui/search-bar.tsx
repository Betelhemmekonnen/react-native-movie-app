import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export function SearchBar({
  placeholder = 'Search movies...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
  showCancelButton = false,
  onCancel,
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const currentValue = value !== undefined ? value : internalValue;

  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && currentValue.trim()) {
      onSubmit(currentValue.trim());
    }
  };

  const handleClear = () => {
    handleChangeText('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
          { backgroundColor: isDark ? Colors.dark.cardBackground : '#F5F5F5' },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#9BA1A6' : '#687076'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.input,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9BA1A6' : '#687076'}
          value={currentValue}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {currentValue.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? '#9BA1A6' : '#687076'}
            />
          </TouchableOpacity>
        )}
      </View>
      {showCancelButton && isFocused && (
        <TouchableOpacity
          onPress={() => {
            setIsFocused(false);
            if (onCancel) {
              onCancel();
            }
          }}
          style={styles.cancelButton}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainerFocused: {
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.dark.accent,
    fontWeight: '500',
  },
});

