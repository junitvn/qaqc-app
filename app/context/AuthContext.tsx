import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react"
import { useMMKVString, useMMKVObject } from "react-native-mmkv"

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string
  role: string
  language: string
  storeId: string | null
  areaIds: string[]
  isActive: boolean
}

export interface Session {
  user: User
  token: string
  redirect?: string
}

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  session: Session | null
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  setSession: (session: Session | null) => void
  logout: () => void
  validationError: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps { }

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [session, setSession] = useMMKVObject<Session | null>("AuthProvider.session")

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
    setSession(null)
  }, [setAuthEmail, setAuthToken, setSession])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    session: session ?? null,
    setAuthToken,
    setAuthEmail,
    setSession,
    logout,
    validationError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
