import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { CustomHeader } from '@/components/custom-header';
import { useAppTheme } from '@/theme/context';

interface RoleSwitcherScreenProps {
  currentRole?: string;
  roles?: Array<{ value: string; label: string; description: string; color: string }>;
  onRoleSelect?: (role: string) => void;
  onReset?: () => void;
}

const DEFAULT_ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access to everything',
    color: '#EF4444',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'View tickets & quality, create/update tickets',
    color: '#F97316',
  },
  {
    value: 'area_manager',
    label: 'Area Manager',
    description: 'View tickets & quality for assigned areas',
    color: '#3B82F6',
  },
  {
    value: 'store_manager',
    label: 'Store Manager',
    description: 'View tickets & quality for their store',
    color: '#3B82F6',
  },
  {
    value: 'supervisor',
    label: 'Supervisor',
    description: 'View tickets, limited quality (no trend chart)',
    color: '#F97316',
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'View tickets only, no quality section',
    color: '#737373',
  },
];

export function RoleSwitcherScreen({
  currentRole,
  roles = DEFAULT_ROLES,
  onRoleSelect,
  onReset,
}: RoleSwitcherScreenProps) {
  const { theme } = useAppTheme();

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <CustomHeader
        title="Role Switcher"
        subtitle="Test different user roles"
        showBackButton={true}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Current Role
          </Text>
          <Text style={[styles.currentRole, { color: theme.colors.text }]}>
            {currentRole || 'none'}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Select Role to Test
        </Text>

        {roles.map((role) => {
          const isCurrent = currentRole === role.value;

          return (
            <TouchableOpacity
              key={role.value}
              style={[
                styles.roleCard,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: isCurrent ? role.color : theme.colors.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
                isCurrent && styles.currentRoleCard,
              ]}
              onPress={() => onRoleSelect?.(role.value)}
            >
              <View style={styles.roleHeader}>
                <View style={styles.roleTitleRow}>
                  <Text style={[styles.roleLabel, { color: theme.colors.text }]}>
                    {role.label}
                  </Text>
                  {isCurrent && (
                    <View style={[styles.badge, { backgroundColor: role.color }]}>
                      <Text style={styles.badgeText}>Current</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.roleIndicator, { backgroundColor: role.color }]} />
              </View>
              <Text style={[styles.roleDescription, { color: theme.colors.textDim }]}>
                {role.description}
              </Text>
              <Text style={[styles.roleValue, { color: theme.colors.textDim }]}>
                Role: {role.value}
              </Text>
            </TouchableOpacity>
          );
        })}

        {onReset && (
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.colors.border }]}
            onPress={onReset}
          >
            <Text style={[styles.resetButtonText, { color: theme.colors.text }]}>
              Reset to Original Role
            </Text>
          </TouchableOpacity>
        )}

        <View style={[styles.noteCard, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
            Note
          </Text>
          <Text style={[styles.noteText, { color: theme.colors.textDim }]}>
            This is a testing feature. Role changes only affect UI visibility and permissions in this session. The original user role is preserved and will be restored when you reset.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currentRole: {
    fontSize: 24,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentRoleCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  roleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 21,
  },
  roleValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
