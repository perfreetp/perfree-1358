import React from 'react';
import { View, Text } from '@tarojs/components';
import { useShareAppMessage } from '@tarojs/taro';
import styles from './index.module.scss';
import { decantItems } from '@/data/knowledge';

const DecantPage: React.FC = () => {
  useShareAppMessage(() => {
    return {
      title: '开瓶醒酒指南 - 酒识百科',
      path: '/pages/decant/index'
    };
  });

  const icons = ['🍾', '⏱️', '🥃', '🍶'];

  return (
    <View className={styles.decantPage}>
      <View className={styles.header}>
        <Text className={styles.title}>开瓶与醒酒指南</Text>
        <Text className={styles.subtitle}>掌握正确方法，让酒的风味完美呈现</Text>
      </View>

      <View className={styles.list}>
        {decantItems.map((item, index) => (
          <View key={item.id} className={styles.item}>
            <View className={styles.itemHeader}>
              <Text className={styles.icon}>{icons[index % icons.length]}</Text>
              <Text className={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text className={styles.itemContent}>{item.content}</Text>
          </View>
        ))}
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 小贴士</Text>
        <Text className={styles.tipText}>
          不同的酒有不同的最佳饮用方式。建议在开瓶前先了解酒的特性，选择合适的温度和杯型，才能获得最佳的品鉴体验。
        </Text>
      </View>
    </View>
  );
};

export default DecantPage;
