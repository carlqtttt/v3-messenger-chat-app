"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock users data
const MOCK_USERS = [
  {
    id: "1",
    email: "john@example.com",
    displayName: "John Doe",
    photoURL: null,
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "2",
    email: "jane@example.com",
    displayName: "Jane Smith",
    photoURL: null,
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "3",
    email: "bob@example.com",
    displayName: "Bob Johnson",
    photoURL: null,
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "4",
    email: "alice@example.com",
    displayName: "Alice Brown",
    photoURL: null,
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    // Mock login - in real app, validate credentials
    const mockUser = {
      id: Date.now().toString(),
      email,
      displayName: email.split("@")[0],
      photoURL: null,
      isOnline: true,
      lastSeen: new Date(),
    }

    await AsyncStorage.setItem("user", JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  const signup = async (email, password, displayName) => {
    // Mock signup
    const mockUser = {
      id: Date.now().toString(),
      email,
      displayName,
      photoURL: null,
      isOnline: true,
      lastSeen: new Date(),
    }

    await AsyncStorage.setItem("user", JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  const logout = async () => {
    await AsyncStorage.removeItem("user")
    setUser(null)
  }

  const updateUserProfile = async (updates) => {
    const updatedUser = { ...user, ...updates }
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const getOtherUsers = () => {
    return users.filter((u) => u.id !== user?.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        getOtherUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
