import React from 'react';
import type { FormField, FormValues } from '@/utils/formUtils';
import { TextFieldComponent } from './text-field';
import { NumberFieldComponent } from './number-field';
import { RadioFieldComponent } from './radio-field';
import { CheckboxFieldComponent } from './checkbox-field';
import { DateFieldComponent } from './date-field';
import { Platform } from 'react-native';

interface FormFieldsRendererProps {
  fields: FormField[];
  values: FormValues;
  onChange: (fieldId: string, value: FormValues[string]) => void;
  errors?: Record<string, string>;
}

export function FormFieldsRenderer({
  fields,
  values,
  onChange,
  errors = {},
}: FormFieldsRendererProps) {
  const renderField = (field: FormField) => {
    if (field.hidden) return null;

    const commonProps = {
      field,
      value: values[field.id],
      onChange: (value: FormValues[string]) => onChange(field.id, value),
      error: errors[field.id],
    };

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'rich_text':
        return <TextFieldComponent key={field.id} {...commonProps} field={field} />;

      case 'number':
        return <NumberFieldComponent key={field.id} {...commonProps} field={field} />;

      case 'radio':
        return <RadioFieldComponent key={field.id} {...commonProps} field={field} />;

      case 'checkbox':
        return <CheckboxFieldComponent key={field.id} {...commonProps} field={field} />;

      case 'date':
        return <DateFieldComponent key={field.id} {...commonProps} field={field as any} />;
        return Platform.OS === 'web'
          ? <TextFieldComponent key={field.id} {...commonProps} field={field as any} />
          : <DateFieldComponent key={field.id} {...commonProps} field={field as any} />;

      default:
        return null;
    }
  };

  return (
    <>
      {fields.map(renderField)}
    </>
  );
}
