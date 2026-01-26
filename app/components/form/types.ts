/**
 * TypeScript types for form components
 * These types define the structure for dynamic form generation
 */

import type { 
  FormField, 
  FormValues, 
  DateField as DateFieldType,
  TextField as TextFieldType,
  NumberField as NumberFieldType,
  OptionsField as OptionsFieldType
} from '@/utils/formUtils';

export type { 
  FormField, 
  FormValues, 
  DateFieldType as DateField,
  TextFieldType as TextField,
  NumberFieldType as NumberField,
  OptionsFieldType as OptionsField
};

export interface FormFieldProps<T extends FormField = FormField> {
  field: T;
  value: FormValues[string];
  onChange: (value: FormValues[string]) => void;
  error?: string;
}
