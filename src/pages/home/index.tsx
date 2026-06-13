import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { categories } from '@/data/categories';
import { wines } from '@/data/wines';
import CategoryCard from '@/components/CategoryCard';
import SectionHeader from '@/components/SectionHeader';

const HomePage: React.FC = () => {
  const [hotWines, setHotWines] = useState(wines.slice(0, 6));

  useEffect(() => {
    console.log('[HomePage] Mounted');
    loadData();
  }, []);

  usePullDownRefresh(() => {
    console.log('[HomePage] Pull down refresh');
    loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useShareAppMessage(() => {
    return {
      title: '酒识百科 - 专业酒类知识库',
      path: '/pages/home/index'
    };
  });

  const loadData = () => {
    console.log('[HomePage] Loading data');
    setHotWines(wines.sort((a, b) => b.rating - a.rating).slice(0, 6));
  };

  const handleSearchClick = () => {
    console.log('[HomePage] Navigating to search');
    Taro.switchTab({
      url: '/pages/search/index'
    });
  };

  const handleWineClick = (wineId: string) => {
    console.log('[HomePage] Navigating to detail:', wineId);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${wineId}`
    });
  };

  const handleQuickFilter = (type: string, value: string) => {
    console.log('[HomePage] Quick filter:', type, value);
    Taro.switchTab({
      url: '/pages/search/index'
    });
  };

  const handleKnowledgeClick = (path: string) => {
    console.log('[HomePage] Navigating to knowledge:', path);
    Taro.navigateTo({ url: path });
  };

  const quickItems = [
    { icon: '💼', text: '商务宴请', type: 'occasion', value: '商务宴请' },
    { icon: '🏠', text: '家庭聚会', type: 'occasion', value: '家庭聚会' },
    { icon: '🎁', text: '节日送礼', type: 'occasion', value: '节日送礼' },
    { icon: '👶', text: '新手入门', type: 'people', value: '新手入门' },
    { icon: '👩', text: '女性偏好', type: 'people', value: '女性偏好' },
    { icon: '🎩', text: '资深酒友', type: 'people', value: '资深酒友' }
  ];

  const knowledgeItems = [
    { icon: '📚', title: '术语解释', desc: '单宁、酒体等专业词汇', path: '/pages/glossary/index' },
    { icon: '🔍', title: '真假鉴别', desc: '茅台、红酒鉴别要点', path: '/pages/authenticate/index' },
    { icon: '🍷', title: '开瓶醒酒', desc: '正确的品酒步骤', path: '/pages/decant/index' },
    { icon: '⚠️', title: '饮用禁忌', desc: '健康饮酒指南', path: '/pages/warning/index' }
  ];

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>酒识百科</Text>
        <Text className={styles.headerSubtitle}>探索美酒世界，品味生活艺术</Text>
        <View className={styles.searchBar} onClick={handleSearchClick}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>搜索酒款、风味、搭配...</Text>
        </View>
      </View>

      <View className={styles.content}>
        <SectionHeader title='酒类分类' />
        <View className={styles.categoryGrid}>
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>

        <View className={styles.hotSection}>
          <SectionHeader title='热门推荐' actionText='查看更多' onAction={() => Taro.switchTab({ url: '/pages/search/index' })} />
          <ScrollView className={styles.hotScroll} scrollX enableFlex>
            {hotWines.map(wine => (
              <View key={wine.id} className={styles.hotCard} onClick={() => handleWineClick(wine.id)}>
                <Image
                  className={styles.hotImage}
                  src={`https://picsum.photos/id/${wine.imageId}/300/200`}
                  mode='aspectFill'
                  onError={(e) => console.error('[HomePage] Image error:', e)}
                />
                <Text className={styles.hotName}>{wine.name}</Text>
                <Text className={styles.hotPrice}>¥{wine.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.quickSection}>
          <SectionHeader title='场景筛选' />
          <View className={styles.quickGrid}>
            {quickItems.map((item, index) => (
              <View
                key={index}
                className={styles.quickItem}
                onClick={() => handleQuickFilter(item.type, item.value)}
              >
                <View className={styles.quickIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <Text className={styles.quickText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.knowledgeSection}>
          <SectionHeader title='知识百科' />
          <View className={styles.knowledgeGrid}>
            {knowledgeItems.map((item, index) => (
              <View
                key={index}
                className={styles.knowledgeCard}
                onClick={() => handleKnowledgeClick(item.path)}
              >
                <View className={styles.knowledgeIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.knowledgeText}>
                  <Text className={styles.knowledgeTitle}>{item.title}</Text>
                  <Text className={styles.knowledgeDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
