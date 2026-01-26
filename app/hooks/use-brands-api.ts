import { useAuthenticatedQuery, useAuthenticatedMutation } from '@/hooks/use-api';

export interface Store {
  id: string;
  name: string;
  code?: string;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stores: Store[];
}

export interface Question {
  id: string;
  questionId: string;
  key: string;
  label: string;
  description: string;
  type: string;
  required: boolean;
  order: number;
  options: Option[];
  placeholder: string;
  min: number;
  max: number;
  defaultValue: string;
  validation: string;
  dependsOn: string;
  dependsValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  _count: {
    submissions: number;
  };
}

interface BrandsApiResponse {
  status: string;
  data: Brand[];
}

interface QuestionnaireApiResponse {
  status: string;
  data: Questionnaire;
}

interface QuestionnairesApiResponse {
  status: string;
  data: Questionnaire[];
}

export interface SubmissionRequest {
  questionnaireId: string;
  storeId: string;
  language: string;
  data: Record<string, any>;
  isTest?: boolean;
}

interface SubmissionApiResponse {
  status: string;
  data: {
    id: string;
    questionnaireId: string;
    storeId: string;
    language: string;
    data: Record<string, any>;
    isTest: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Hook to fetch all brands with nested stores
 */
export function useBrands() {
  return useAuthenticatedQuery<BrandsApiResponse>(['brands'], '/api/v1/brands');
}

/**
 * Hook to get brands data (extracted from response)
 */
export function useBrandsData() {
  const { data, ...rest } = useBrands();
  return {
    ...rest,
    data: data?.data || [],
  };
}

/**
 * Hook to fetch questionnaires by store (using the stores endpoint as specified)
 */
export function useQuestionnairesByStore(storeId: string | null) {
  const { data, ...rest } = useAuthenticatedQuery<QuestionnairesApiResponse>(
    ['questionnaires', storeId || ''],
    `/api/v1/questionnaires/stores/${storeId}`,
    {
      enabled: !!storeId,
    }
  );
  return {
    ...rest,
    data: data?.data || [],
  };
}

/**
 * Hook to fetch questionnaire by ID
 */
export function useQuestionnaire(questionnaireId: string | null) {
  return useAuthenticatedQuery<QuestionnaireApiResponse>(
    ['questionnaires', questionnaireId || ''],
    `/api/v1/questionnaires/${questionnaireId}`,
    {
      enabled: !!questionnaireId,
    }
  );
}

/**
 * Hook to submit a checklist submission
 */
export function useSubmitChecklist() {
  return useAuthenticatedMutation<SubmissionApiResponse, SubmissionRequest>(
    '/api/v1/submissions',
    'POST'
  );
}
