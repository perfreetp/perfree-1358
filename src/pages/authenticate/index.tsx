import React from 'react';
import { View, Text } from '@tarojs/components';
import { useShareAppMessage } from '@tarojs/taro';
import styles from './index.module.scss';
import { authenticateItems } from '@/data/knowledge';

const AuthenticatePage: React.FC = () => {
  useShareAppMessage(() => {
    return {
      title: '真假鉴别 - 酒识百科',
      path: '/pages/authenticate/index'
    };
  });

  const icons = ['🇨🇳', '🍷', '🥃', '💡'];

  return (
    <View className={styles.authenticatePage}>
      <View className={styles.header}>
        <Text className={styles.title}>真假鉴别要点</Text>
        <Text className={styles.subtitle}>学会这些，再也不怕买到假酒</Text>
      </View>

      <View className={styles.list}>
        {authenticateItems.map((item, index) => (
          <View key={item.id} className={styles.item}>
            <View className={styles.itemHeader}>
              <Text className={styles.icon}>{icons[index % icons.length]}</Text>
              <Text className={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text className={styles.itemContent}>{item.content}</Text>
          </View>
        ))}
      </View>

      <View className={styles.warning}>
        <Text className={styles.warningTitle}>⚠️ 温馨提示</Text>
        <Text className={styles.warningText}>
          购买酒类商品时，请务必选择正规渠道。如对商品真伪有疑问，可联系品牌官方或当地市场监督管理部门进行鉴定。
        </Text>
      </View>
    </View>
  );
};

export default AuthenticatePage;
