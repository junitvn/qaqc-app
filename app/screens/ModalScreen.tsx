import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAppTheme } from '@/theme/context';

export function ModalScreen() {
  const { theme } = useAppTheme();

  return (
    <Screen preset="fixed" backgroundColor={theme.colors.background}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>This is a modal</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
