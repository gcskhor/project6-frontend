import React from 'react';

import {
  Alert, VStack, HStack, Text,
} from 'native-base';

export default function ExpiryAlert({ num }) {
  return (
    <Alert w="100%" status="warning" textAlign="center">
      <VStack space={2} flexShrink={1} w="100%">
        <HStack space={2} justifyContent="center" alignItems="center">
          <Alert.Icon />
          <Text>
            You have
            {' '}
            {num}
            {' '}
            {num === 1 ? 'item' : 'items'}
            {' '}
            expiring in the next 3 days.
          </Text>
        </HStack>
      </VStack>
    </Alert>
  );
}
