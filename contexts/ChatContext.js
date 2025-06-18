"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "./AuthContext"

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState({})

  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  const loadChats = async () => {
    try {
      const chatsData = await AsyncStorage.getItem(`chats_${user.id}`)
      const messagesData = await AsyncStorage.getItem(`messages_${user.id}`)

      if (chatsData) {
        setChats(JSON.parse(chatsData))
      }
      if (messagesData) {
        setMessages(JSON.parse(messagesData))
      }
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const saveChats = async (newChats) => {
    try {
      await AsyncStorage.setItem(`chats_${user.id}`, JSON.stringify(newChats))
      setChats(newChats)
    } catch (error) {
      console.error("Error saving chats:", error)
    }
  }

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem(`messages_${user.id}`, JSON.stringify(newMessages))
      setMessages(newMessages)
    } catch (error) {
      console.error("Error saving messages:", error)
    }
  }

  const createOrGetChat = (otherUser) => {
    const chatId = [user.id, otherUser.id].sort().join("_")

    let existingChat = chats.find((chat) => chat.id === chatId)

    if (!existingChat) {
      existingChat = {
        id: chatId,
        participants: [user.id, otherUser.id],
        participantDetails: {
          [user.id]: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            isOnline: user.isOnline,
          },
          [otherUser.id]: {
            displayName: otherUser.displayName,
            photoURL: otherUser.photoURL,
            isOnline: otherUser.isOnline,
          },
        },
        lastMessage: {
          text: "",
          timestamp: new Date(),
          senderId: "",
        },
        createdAt: new Date(),
      }

      const newChats = [...chats, existingChat]
      saveChats(newChats)
    }

    return existingChat
  }

  const sendMessage = (chatId, text, type = "text", imageUrl = null) => {
    const message = {
      id: Date.now().toString(),
      text,
      senderId: user.id,
      timestamp: new Date(),
      type,
      imageUrl,
    }

    // Add message to messages
    const chatMessages = messages[chatId] || []
    const newMessages = {
      ...messages,
      [chatId]: [message, ...chatMessages],
    }
    saveMessages(newMessages)

    // Update last message in chat
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: {
            text: type === "image" ? "📷 Photo" : text,
            timestamp: new Date(),
            senderId: user.id,
          },
        }
      }
      return chat
    })

    // Sort chats by last message timestamp
    updatedChats.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp))
    saveChats(updatedChats)
  }

  const getChatMessages = (chatId) => {
    return messages[chatId] || []
  }

  const getChatsWithLastMessage = () => {
    return chats.filter((chat) => chat.lastMessage.text !== "")
  }

  return (
    <ChatContext.Provider
      value={{
        chats: getChatsWithLastMessage(),
        createOrGetChat,
        sendMessage,
        getChatMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
