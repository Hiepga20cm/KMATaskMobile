import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Profile from "../view/profile";
import AuthStack from "./AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AppNav = () => {
  const Stack = createNativeStackNavigator();
  const context = useContext(AuthContext);
  const login = context.login;
  const userToken = context.userToken;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {userToken === null ? (
          <AuthStack />
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNav;
