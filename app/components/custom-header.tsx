import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/context';
import { ChevronLeftIcon } from './icons';

export interface CustomHeaderProps {
  /**
   * The title text to display in the header
   */
  title: string;

  /**
   * Whether to show the back button on the left
   * @default true
   */
  showBackButton?: boolean;

  /**
   * Custom handler for back button press
   * If not provided, will use navigation.goBack()
   */
  onBackPress?: () => void;

  /**
   * Custom component to render on the right side
   * Takes precedence over rightIcon
   */
  rightComponent?: React.ReactNode;

  /**
   * Icon component to render on the right side
   * Only used if rightComponent is not provided
   */
  rightIcon?: React.ReactNode;

  /**
   * Handler for right button/icon press
   */
  onRightPress?: () => void;

  /**
   * Custom background color for the header
   * If not provided, uses theme background color
   */
  backgroundColor?: string;

  /**
   * Custom text color for the title
   * If not provided, uses theme text color
   */
  textColor?: string;

  /**
   * Custom icon color for the back button
   * If not provided, uses theme icon color
   */
  iconColor?: string;

  /**
   * Whether to show a bottom border/shadow
   * @default true
   */
  showBorder?: boolean;

  /**
   * Subtitle text to display below the title
   */
  subtitle?: string;

  /**
   * Total number of steps
   */
  totalSteps?: number;

  /**
   * Current step number
   */
  currentStep?: number;

  /**
   * Custom color for the progress bar fill
   */
  progressColor?: string;
}

/**
 * CustomHeader - Reusable header component for navigation screens
 */
export function CustomHeader({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  rightIcon,
  onRightPress,
  backgroundColor,
  textColor,
  iconColor,
  showBorder = true,
  subtitle,
  totalSteps,
  currentStep,
  progressColor,
}: CustomHeaderProps) {
  const navigation = useNavigation();
  const { theme } = useAppTheme();

  // Use custom colors or fall back to theme colors
  const headerBg = backgroundColor ?? theme.colors.background;
  const titleColor = textColor ?? theme.colors.text;
  const subtitleColor = textColor ?? theme.colors.textDim;
  const backIconColor = iconColor ?? theme.colors.text;
  const progressFillColor = progressColor ?? theme.colors.tint;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        { backgroundColor: headerBg },
        showBorder && styles.borderBottom,
      ]}
    >
      <View style={styles.container}>
        {/* Left Section - Back Button */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ChevronLeftIcon width={24} height={24} color={backIconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section - Title */}
        <View style={styles.centerSection}>
          <Text
            style={[styles.title, { color: titleColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Section - Action Button/Icon */}
        <View style={[styles.rightSection, rightComponent ? styles.rightSectionFlex : undefined]}>
          {rightComponent ? (
            rightComponent
          ) : rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.rightButton}
              activeOpacity={0.7}
              disabled={!onRightPress}
              accessibilityRole="button"
            >
              {rightIcon}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {totalSteps !== undefined && totalSteps !== null && currentStep !== undefined && currentStep !== null && (
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: titleColor }]}>
            {currentStep} / {totalSteps} hoàn thành
          </Text>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.colors.separator }
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressFillColor,
                  width: `${Math.min(Math.max(currentStep / totalSteps * 100, 0), 100)}%`
                }
              ]}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // SafeAreaView handles top padding for notch/status bar
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64, // Standard header height
    paddingHorizontal: 12,
  },
  leftSection: {
    width: 44, // Minimum touch target size (44x44)
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8, // Optical alignment
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 4
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  rightSection: {
    width: 44, // Minimum touch target size (44x44)
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightSectionFlex: {
    width: 'auto',
    minWidth: 44,
    flexShrink: 0,
  },
  rightButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8, // Optical alignment
  },
  progressContainer: {
    width: '70%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    gap: 8,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 4, // Ensures progress is visible even at very low values
  },
  progressText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 4,
    minWidth: 120,
  },
});
