import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/theme/context';
import { Text } from './Text';
import { ChevronRightIcon } from './icons';

export interface CollapsibleProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

export function Collapsible({ children, title, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <View style={[styles.iconContainer, { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }]}>
          <ChevronRightIcon width={12} height={12} color={theme.colors.text} />
        </View>
        <Text style={[styles.title, { color: theme.colors.tint }]}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    marginTop: 6,
  },
});
