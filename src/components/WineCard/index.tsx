import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Wine } from '@/types/wine';
import { useWineStore } from '@/store/WineContext';

interface WineCardProps {
  wine: Wine;
  showCompare?: boolean;
}

const WineCard: React.FC<WineCardProps> = ({ wine, showCompare = false }) => {
  const { toggleFavorite, isFavorite, toggleCompare, isInCompare } = useWineStore();

  const handleCardClick = () => {
    console.log('[WineCard] Navigating to detail:', wine.id);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${wine.id}`
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    console.log('[WineCard] Toggling favorite:', wine.id);
    toggleFavorite(wine.id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    console.log('[WineCard] Toggling compare:', wine.id);
    toggleCompare(wine.id);
  };

  const isFav = isFavorite(wine.id);
  const inCompare = isInCompare(wine.id);

  return (
    <View className={styles.wineCard} onClick={handleCardClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.wineImage}
          src={`https://picsum.photos/id/${wine.imageId}/200/200`}
          mode='aspectFill'
          onError={(e) => console.error('[WineCard] Image error:', e)}
        />
      </View>
      <View className={styles.content}>
        <View>
          <View className={styles.header}>
            <Text className={styles.name}>{wine.name}</Text>
            <Button
              className={classnames(styles.favoriteBtn, isFav && styles.favorited)}
              onClick={handleFavoriteClick}
            >
              {isFav ? '❤️' : '🤍'}
            </Button>
          </View>
          <Text className={styles.nameEn}>{wine.nameEn}</Text>
          <Text className={styles.category}>{wine.subCategory}</Text>
          <View className={styles.meta}>
            <View className={styles.metaItem}>
              <Text className={styles.metaLabel}>产地:</Text>
              <Text>{wine.origin}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaLabel}>酒精度:</Text>
              <Text>{wine.abv}%</Text>
            </View>
          </View>
        </View>
        <View className={styles.footer}>
          <Text className={styles.price}>
            ¥{wine.price}
            <Text className={styles.priceUnit}>/瓶</Text>
          </Text>
          <View className={styles.rating}>
            <Text>⭐</Text>
            <Text>{wine.rating}</Text>
          </View>
        </View>
        {showCompare && (
          <Button
            className={classnames(styles.compareBtn, inCompare && styles.inCompare)}
            onClick={handleCompareClick}
          >
            {inCompare ? '✓ 已加入对比' : '+ 对比'}
          </Button>
        )}
      </View>
    </View>
  );
};

export default WineCard;
