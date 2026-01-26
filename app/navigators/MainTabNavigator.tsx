import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAppTheme } from "@/theme/context"
import { HomeScreen } from "@/screens/HomeScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { HomeIcon, UserIcon } from "@/components/icons"
import type { MainTabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserIcon width={size} height={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
