import { I18nManager } from "react-native"
import * as Localization from "expo-localization"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import "intl-pluralrules"

import * as storage from "../utils/storage"
import { loadDateFnsLocale } from "../utils/formatDate"

// if English isn't your default language, move Translations to the appropriate language file.
import en, { Translations } from "./en"
import vi from "./vi"

const LANGUAGE_STORAGE_KEY = "APP_LANGUAGE"
const fallbackLocale = "en"

const systemLocales = Localization.getLocales()

// i18next expects resources under the default "translation" namespace.
// Components using "namespace:key" format (e.g. emptyStateComponent:generic.heading)
// need those namespaces defined separately.
const resources = {
  en: {
    translation: en,
    emptyStateComponent: en.emptyStateComponent,
    demoPodcastListScreen: en.demoPodcastListScreen,
  },
  vi: {
    translation: vi,
    emptyStateComponent: vi.emptyStateComponent,
    demoPodcastListScreen: vi.demoPodcastListScreen,
  },
}
const supportedTags = Object.keys(resources)

// Checks to see if the device locale matches any of the supported locales
// Device locale may be more specific and still match (e.g., en-US matches en)
const systemTagMatchesSupportedTags = (deviceTag: string) => {
  const primaryTag = deviceTag.split("-")[0]
  return supportedTags.includes(primaryTag)
}

const pickSupportedLocale: () => Localization.Locale | undefined = () => {
  return systemLocales.find((locale) => systemTagMatchesSupportedTags(locale.languageTag))
}

const locale = pickSupportedLocale()

export let isRTL = false

// Need to set RTL ASAP to ensure the app is rendered correctly. Waiting for i18n to init is too late.
if (locale?.languageTag && locale?.textDirection === "rtl") {
  I18nManager.allowRTL(true)
  isRTL = true
} else {
  I18nManager.allowRTL(false)
}

/**
 * Get initial language: saved preference > device locale > fallback
 */
const getInitialLanguage = (): string => {
  const saved = storage.loadString(LANGUAGE_STORAGE_KEY)
  if (saved && supportedTags.includes(saved)) {
    return saved
  }
  const deviceLocale = pickSupportedLocale()
  if (deviceLocale) {
    const primaryTag = deviceLocale.languageTag.split("-")[0]
    return supportedTags.includes(primaryTag) ? primaryTag : fallbackLocale
  }
  return fallbackLocale
}

/**
 * Change app language and persist preference
 */
export const changeLanguage = async (languageCode: string): Promise<void> => {
  const code = languageCode.split("-")[0]
  if (supportedTags.includes(code)) {
    storage.saveString(LANGUAGE_STORAGE_KEY, code)
    await i18n.changeLanguage(code)
    loadDateFnsLocale()
  }
}

export const initI18n = async () => {
  i18n.use(initReactI18next)

  const initialLng = getInitialLanguage()

  await i18n.init({
    resources,
    lng: initialLng,
    fallbackLng: fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
  })

  return i18n
}

export { i18n }

/**
 * Builds up valid keypaths for translations.
 */

export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, true>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, false>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? IsFirstLevel extends true
  ? Text | `${Text}:${RecursiveKeyOfInner<TValue>}`
  : Text | `${Text}.${RecursiveKeyOfInner<TValue>}`
  : Text
