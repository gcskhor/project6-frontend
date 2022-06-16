import React from 'react';
import ReceiptMainScreen from '../Receipts/ReceiptMainScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../Receipts/CameraScreen';

export default function EnterReceipt() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName='Choose Mode'>
      <Stack.Screen name='Choose Mode' component={ReceiptMainScreen} />
      <Stack.Screen name='Camera Mode' component={CameraScreen} />
    </Stack.Navigator>
  );
}