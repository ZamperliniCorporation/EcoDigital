import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

export function SkeletonListItem() {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 800 }}
      className="w-full flex-row items-center p-4 rounded-2xl mb-3 bg-gray-100"
    >
      <View className="w-8 h-6 bg-gray-200 rounded" />
      <View className="w-12 h-12 rounded-full bg-gray-200 ml-4" />
      <View className="ml-4">
        <View className="w-32 h-5 bg-gray-200 rounded" />
        <View className="w-16 h-4 bg-gray-200 rounded mt-2" />
      </View>
    </MotiView>
  );
}