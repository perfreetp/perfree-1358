import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { pairingGuides, occasionGuides, giftGuides } from '@/data/pairings';
import { getWineById } from '@/data/wines';
import SectionHeader from '@/components/SectionHeader';

const PairingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('food');

  useEffect(() => {
    console.log('[PairingPage] Mounted');
  }, []);

  usePullDownRefresh(() => {
    console.log('[PairingPage] Pull down refresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useShareAppMessage(() => {
    return {
      title: '酒识百科 - 专业酒类知识库',
      path: '/pages/pairing/index'
    };
  });

  const handleFoodClick = (guide: any) => {
    console.log('[PairingPage] Food pairing clicked:', guide.id);
    if (guide.wineRecommendations && guide.wineRecommendations.length > 0) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${guide.wineRecommendations[0]}`
      });
    }
  };

  const handleOccasionClick = (occasion: any) => {
    console.log('[PairingPage] Occasion clicked:', occasion.id);
    if (occasion.wineRecommendations && occasion.wineRecommendations.length > 0) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${occasion.wineRecommendations[0]}`
      });
    }
  };

  const handleWineClick = (wineId: string) => {
    console.log('[PairingPage] Wine clicked:', wineId);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${wineId}`
    });
  };

  const handleKnowledgeClick = (path: string) => {
    console.log('[PairingPage] Knowledge clicked:', path);
    Taro.navigateTo({ url: path });
  };

  const knowledgeItems = [
    { icon: '📚', title: '术语解释', desc: '了解专业酒类词汇', path: '/pages/glossary/index' },
    { icon: '🔍', title: '真假鉴别', desc: '避免买到假酒', path: '/pages/authenticate/index' },
    { icon: '🍷', title: '开瓶醒酒', desc: '正确的品酒方式', path: '/pages/decant/index' },
    { icon: '⚠️', title: '饮用禁忌', desc: '健康饮酒须知', path: '/pages/warning/index' }
  ];

  const occasionIcons: Record<string, string> = {
    '商务宴请': '💼',
    '浪漫约会': '💕',
    '家庭聚会': '🏠',
    '节日送礼': '🎁'
  };

  return (
    <View className={styles.pairingPage}>
      <View className={styles.content}>
        <View className={styles.banner}>
          <Text className={styles.bannerTitle}>美食配美酒</Text>
          <Text className={styles.bannerDesc}>找到最适合您口味的搭配</Text>
        </View>

        <View className={styles.section}>
          <SectionHeader title='菜品搭配' />
          <View className={styles.foodGrid}>
            {pairingGuides.map(guide => (
              <View
                key={guide.id}
                className={styles.foodCard}
                onClick={() => handleFoodClick(guide)}
              >
                <Image
                  className={styles.foodImage}
                  src={`https://picsum.photos/id/${guide.imageId}/400/300`}
                  mode='aspectFill'
                  onError={(e) => console.error('[PairingPage] Image error:', e)}
                />
                <View className={styles.foodContent}>
                  <Text className={styles.foodTitle}>{guide.title}</Text>
                  <Text className={styles.foodDesc}>{guide.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader title='场合推荐' />
          <View className={styles.occasionList}>
            {occasionGuides.map(occasion => (
              <View
                key={occasion.id}
                className={styles.occasionCard}
                onClick={() => handleOccasionClick(occasion)}
              >
                <View className={styles.occasionIcon}>
                  <Text>{occasionIcons[occasion.title] || '🍾'}</Text>
                </View>
                <View className={styles.occasionContent}>
                  <Text className={styles.occasionTitle}>{occasion.title}</Text>
                  <Text className={styles.occasionDesc}>{occasion.description}</Text>
                  <Text className={styles.occasionTips}>
                    💡 {occasion.tips[0]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.giftSection}>
          <SectionHeader title='送礼指南' />
          {giftGuides.map(gift => (
            <View key={gift.id} className={styles.giftCard}>
              <View className={styles.giftHeader}>
                <Text className={styles.giftTarget}>{gift.target}</Text>
                <Text className={styles.giftBudget}>预算：{gift.budget}</Text>
              </View>
              {gift.recommendations.map((rec, index) => {
                const wine = getWineById(rec.wineId);
                if (!wine) return null;
                return (
                  <View
                    key={index}
                    className={styles.giftItem}
                    onClick={() => handleWineClick(rec.wineId)}
                  >
                    <Image
                      className={styles.giftWineImage}
                      src={`https://picsum.photos/id/${wine.imageId}/100/100`}
                      mode='aspectFill'
                      onError={(e) => console.error('[PairingPage] Image error:', e)}
                    />
                    <View className={styles.giftWineInfo}>
                      <Text className={styles.giftWineName}>{wine.name}</Text>
                      <Text className={styles.giftWineReason}>{rec.reason}</Text>
                    </View>
                    <Text className={styles.giftWinePrice}>¥{wine.price}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View className={styles.knowledgeSection}>
          <SectionHeader title='品酒知识' />
          <View className={styles.knowledgeList}>
            {knowledgeItems.map((item, index) => (
              <View
                key={index}
                className={styles.knowledgeItem}
                onClick={() => handleKnowledgeClick(item.path)}
              >
                <View className={styles.knowledgeIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.knowledgeContent}>
                  <Text className={styles.knowledgeTitle}>{item.title}</Text>
                  <Text className={styles.knowledgeDesc}>{item.desc}</Text>
                </View>
                <Text className={styles.knowledgeArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PairingPage;
