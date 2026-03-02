import 'dotenv/config';

export default {
  expo: {
    name: "nyc-companion",
    slug: "nyc-companion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.tersiusk.nyccompanion",
      adaptiveIcon: {
        backgroundColor: "#1F2937",
        foregroundImage: "./assets/android-icon-foreground.png",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      url: "https://u.expo.dev/245b6ad6-3c9a-44a2-b614-c312237c0dc8",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: ["expo-notifications"],
    extra: {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      eas: {
        projectId: "245b6ad6-3c9a-44a2-b614-c312237c0dc8",
      },
    },
    owner: "tersiusk",
  },
};
