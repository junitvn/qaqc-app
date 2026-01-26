import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { useAppTheme } from '@/theme/context';
import type { OptionsField, FormFieldProps } from './types';
import { FormHeader } from './form-header';

export function CheckboxFieldComponent({
  field,
  value,
  onChange,
  error,
}: FormFieldProps<OptionsField>) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <FormHeader title={field.label} helpText={field.helpText} required={field.required} />

      <View style={styles.optionsContainer}>
        {(field as OptionsField).options.map((option, index) => {
          const selectedValues = Array.isArray(value) ? value as boolean[] : [];
          const isSelected = selectedValues.includes(option.value as boolean);
          return (
            <Pressable
              key={index}
              style={[
                styles.checkboxOption,
                {
                  borderColor: isSelected ? theme.colors.tint : theme.colors.border,
                  backgroundColor: isSelected ? theme.colors.errorBackground : theme.colors.background,
                }
              ]}
              onPress={() => {
                const currentValues = Array.isArray(value) ? value as boolean[] : [];
                if (isSelected) {
                  onChange(currentValues.filter(v => v !== option.value));
                } else {
                  onChange([...currentValues, option.value as boolean]);
                }
              }}
            >
              <View
                style={[
                  styles.checkboxSquare,
                  {
                    borderColor: isSelected ? theme.colors.tint : theme.colors.border,
                    backgroundColor: isSelected ? theme.colors.tint : 'transparent',
                  }
                ]}
              >
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
