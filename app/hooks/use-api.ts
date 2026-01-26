import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getApiBaseUrl } from '@/utils/api-config';

const API_BASE_URL = getApiBaseUrl();

/**
 * Get authorization headers with token from AuthContext
 */
export function getAuthHeaders(authToken?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Origin': process.env.EXPO_PUBLIC_ORIGIN || 'https://qaqc-frontend.vercel.app',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
}

/**
 * Generic hook for authenticated GET requests
 */
export function useAuthenticatedQuery<TData = unknown>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  const { authToken, logout } = useAuth();
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders(authToken),
        credentials: 'include', // Include cookies for React Native (same as browser behavior)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear auth on 401
          // logout();
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.statusText}`);
      }

      return response.json();
    },
    ...options,
  });
}

/**
 * Generic hook for authenticated mutations (POST, PUT, DELETE, etc.)
 */
export function useAuthenticatedMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  const { authToken, logout } = useAuth();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: getAuthHeaders(authToken),
        body: JSON.stringify(variables),
        credentials: 'include', // Include cookies for React Native (same as browser behavior)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear auth on 401
          logout();
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.statusText}`);
      }

      // Handle empty responses
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    ...options,
  });
}
