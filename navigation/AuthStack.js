import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../view/login'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>       
            <Stack.Screen name="LoginScreen" component={Login} />
        </Stack.Navigator>
    )
}

export default AuthStack
