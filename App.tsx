import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}