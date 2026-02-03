import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Screen } from '@/components/Screen';
import { CustomHeader } from '@/components/custom-header';
import { SettingsIcon, UserIcon } from '@/components/icons';
import { Switch } from '@/components/Toggle/Switch';
import { useAppTheme } from '@/theme/context';
import { useAuth } from '@/context/AuthContext';
import { useSignOut } from '@/hooks/use-auth-api';
import { changeLanguage } from '@/i18n';

interface ProfileScreenProps {
  onSettingsPress?: () => void;
}

export function ProfileScreen({
  onSettingsPress,
}: ProfileScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme, themeContext, setThemeContextOverride } = useAppTheme();
  const { session } = useAuth();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  const isDarkMode = themeContext === 'dark';

  const handleThemeToggle = (value: boolean) => {
    setThemeContextOverride(value ? 'dark' : 'light');
  };

  const user = session?.user;
  const isLoading = !session && !isSigningOut;

  const currentLang = i18n.language?.split('-')[0] || 'en';

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    changeLanguage(lang);
  };

  if (!user && isLoading) {
    return (
      <Screen preset="fixed" backgroundColor={theme.colors.background}>
        <CustomHeader
          title={t('profileScreen.title')}
          showBackButton={false}
          rightIcon={<SettingsIcon width={24} height={24} color={'transparent'} />}
          onRightPress={onSettingsPress}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.error }]}>
            {t('profileScreen.loadingProfile')}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <CustomHeader
        title={t('profileScreen.title')}
        showBackButton={false}
        rightIcon={<SettingsIcon width={24} height={24} color={'transparent'} />}
        onRightPress={onSettingsPress}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
              <UserIcon width={64} height={64} color={theme.colors.textDim} />
            </View>
          )}
        </View>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          {/* First Name */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.firstName')}</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.firstName || 'N/A'}</Text>
          </View>

          {/* Last Name */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.lastName')}</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.lastName || 'N/A'}</Text>
          </View>

          {/* Email */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.email')}</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user?.email || 'N/A'}</Text>
          </View>

          {/* Email Verified */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.emailVerified')}</Text>
            <View style={styles.verifiedContainer}>
              <View
                style={[
                  styles.verifiedBadge,
                  {
                    backgroundColor: user?.emailVerified
                      ? theme.colors.tint
                      : theme.colors.border,
                  },
                ]}
              />
              <Text
                style={[
                  styles.verifiedText,
                  {
                    color: user?.emailVerified ? theme.colors.tint : theme.colors.textDim,
                  },
                ]}
              >
                {user?.emailVerified ? t('profileScreen.verified') : t('profileScreen.notVerified')}
              </Text>
            </View>
          </View>

          {/* Role */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.role')}</Text>
            <View style={[styles.roleBadge, { backgroundColor: theme.colors.tint }]}>
              <Text style={styles.roleText}>{user?.role || 'N/A'}</Text>
            </View>
          </View>

          {/* Language */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.language')}</Text>
            <View style={styles.languageSwitch}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLang === 'en' && { backgroundColor: theme.colors.tint },
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    { color: currentLang === 'en' ? '#FFFFFF' : theme.colors.text },
                  ]}
                >
                  {t('profileScreen.english')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLang === 'vi' && { backgroundColor: theme.colors.tint },
                ]}
                onPress={() => handleLanguageChange('vi')}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    { color: currentLang === 'vi' ? '#FFFFFF' : theme.colors.text },
                  ]}
                >
                  {t('profileScreen.vietnamese')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Mode */}
          <View style={[styles.infoRow, styles.infoRowBorder, { borderColor: theme.colors.border }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textDim }]}>{t('profileScreen.darkMode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              accessibilityLabel="Toggle dark mode"
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.colors.error }]}
          onPress={() => signOut()}
          disabled={isSigningOut}
          accessibilityRole="button"
          accessibilityLabel={t('profileScreen.signOut')}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signOutButtonText}>{t('profileScreen.signOut')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageSwitch: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
