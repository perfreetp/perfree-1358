import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Category } from '@/types/wine';
import { useWineStore } from '@/store/WineContext';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { setQuickFilter } = useWineStore();

  const handleClick = () => {
    console.log('[CategoryCard] Click category:', category.id);
    setQuickFilter('category', category.id);
    Taro.switchTab({
      url: '/pages/search/index'
    });
  };

  return (
    <View className={styles.categoryCard} onClick={handleClick}>
      <View className={styles.icon}>
        <Text>{category.icon}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{category.name}</Text>
        <Text className={styles.description}>{category.description}</Text>
      </View>
      <Text className={styles.count}>{category.count}款</Text>
    </View>
  );
};

export default CategoryCard;
