import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthScreen from '../Screens/AuthScreen'
import Home from '../Screens/Home'
export default function index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <SafeAreaView>

      {isAuthenticated ? (
            <Home/>
          ) : (
            <AuthScreen onAuthenticated={setIsAuthenticated} />
          )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})