"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ChatProvider } from "./contexts/ChatContext"
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import ChatListScreen from "./screens/ChatListScreen"
import UsersScreen from "./screens/UsersScreen"
import ChatScreen from "./screens/ChatScreen"
import SettingsScreen from "./screens/SettingsScreen"
import LoadingScreen from "./screens/LoadingScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Chats") {
          iconName = focused ? "chatbubbles" : "chatbubbles-outline"
        } else if (route.name === "Users") {
          iconName = focused ? "people" : "people-outline"
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline"
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Chats" component={ChatListScreen} />
    <Tab.Screen name="Users" component={UsersScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
)

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
)

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {user ? (
        <ChatProvider>
          <MainStack />
        </ChatProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  )
}
