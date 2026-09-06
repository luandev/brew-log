import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SiteHeader } from "../src/components/SiteChrome";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.shell} {...(Platform.OS === "web" ? { className: "lto-shell" } : {})}>
        <StatusBar style="light" />
        <SiteHeader />
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: "100%",
    backgroundColor: "transparent",
  },
});
