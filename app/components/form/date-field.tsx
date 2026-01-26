import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/Text';
import { useAppTheme } from '@/theme/context';
import { DateField, FormFieldProps, FormValues } from './types';
import { FormHeader } from './form-header';

// Lazy import DatePicker to handle module loading errors
let DatePicker: any = null;
let datePickerAvailable = false;
let datePickerChecked = false;

// Check if native module is available (lazy initialization)
const getDatePicker = () => {
  if (datePickerChecked) {
    return { DatePicker, available: datePickerAvailable };
  }

  datePickerChecked = true;

  try {
    // Try to require the module
    const datePickerModule = require('react-native-date-picker');
    DatePicker = datePickerModule.default || datePickerModule;
    datePickerAvailable = true;
  } catch (error) {
    console.warn('react-native-date-picker not available:', error);
    datePickerAvailable = false;
    DatePicker = null;
  }

  return { DatePicker, available: datePickerAvailable };
};

export function DateFieldComponent({
  field,
  value,
  onChange,
  error,
}: FormFieldProps<DateField>) {
  const { theme } = useAppTheme();

  const parseDate = (val: FormValues[string]): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const parsed = parseDate(value);
    return parsed || new Date();
  });
  const [showPicker, setShowPicker] = useState(false);

  // Auto-select today as default when no value is provided
  useEffect(() => {
    const parsed = parseDate(value);
    if (!parsed && !value) {
      // No value provided, set today as default
      const today = new Date();
      setSelectedDate(today);
      onChange(today.toISOString());
    } else if (parsed?.getTime() !== selectedDate?.getTime()) {
      setSelectedDate(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const backgroundColor = theme.colors.background;
  const borderColor = error ? theme.colors.error : theme.colors.border;
  const textColor = selectedDate ? theme.colors.text : theme.colors.textDim;
  const placeholderColor = theme.colors.textDim;

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return dayjs(date).format('DD/MM/YYYY');
  };

  const handleOpenPicker = () => {
    const { DatePicker: Picker, available } = getDatePicker();
    if (!available || !Picker) {
      Alert.alert(
        'Date Picker Unavailable',
        'The date picker requires a development build. Please rebuild the app:\n\nFor iOS: npx expo run:ios\nFor Android: npx expo run:android',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowPicker(true);
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    onChange(date.toISOString());
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <FormHeader title={field.label} helpText={field.helpText} required={field.required} />

      <TouchableOpacity
        onPress={handleOpenPicker}
        activeOpacity={0.7}
        accessibilityLabel={`Select date for ${field.label}`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.input,
            {
              backgroundColor,
              borderColor,
            },
          ]}
          pointerEvents="none"
        >
          <TextInput
            style={[
              styles.inputText,
              {
                color: selectedDate ? textColor : placeholderColor,
              },
            ]}
            value={formatDate(selectedDate || new Date())}
            placeholder={field.placeholder || 'Select date'}
            placeholderTextColor={placeholderColor}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {showPicker && (() => {
        const { DatePicker: Picker, available } = getDatePicker();
        if (!available || !Picker) return null;
        return (
          <Picker
            modal
            open={showPicker}
            date={selectedDate || new Date()}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={handleClosePicker}
            minimumDate={field.minDate}
            maximumDate={field.maxDate}
            title={field.label || 'Select Date'}
          />
        );
      })()}

      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
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
        marginBottom: 6,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    inputText: {
        fontSize: 16,
    },
    error: {
        color: '#E53935',
        fontSize: 12,
        marginTop: 4,
    },
});
