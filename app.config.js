export default {
  expo: {
    name: "Messenger Chat",
    slug: "messenger-chat-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
      },
    },
    web: {},
    plugins: ["expo-image-picker"],
  },
}
