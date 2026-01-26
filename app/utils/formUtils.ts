import { Question } from '@/hooks/use-brands-api';

export type FieldType = 'text' | 'textarea' | 'number' | 'radio' | 'checkbox' | 'date' | 'rich_text';

export interface Option {
  label: string;
  value: string | number | boolean;
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  helpText?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'rich_text';
  placeholder?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface OptionsField extends BaseField {
  type: 'radio' | 'checkbox';
  options: Option[];
}

export interface DateField extends BaseField {
  type: 'date';
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export type FormField = TextField | NumberField | OptionsField | DateField;

export type FormValues = Record<string, string | number | boolean | boolean[] | null>;

export function questionToFormField(question: Question): FormField | null {
  const baseField = {
    id: question.id,
    label: question.label,
    helpText: question.description || undefined,
    required: question.required,
    hidden: false,
  };

  const questionType = question.type.toUpperCase();

  switch (questionType) {
    case 'TEXT':
      return {
        ...baseField,
        type: 'text' as const,
        placeholder: question.placeholder || undefined,
      } as TextField;

    case 'DATE':
      return {
        ...baseField,
        type: 'date' as const,
        placeholder: question.placeholder || undefined,
      } as DateField;

    case 'TEXTAREA':
      return {
        ...baseField,
        type: 'textarea' as const,
        placeholder: question.placeholder || undefined,
      } as TextField;

    case 'RICH_TEXT':
      return {
        ...baseField,
        type: 'rich_text' as const,
        placeholder: question.placeholder || undefined,
      } as TextField;

    case 'SELECT':
      return {
        ...baseField,
        type: 'radio' as const,
        options: question.options || [],
      } as OptionsField;

    case 'CHECKBOX':
      return {
        ...baseField,
        type: 'checkbox' as const,
        options: question.options || [],
      } as OptionsField;

    case 'NUMBER':
      return {
        ...baseField,
        type: 'number' as const,
        min: question.min ?? undefined,
        max: question.max ?? undefined,
      } as NumberField;

    default:
      return null;
  }
}
