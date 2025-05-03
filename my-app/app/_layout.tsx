// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import './globals.css'; // Import global styles
export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false, // set false if you want full screen
        }}
      />
    </>
  );
}
