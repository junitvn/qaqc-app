import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { useAppTheme } from '@/theme/context';
import { useSignIn } from '@/hooks/use-auth-api';
import { navigate } from '@/navigators/navigationUtilities';
import { useAuth } from '@/context/AuthContext';

export function LoginScreenUI() {
  const { theme } = useAppTheme();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('admin@san.cafe');
  const [password, setPassword] = useState('password123');
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

  const signInMutation = useSignIn();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('MainTabs');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    try {
      await signInMutation.mutateAsync({ email, password });
      navigate('MainTabs');
    } catch (error) {
      Alert.alert(
        'Đăng nhập thất bại',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập',
        [{ text: 'OK' }]
      );
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password action
  };

  return (
    <Screen preset="auto" backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Login Card */}
          <View style={styles.loginCard}>
            {/* Logo / Title Section */}
            <View style={styles.titleSection}>
              <Text style={[styles.appTitle, { color: theme.colors.tint }]}>ChainS</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textDim }]}>
                Đăng nhập để tiếp tục
              </Text>
            </View>

            {/* Form Section */}
            <View style={[styles.formContainer, { backgroundColor: theme.colors.background }]}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Email
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor:
                        focusedInput === 'email'
                          ? theme.colors.tint
                          : theme.colors.border,
                      backgroundColor: theme.colors.background,
                    },
                    focusedInput === 'email' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Nhập địa chỉ email"
                    placeholderTextColor={theme.colors.textDim}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!signInMutation.isPending}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Mật khẩu
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor:
                        focusedInput === 'password'
                          ? theme.colors.tint
                          : theme.colors.border,
                      backgroundColor: theme.colors.background,
                    },
                    focusedInput === 'password' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor={theme.colors.textDim}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!signInMutation.isPending}
                  />
                </View>
              </View>

              {/* Forgot Password Button */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
              >
                <Text style={[styles.forgotPasswordText, { color: theme.colors.tint }]}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                style={[
                  styles.loginButton,
                  { backgroundColor: theme.colors.tint },
                  (!email || !password || signInMutation.isPending) && styles.loginButtonDisabled,
                ]}
                disabled={!email || !password || signInMutation.isPending}
              >
                {signInMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              {/* Footer Text */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.textDim }]}>
                  Bằng cách đăng nhập, bạn đồng ý với{' '}
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.footerLink, { color: theme.colors.tint }]}>
                    Điều khoản dịch vụ
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.footerText, { color: theme.colors.textDim }]}> và </Text>
                <TouchableOpacity>
                  <Text style={[styles.footerLink, { color: theme.colors.tint }]}>
                    Chính sách bảo mật
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loginCard: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 48,
  },
  titleSection: {
    paddingTop: 80,
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'flex-start',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 43.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperFocused: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    padding: 0,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
  },
});
