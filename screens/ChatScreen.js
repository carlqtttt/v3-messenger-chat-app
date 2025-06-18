"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useChat } from "../contexts/ChatContext"
import { useAuth } from "../contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

const ChatScreen = ({ route, navigation }) => {
  const { chatId, otherUser } = route.params
  const { user } = useAuth()
  const { sendMessage, getChatMessages } = useChat()
  const [inputText, setInputText] = useState("")
  const [sending, setSending] = useState(false)
  const flatListRef = useRef(null)

  const messages = getChatMessages(chatId)

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    setSending(true)
    sendMessage(chatId, inputText.trim())
    setInputText("")
    setSending(false)
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })

    if (!result.canceled && result.assets[0]) {
      setSending(true)
      sendMessage(chatId, "", "image", result.assets[0].uri)
      setSending(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.id

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
          {item.type === "image" && item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
          ) : (
            <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
              {item.text}
            </Text>
          )}
          <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          {otherUser.photoURL ? (
            <Image source={{ uri: otherUser.photoURL }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, styles.defaultHeaderAvatar]}>
              <Text style={styles.headerAvatarText}>{otherUser.displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{otherUser.displayName}</Text>
            <Text style={styles.headerStatus}>{otherUser.isOnline ? "Online" : "Offline"}</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        inverted
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={sending}>
            <Ionicons name="camera" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  defaultHeaderAvatar: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerStatus: {
    fontSize: 12,
    color: "#666",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 5,
  },
  myMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#007AFF",
  },
  otherMessageBubble: {
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#333",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 5,
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherMessageTime: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  imageButton: {
    marginRight: 10,
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
})

export default ChatScreen
