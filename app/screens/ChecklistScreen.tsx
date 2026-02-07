import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { CustomHeader } from '@/components/custom-header';
import { Collapsible } from '@/components/collapsible';
import { Gap } from '@/components/gap';
import { useAppTheme } from '@/theme/context';
import { useQuestionnaire, useSubmitChecklist } from '@/hooks/use-brands-api';
import { FormFieldsRenderer } from '@/components/form/FormFieldsRenderer';
import { questionToFormField } from '@/utils/formUtils';
import type { FormField, FormValues } from '@/utils/formUtils';
import type { AppStackScreenProps } from '@/navigators/navigationTypes';
import { format } from 'date-fns';
import { i18n } from '@/i18n';
import alert from '@/components/alert/alert';

type ChecklistRouteParams = AppStackScreenProps<'Checklist'>['route']['params'];

export function ChecklistScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as ChecklistRouteParams;
  const [generalNote, setGeneralNote] = useState('');
  const [formValues, setFormValues] = useState<FormValues>({});
  const submitMutation = useSubmitChecklist();

  // Fetch questionnaire data
  const { data: questionnaireData, isLoading } = useQuestionnaire(
    params?.questionnaireId || null
  );

  // Handle form value changes
  const handleFieldChange = useCallback((fieldId: string, value: FormValues[string]) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  // Convert questions to form fields
  const formFields = useMemo(() => {
    if (!questionnaireData?.data?.questions) return [];
    return questionnaireData.data.questions
      .map(questionToFormField)
      .filter((field): field is FormField => field !== null)
      .sort((a, b) => {
        const questionA = questionnaireData.data.questions.find(q => q.id === a.id);
        const questionB = questionnaireData.data.questions.find(q => q.id === b.id);
        return (questionA?.order || 0) - (questionB?.order || 0);
      });
  }, [questionnaireData?.data?.questions]);

  // Calculate progress based on answered questions
  const progress = useMemo(() => {
    if (formFields.length === 0) return { currentStep: 0, totalSteps: 0 };

    const answeredCount = formFields.filter((field) => {
      const value = formValues[field.id];

      if (value === undefined || value === null) return false;

      switch (field.type) {
        case 'date':
          return value !== '' && value !== null;
        case 'text':
        case 'textarea':
        case 'rich_text':
          return typeof value === 'string' && value.trim().length > 0;
        case 'radio':
          return value !== '' && value !== null;
        case 'checkbox':
          return Array.isArray(value) && value.length > 0;
        case 'number':
          return typeof value === 'number';
        default:
          return false;
      }
    }).length;

    return {
      currentStep: answeredCount,
      totalSteps: formFields.length,
    };
  }, [formFields, formValues]);

  // Validate all required fields are filled
  const isFormValid = useMemo(() => {
    if (!questionnaireData?.data?.questions) return false;

    return questionnaireData.data.questions.every((question) => {
      if (!question.required) return true;

      const field = formFields.find((f) => f.id === question.id);
      if (!field) return true;

      const value = formValues[field.id];

      if (value === undefined || value === null) return false;

      switch (field.type) {
        case 'date':
          return value !== '' && value !== null;
        case 'text':
        case 'textarea':
        case 'rich_text':
          return typeof value === 'string' && value.trim().length > 0;
        case 'radio':
          return value !== '' && value !== null;
        case 'checkbox':
          return Array.isArray(value) && value.length > 0;
        case 'number':
          return typeof value === 'number' && !isNaN(value);
        default:
          return false;
      }
    });
  }, [formFields, formValues, questionnaireData?.data?.questions]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      Alert.alert(t('checklistScreen.errorTitle'), t('checklistScreen.fillRequired'));
      return;
    }

    if (!params?.questionnaireId || !params?.storeId) {
      Alert.alert(t('checklistScreen.errorTitle'), t('checklistScreen.missingInfo'));
      return;
    }

    // Get language from i18n
    const language = i18n.language || 'en';

    // Map form values to question keys
    const submissionData: Record<string, any> = {};
    questionnaireData?.data?.questions.forEach((question) => {
      const field = formFields.find((f) => f.id === question.id);
      if (field) {
        const value = formValues[field.id];
        if (value !== undefined && value !== null) {
          submissionData[question.key] = value;
        }
      }
    });

    try {
      await submitMutation.mutateAsync({
        questionnaireId: params.questionnaireId,
        storeId: params.storeId,
        language,
        data: submissionData,
        isTest: false,
      });
      alert(t('checklistScreen.submitSuccess'), t('checklistScreen.submitSuccessMessage'), [
        {
          text: t('common.ok'),
          onPress: () => navigation.goBack(),
        },
      ], undefined);
    } catch (error) {
      Alert.alert(t('checklistScreen.errorTitle'), error instanceof Error ? error.message : t('checklistScreen.submitError'));
    }
  }, [isFormValid, params, formValues, formFields, questionnaireData, submitMutation, navigation, t]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </View>
    );
  }

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <CustomHeader
        title={t('checklistScreen.title')}
        progressColor={theme.colors.tint}
        totalSteps={progress.totalSteps}
        currentStep={progress.currentStep}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.errorBackground }]}>
          {/* Store Information */}
          {params?.store && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.colors.textWithBackgroundDim }]}>
                {t('checklistScreen.store')}
              </Text>
              <Text style={[styles.value, { color: theme.colors.textWithBackground }]}>
                {params.store}
              </Text>
            </View>
          )}

          {/* Report Template */}
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.colors.textWithBackgroundDim }]}>
              {t('checklistScreen.reportTemplate')}
            </Text>
            <Text style={[styles.value, { color: theme.colors.textWithBackground }]}>
              {questionnaireData?.data?.title || 'Không có tên'}
            </Text>
          </View>

          {/* Report Date */}
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.colors.textWithBackgroundDim }]}>
              {t('checklistScreen.reportDate')}
            </Text>
            <Text style={[styles.value, { color: theme.colors.textWithBackground }]}>
              {questionnaireData?.data?.createdAt
                ? format(new Date(questionnaireData.data.createdAt), 'dd/MM/yyyy HH:mm')
                : 'N/A'}
            </Text>
          </View>
        </View>
        <Gap size={16} />
        {/* General notes */}
        <View>
          <Collapsible defaultOpen={true} title={t('checklistScreen.generalNotes')}>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={generalNote}
              onChangeText={setGeneralNote}
              placeholder={t('checklistScreen.notesPlaceholder')}
              placeholderTextColor={theme.colors.textDim}
              multiline
              maxLength={500}
              numberOfLines={6}
              textAlignVertical="top"
            />
          </Collapsible>
        </View>

        <Gap size={16} />

        {/* Questions */}
        <FormFieldsRenderer
          fields={formFields}
          values={formValues}
          onChange={handleFieldChange}
        />

        <Gap size={24} />

        {/* Submit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: isFormValid ? theme.colors.tint : theme.colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {submitMutation.isPending ? t('checklistScreen.submitting') : t('checklistScreen.complete')}
            </Text>
          )}
        </Pressable>

        <Gap size={16} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  card: {
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
  },
  textArea: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: '400',
    minHeight: 120,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
