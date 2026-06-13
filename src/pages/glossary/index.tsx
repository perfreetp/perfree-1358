import React from 'react';
import { View, Text } from '@tarojs/components';
import { useShareAppMessage } from '@tarojs/taro';
import styles from './index.module.scss';
import { glossaryItems } from '@/data/knowledge';

const GlossaryPage: React.FC = () => {
  useShareAppMessage(() => {
    return {
      title: '酒类术语解释 - 酒识百科',
      path: '/pages/glossary/index'
    };
  });

  const icons = ['📚', '🍷', '🍶', '🥃', '🏺', '🍺', '⏳', '📅'];

  return (
    <View className={styles.glossaryPage}>
      <View className={styles.header}>
        <Text className={styles.title}>酒类术语解释</Text>
        <Text className={styles.subtitle}>了解专业词汇，成为品酒达人</Text>
      </View>

      <View className={styles.list}>
        {glossaryItems.map((item, index) => (
          <View key={item.id} className={styles.item}>
            <View className={styles.itemHeader}>
              <Text className={styles.icon}>{icons[index % icons.length]}</Text>
              <Text className={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text className={styles.itemContent}>{item.content}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GlossaryPage;
