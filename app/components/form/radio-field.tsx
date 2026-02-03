import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { useAppTheme } from '@/theme/context';
import type { OptionsField, FormFieldProps } from './types';
import { FormHeader } from './form-header';

export function RadioFieldComponent({
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
          const isSelected = value === option.value;
          return (
            <Pressable
              key={index}
              style={[
                styles.radioOption,
                {
                  borderColor: isSelected ? theme.colors.tint : theme.colors.border,
                  backgroundColor: isSelected ? theme.colors.errorBackground : theme.colors.background,
                }
              ]}
              onPress={() => onChange(option.value)}
            >
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor: isSelected ? theme.colors.tint : theme.colors.border,
                  }
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: theme.colors.tint }
                    ]}
                  />
                )}
              </View>
              <Text style={[styles.optionText, { color: isSelected ? theme.colors.tint : theme.colors.text }]}>
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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
