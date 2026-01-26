import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/Text';
import { useAppTheme } from '@/theme/context';
import type { TextField, FormFieldProps } from './types';
import { FormHeader } from './form-header';

export function TextFieldComponent({
  field,
  value,
  onChange,
  error,
}: FormFieldProps<TextField>) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <FormHeader title={field.label} helpText={field.helpText} required={field.required} />

      <TextInput
        style={[
          styles.textInput,
          field.type === 'textarea' && styles.textArea,
          {
            backgroundColor: theme.colors.background,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
          }
        ]}
        value={(value as string) || ''}
        onChangeText={(text) => onChange(text)}
        placeholder={(field as TextField).placeholder}
        placeholderTextColor={theme.colors.textDim}
        multiline={field.type === 'textarea'}
        numberOfLines={field.type === 'textarea' ? 4 : 1}
        textAlignVertical={field.type === 'textarea' ? 'top' : 'center'}
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
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
