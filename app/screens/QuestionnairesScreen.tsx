import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { CustomHeader } from '@/components/custom-header';
import { ChevronRightIcon, ClipboardCheckIcon, SearchIcon } from '@/components/icons';
import { useAppTheme } from '@/theme/context';
import { useQuestionnairesByStore, type Questionnaire } from '@/hooks/use-brands-api';
import type { AppStackScreenProps } from '@/navigators/navigationTypes';

type QuestionnairesRouteParams = AppStackScreenProps<'Questionnaires'>['route']['params'];

export function QuestionnairesScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as QuestionnairesRouteParams;
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch questionnaires by store
  const { data: questionnaires, isLoading } = useQuestionnairesByStore(
    params?.storeId || null
  );

  // Filter questionnaires based on search query
  const filteredQuestionnaires = (questionnaires || []).filter((questionnaire) => {
    const matchesSearch =
      questionnaire.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof questionnaire.description === 'string' &&
        questionnaire.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleQuestionnaireSelect = (questionnaire: Questionnaire) => {
    // Navigate to checklist with questionnaire ID
    // @ts-ignore
    navigation.navigate('Checklist', {
      questionnaireId: questionnaire.id,
      store: params?.storeName || '',
      storeId: params?.storeId || '',
    });
  };

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <CustomHeader
        title={params?.storeName || t('questionnairesScreen.titleFallback')}
        subtitle={t('questionnairesScreen.subtitle')}
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder={t('questionnairesScreen.searchPlaceholder')}
          placeholderTextColor={theme.colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Questionnaires List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Results Count */}
          <Text style={[styles.resultsCount, { color: theme.colors.textDim }]}>
            {t('questionnairesScreen.reportTemplatesCount', { count: filteredQuestionnaires.length })}
          </Text>

          {/* Questionnaire Cards */}
          {filteredQuestionnaires.map((questionnaire) => (
            <TouchableOpacity
              key={questionnaire.id}
              style={[
                styles.questionnaireCard,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handleQuestionnaireSelect(questionnaire)}
              activeOpacity={0.7}
            >
              {/* Questionnaire Icon */}
              <View style={styles.questionnaireIconContainer}>
                <ClipboardCheckIcon
                  width={24}
                  height={24}
                  color={theme.colors.textDim}
                />
              </View>

              {/* Questionnaire Info */}
              <View style={styles.questionnaireInfo}>
                <Text
                  style={[
                    styles.questionnaireName,
                    { color: theme.colors.text },
                  ]}
                  numberOfLines={2}
                >
                  {questionnaire.title || t('questionnairesScreen.noName')}
                </Text>
                {questionnaire.description && (
                  <Text
                    style={[
                      styles.questionnaireDescription,
                      { color: theme.colors.textDim },
                    ]}
                    numberOfLines={2}
                  >
                    {questionnaire.description}
                  </Text>
                )}
              </View>

              {/* Chevron Right Icon */}
              <View style={styles.chevronContainer}>
                <ChevronRightIcon
                  width={20}
                  height={20}
                  color={theme.colors.textDim}
                />
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {filteredQuestionnaires.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <SearchIcon width={48} height={48} color={theme.colors.textDim} />
              <Text style={[styles.emptyText, { color: theme.colors.textDim }]}>
                {t('questionnairesScreen.emptyText')}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textDim }]}>
                {t('questionnairesScreen.emptySubtext')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 8,
    paddingBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  questionnaireCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  questionnaireIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionnaireInfo: {
    flex: 1,
    gap: 4,
  },
  questionnaireName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  questionnaireDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
});
