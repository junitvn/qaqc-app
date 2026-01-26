import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/theme/context';
import { SettingsIcon } from './icons';

export interface TicketComponentProps {
  /**
   * Location or venue name (displayed in gray)
   */
  location: string;

  /**
   * Main title of the ticket (displayed in black)
   */
  title: string;

  /**
   * Category label for the badge
   */
  category: string;

  /**
   * Priority level (e.g., "Cao", "Trung bình", "Thấp")
   */
  priority: 'Cao' | 'Trung bình' | 'Thấp';

  /**
   * Time indicator (e.g., "5p", "10p", "1h")
   */
  time: string;

  /**
   * Optional press handler
   */
  onPress?: () => void;

  /**
   * Icon color override
   */
  iconColor?: string;
}

export function TicketComponent({
  location,
  title,
  category,
  priority,
  time,
  onPress,
  iconColor,
}: TicketComponentProps) {
  const { theme } = useAppTheme();

  const priorityColors = {
    'Cao': {
      backgroundColor: theme.colors.error,
      textColor: '#FFFFFF',
    },
    'Trung bình': {
      backgroundColor: theme.colors.tint,
      textColor: '#FFFFFF',
    },
    'Thấp': {
      backgroundColor: theme.colors.textDim,
      textColor: '#FFFFFF',
    },
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={`${title} ticket at ${location}, priority ${priority}`}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <SettingsIcon
          width={24}
          height={24}
          color={iconColor || theme.colors.tint}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Location */}
        <Text
          style={[
            styles.location,
            { color: theme.colors.textDim }
          ]}
          numberOfLines={1}
        >
          {location}
        </Text>

        {/* Title */}
        <Text
          style={[
            styles.title,
            { color: theme.colors.text }
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Badges */}
        <View style={styles.metaContainer}>
          {/* Category Badge */}
          <View style={[
            styles.categoryBadge,
            {
              backgroundColor: theme.colors.errorBackground,
              borderColor: theme.colors.tint,
            }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: theme.colors.tint }
            ]}>
              {category}
            </Text>
          </View>

          {/* Priority Badge */}
          <View style={[
            styles.priorityBadge,
            {
              backgroundColor: priorityColors[priority].backgroundColor,
            }
          ]}>
            <Text style={[
              styles.priorityText,
              { color: priorityColors[priority].textColor }
            ]}>
              {priority}
            </Text>
          </View>
        </View>

        {/* Time */}
        <Text
          style={[
            styles.time,
            { color: theme.colors.textDim }
          ]}
        >
          {time}
        </Text>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  priorityBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
});
