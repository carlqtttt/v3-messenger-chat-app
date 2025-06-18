"use client"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import { useChat } from "../contexts/ChatContext"
import { useAuth } from "../contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"

const ChatListScreen = ({ navigation }) => {
  const { user } = useAuth()
  const { chats } = useChat()

  const formatTime = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return messageTime.toLocaleDateString()
    }
  }

  const getOtherParticipant = (chat) => {
    const otherUserId = chat.participants.find((id) => id !== user?.id)
    return otherUserId ? chat.participantDetails[otherUserId] : null
  }

  const renderChatItem = ({ item }) => {
    const otherParticipant = getOtherParticipant(item)
    if (!otherParticipant) return null

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("Chat", {
            chatId: item.id,
            otherUser: otherParticipant,
          })
        }
      >
        <View style={styles.avatarContainer}>
          {otherParticipant.photoURL ? (
            <Image source={{ uri: otherParticipant.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>{otherParticipant.displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          {otherParticipant.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherParticipant.displayName}</Text>
            <Text style={styles.timestamp}>{formatTime(item.lastMessage.timestamp)}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation from the Users tab</Text>
        </View>
      ) : (
        <FlatList data={chats} renderItem={renderChatItem} keyExtractor={(item) => item.id} style={styles.chatList} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
})

export default ChatListScreen
