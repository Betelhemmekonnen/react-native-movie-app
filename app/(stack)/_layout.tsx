import { Stack } from 'expo-router';
import React from 'react';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: () => null,
        contentStyle: {
          backgroundColor: '#000',
        },
      }}
    >
      <Stack.Screen
        name="details/[id]"
        options={{
          headerShown: false,
          header: () => null,
          presentation: 'card',
          contentStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          header: () => null,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="trailer/[id]"
        options={{
          headerShown: false,
          header: () => null,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
