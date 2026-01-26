import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/theme/context";

export function FormHeader({ title, helpText, required }: { title: string, helpText?: string, required?: boolean }) {
  const { theme } = useAppTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {title}
        {required && <Text style={[styles.required, { color: theme.colors.error }]}> *</Text>}
      </Text>

      {helpText && (
        <Text style={[styles.helpText, { color: theme.colors.textDim }]}>{helpText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: '#E53935',
  },
  helpText: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 20,
    marginTop: 4,
  },
});
