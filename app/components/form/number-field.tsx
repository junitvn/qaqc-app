import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/Text';
import { useAppTheme } from '@/theme/context';
import type { NumberField, FormFieldProps } from './types';
import { FormHeader } from './form-header';

export function NumberFieldComponent({
  field,
  value,
  onChange,
  error,
}: FormFieldProps<NumberField>) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <FormHeader title={field.label} helpText={field.helpText} required={field.required} />

      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: theme.colors.background,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
          }
        ]}
        value={value?.toString() || ''}
        onChangeText={(text) => {
          const num = parseFloat(text);
          if (text === '' || text === '-') {
            onChange(text);
          } else if (!isNaN(num)) {
            if (field.min !== undefined && num < field.min) return;
            if (field.max !== undefined && num > field.max) return;
            onChange(num);
          }
        }}
        keyboardType="numeric"
        placeholder="Enter number"
        placeholderTextColor={theme.colors.textDim}
      />

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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
