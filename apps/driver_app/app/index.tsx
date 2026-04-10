import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-blue-600">
      <Text className="text-white text-5xl font-bold mb-4">M-APP</Text>
      <ActivityIndicator size="large" color="white" />
      <Text className="text-white mt-4 opacity-80">Ачаалж байна...</Text>
    </View>
  );
}
