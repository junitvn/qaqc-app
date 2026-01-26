/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { useAppTheme } from "@/theme/context"

import { MainTabNavigator } from "./MainTabNavigator"
import { SelectStoreScreen } from "@/screens/SelectStoreScreen"
import { QuestionnairesScreen } from "@/screens/QuestionnairesScreen"
import { ChecklistScreen } from "@/screens/ChecklistScreen"
import { RoleSwitcherScreen } from "@/screens/RoleSwitcherScreen"
import { ModalScreen } from "@/screens/ModalScreen"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { LoginScreenUI } from "@/screens/LoginScreenUI"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()
  console.log("🚀 ~ AppStack ~ isAuthenticated:", isAuthenticated)

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={"Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreenUI} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="SelectStore" component={SelectStoreScreen} />
          <Stack.Screen name="Questionnaires" component={QuestionnairesScreen} />
          <Stack.Screen name="Checklist" component={ChecklistScreen} />
          <Stack.Screen name="RoleSwitcher" component={RoleSwitcherScreen} />
          <Stack.Screen
            name="Modal"
            component={ModalScreen}
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreenUI} />
        </>
      )}

    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
