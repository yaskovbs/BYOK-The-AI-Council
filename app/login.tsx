import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components';
import { useAuth, useAlert } from '@/template';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const { 
    sendOTP, 
    verifyOTPAndLogin, 
    signInWithPassword, 
    signUpWithPassword,
    signInWithGoogle,
    operationLoading 
  } = useAuth();
  const { showAlert } = useAlert();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailPasswordAuth = async () => {
    if (!email || !password) {
      showAlert('Please fill in all fields');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        showAlert('Password must be at least 6 characters');
        return;
      }
      const { error } = await signUpWithPassword(email, password);
      if (error) {
        showAlert(error);
      } else {
        showAlert('Account created! Please log in.');
        setMode('login');
      }
    } else {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        showAlert(error);
      }
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      showAlert('Please enter your email');
      return;
    }

    const { error } = await sendOTP(email);
    if (error) {
      showAlert(error);
    } else {
      setShowOtpInput(true);
      showAlert('Verification code sent to your email!');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !email) {
      showAlert('Please enter the verification code');
      return;
    }

    const options = mode === 'register' && password ? { password } : undefined;
    const { error } = await verifyOTPAndLogin(email, otp, options);
    if (error) {
      showAlert(error);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      showAlert(error);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0E27', '#151932', '#1E2340']}
      style={styles.gradient}
    >
      <Screen edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              entering={FadeInDown.delay(100).duration(600)}
              style={styles.header}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <LinearGradient
                  colors={['#00D9FF', '#8B5CF6']}
                  style={styles.logoGlow}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>
              <Text style={styles.title}>BYOK</Text>
              <Text style={styles.titleSub}>THE AI COUNCIL</Text>
              <Text style={styles.subtitle}>
                {mode === 'login' ? 'Welcome Back to the Council' : 'Join the AI Council'}
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(300).duration(600)}
              style={styles.form}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons 
                    name="email-outline" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!operationLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons 
                    name="lock-outline" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor={theme.colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!operationLoading}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              {mode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons 
                      name="lock-check-outline" 
                      size={20} 
                      color={theme.colors.textSecondary} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm password"
                      placeholderTextColor={theme.colors.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!operationLoading}
                    />
                  </View>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  operationLoading && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleEmailPasswordAuth}
                disabled={operationLoading}
              >
                <LinearGradient
                  colors={['#00D9FF', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.primaryButtonText}>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  operationLoading && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleGoogleLogin}
                disabled={operationLoading}
              >
                <MaterialCommunityIcons name="google" size={24} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.otpButton,
                  operationLoading && styles.buttonDisabled,
                  showOtpInput && styles.otpButtonActive,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleSendOTP}
                disabled={operationLoading || showOtpInput}
              >
                <MaterialCommunityIcons 
                  name="email-fast-outline" 
                  size={20} 
                  color={showOtpInput ? theme.colors.success : theme.colors.primary} 
                />
                <Text style={[styles.otpButtonText, showOtpInput && styles.otpButtonTextActive]}>
                  {showOtpInput ? 'Code Sent!' : 'Login with Email Code'}
                </Text>
              </Pressable>

              {showOtpInput && (
                <Animated.View 
                  entering={FadeInDown.duration(400)}
                  style={styles.otpContainer}
                >
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons 
                      name="shield-key-outline" 
                      size={20} 
                      color={theme.colors.textSecondary} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter 4-digit code"
                      placeholderTextColor={theme.colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={4}
                      editable={!operationLoading}
                    />
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.verifyButton,
                      operationLoading && styles.buttonDisabled,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleVerifyOTP}
                    disabled={operationLoading}
                  >
                    <Text style={styles.primaryButtonText}>Verify & Login</Text>
                  </Pressable>
                </Animated.View>
              )}

              <Pressable
                style={styles.switchMode}
                onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                <Text style={styles.switchModeText}>
                  {mode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <Text style={styles.switchModeLink}>
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </Text>
                </Text>
              </Pressable>
            </Animated.View>

            <Animated.Text 
              entering={FadeInUp.delay(500).duration(600)}
              style={styles.credits}
            >
              Created by YAKOV LIAV BEN SALOMON{'\n'}
              יעקב ליאב בן סלומון 🇮🇱
            </Animated.Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  logo: {
    width: 140,
    height: 140,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: theme.borderRadius.full,
    opacity: 0.3,
    top: -10,
    left: -10,
    zIndex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 4,
  },
  titleSub: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    letterSpacing: 2,
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    padding: theme.spacing.sm,
  },
  primaryButton: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  gradientButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.md,
    letterSpacing: 1,
  },
  socialButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  socialButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  otpButton: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  otpButtonActive: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.surfaceLight,
  },
  otpButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  otpButtonTextActive: {
    color: theme.colors.success,
  },
  otpContainer: {
    marginTop: theme.spacing.md,
  },
  verifyButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  switchMode: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  switchModeLink: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  credits: {
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
