import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';
import { SelectStoreComponent } from '@/components/select-store-component';
import { LogoutIcon, SettingsIcon } from '@/components/icons';
import { useAppTheme } from '@/theme/context';
import { useBrandsData } from '@/hooks/use-brands-api';
import { navigate } from '@/navigators/navigationUtilities';
import { Image } from 'expo-image';

interface HomeScreenProps {
  showHeader?: boolean;
  userName?: string;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
}

const HEADER_HEIGHT = 250;

export function HomeScreen({
  showHeader = false,
  userName = 'User',
  onSettingsPress,
  onLogoutPress,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { data: brands } = useBrandsData();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  console.log('theme', theme);
  console.log('brands', theme.colors.background);

  // Parallax animation for header (with scale)
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const handleStoreSelect = (store: { id: string; name: string; code?: string }) => {
    // Find the brand that contains this store
    const brand = brands?.find(b => b.stores?.some(s => s.id === store.id));
    const brandId = brand?.id || '';

    // Navigate to questionnaires screen with brand_id and store_id
    navigate('Questionnaires', {
      brandId,
      storeId: store.id,
      storeName: store.name || '',
    });
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor: 'transparent', flex: 1 }}
        scrollEventThrottle={16}
      >
        {/* Header with parallax (scales) */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: theme.colors.tint },
            headerAnimatedStyle,
          ]}
        >
          <View style={styles.headerWrapper}>
            <Image
              source={require('@assets/images/header.png')}
              style={styles.headerImage}
              contentFit="cover"
            />
            <View style={[styles.colorOverlay, { backgroundColor: theme.colors.tint, opacity: 0.3 }]} />
            <Svg style={styles.gradientOverlay} width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="headerGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <Stop offset="0" stopColor={theme.colors.tint} stopOpacity="0" />
                  <Stop offset="0.36" stopColor={theme.colors.tint} stopOpacity="0" />
                  <Stop offset="1" stopColor={theme.colors.tint} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#headerGradient)" />
            </Svg>
          </View>
        </Animated.View>

        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{t('homeScreen.greeting')}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Header Icons - Settings and Logout */}
        {showHeader && (
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity
              onPress={onSettingsPress}
              style={styles.headerIconButton}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <SettingsIcon width={24} height={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogoutPress}
              style={styles.headerIconButton}
              accessibilityLabel="Logout"
              accessibilityRole="button"
            >
              <LogoutIcon width={24} height={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Content Body */}
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
          <SelectStoreComponent onStoreSelect={handleStoreSelect} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  headerWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  colorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  greetingContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT - 150,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 21,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 33,
  },
  content: {
    flex: 1,
    gap: 26,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -32,
    paddingTop: 32,
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  ticketList: {
    gap: 16,
  },
  headerIconsContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT - 150,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
