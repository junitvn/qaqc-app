import "@expo/metro-runtime" // this is for fast refresh on web w/o expo-router
import { registerRootComponent } from "expo"
import { en, registerTranslation } from 'react-native-paper-dates'

import { App } from "@/app"

// Register translation for react-native-paper-dates
registerTranslation('en', en)

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
