import React from 'react';
import { View, Text } from '@tarojs/components';
import { useShareAppMessage } from '@tarojs/taro';
import styles from './index.module.scss';
import { warningItems } from '@/data/knowledge';

const WarningPage: React.FC = () => {
  useShareAppMessage(() => {
    return {
      title: '饮用禁忌 - 酒识百科',
      path: '/pages/warning/index'
    };
  });

  const icons = ['🚫', '💊', '📖', '⚠️'];

  return (
    <View className={styles.warningPage}>
      <View className={styles.header}>
        <Text className={styles.title}>饮酒须知</Text>
        <Text className={styles.subtitle}>健康饮酒，珍爱生命</Text>
      </View>

      <View className={styles.banner}>
        <Text className={styles.bannerText}>
          <Text className={styles.bannerHighlight}>🚨 重要提示：</Text>
          {'\n'}过量饮酒有害健康，未成年人禁止饮酒。酒后请勿驾驶。
        </Text>
      </View>

      <View className={styles.list}>
        {warningItems.map((item, index) => (
          <View key={item.id} className={styles.item}>
            <View className={styles.itemHeader}>
              <Text className={styles.icon}>{icons[index % icons.length]}</Text>
              <Text className={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text className={styles.itemContent}>{item.content}</Text>
          </View>
        ))}
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>
          本应用提供的信息仅供参考，不能替代专业医疗建议。
          {'\n'}如有健康问题，请咨询专业医生。
          {'\n'}请勿酒后驾车，遵守交通法规。
        </Text>
      </View>
    </View>
  );
};

export default WarningPage;
