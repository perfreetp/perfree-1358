import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Textarea } from '@tarojs/components';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { getWineById } from '@/data/wines';
import { useWineStore } from '@/store/WineContext';
import FlavorTag from '@/components/FlavorTag';
import { Wine } from '@/types/wine';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const { toggleFavorite, isFavorite, addRating, getRating, toggleCompare, isInCompare } = useWineStore();

  const [wine, setWine] = useState<Wine | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingNote, setRatingNote] = useState('');

  useEffect(() => {
    const wineId = router.params.id;
    console.log('[DetailPage] Wine ID:', wineId);
    if (wineId) {
      const wineData = getWineById(wineId);
      if (wineData) {
        setWine(wineData);
        Taro.setNavigationBarTitle({ title: wineData.name });
        const existingRating = getRating(wineId);
        if (existingRating) {
          setSelectedRating(existingRating.rating);
          setRatingNote(existingRating.note || '');
        }
      } else {
        Taro.showToast({ title: '酒款不存在', icon: 'none' });
      }
    }
  }, []);

  useShareAppMessage(() => {
    if (!wine) return { title: '酒识百科' };
    return {
      title: `${wine.name} - ${wine.subCategory}`,
      path: `/pages/detail/index?id=${wine.id}`
    };
  });

  if (!wine) {
    return (
      <View className={styles.detailPage}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleFavoriteClick = () => {
    console.log('[DetailPage] Toggle favorite:', wine.id);
    toggleFavorite(wine.id);
    Taro.showToast({
      title: isFavorite(wine.id) ? '已取消收藏' : '已加入收藏',
      icon: 'success'
    });
  };

  const handleCompareClick = () => {
    console.log('[DetailPage] Toggle compare:', wine.id);
    toggleCompare(wine.id);
    Taro.showToast({
      title: isInCompare(wine.id) ? '已移除对比' : '已加入对比',
      icon: 'success'
    });
  };

  const handleRateClick = () => {
    console.log('[DetailPage] Opening rating modal');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    if (selectedRating === 0) {
      Taro.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }
    console.log('[DetailPage] Submitting rating:', selectedRating, ratingNote);
    addRating({
      wineId: wine.id,
      rating: selectedRating,
      note: ratingNote,
      createdAt: new Date().toISOString()
    });
    setShowRatingModal(false);
    Taro.showToast({ title: '评分已保存', icon: 'success' });
  };

  const handleStarClick = (star: number) => {
    console.log('[DetailPage] Star clicked:', star);
    setSelectedRating(star);
  };

  const renderStars = (rating: number, size: 'small' | 'large' = 'small') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const sizeClass = size === 'large' ? '56rpx' : '32rpx';
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: sizeClass, color: i <= fullStars ? '#D4AF37' : '#E5E6EB' }}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const isFav = isFavorite(wine.id);
  const inCompare = isInCompare(wine.id);

  return (
    <View className={styles.detailPage}>
      <View className={styles.headerImage}>
        <Button className={styles.backBtn} onClick={handleBack}>
          ‹
        </Button>
        <Button className={styles.favoriteBtn} onClick={handleFavoriteClick}>
          {isFav ? '❤️' : '🤍'}
        </Button>
        <Image
          className={styles.wineImage}
          src={`https://picsum.photos/id/${wine.imageId}/750/400`}
          mode='aspectFill'
          onError={(e) => console.error('[DetailPage] Image error:', e)}
        />
      </View>

      <View className={styles.content}>
        <View className={styles.mainInfo}>
          <Text className={styles.name}>{wine.name}</Text>
          <Text className={styles.nameEn}>{wine.nameEn}</Text>
          <Text className={styles.category}>{wine.subCategory}</Text>
          <View className={styles.priceRow}>
            <Text className={styles.price}>
              ¥{wine.price}
              <Text className={styles.priceUnit}>/瓶</Text>
            </Text>
            <View className={styles.rating}>
              <View className={styles.ratingStars}>
                {renderStars(wine.rating)}
              </View>
              <Text className={styles.ratingValue}>{wine.rating}</Text>
            </View>
          </View>
        </View>

        <View className={styles.metaGrid}>
          <View className={styles.metaCard}>
            <Text className={styles.metaLabel}>产地</Text>
            <Text className={styles.metaValue}>{wine.origin} · {wine.region}</Text>
          </View>
          <View className={styles.metaCard}>
            <Text className={styles.metaLabel}>酒精度</Text>
            <Text className={styles.metaValue} style={{ color: '#B22222' }}>{wine.abv}% vol</Text>
          </View>
          <View className={styles.metaCard}>
            <Text className={styles.metaLabel}>适饮温度</Text>
            <Text className={styles.metaValue}>{wine.servingTemp}</Text>
          </View>
          <View className={styles.metaCard}>
            <Text className={styles.metaLabel}>建议杯型</Text>
            <Text className={styles.metaValue}>{wine.glassType}</Text>
          </View>
          {wine.vintage && (
            <View className={styles.metaCard}>
              <Text className={styles.metaLabel}>年份</Text>
              <Text className={styles.metaValue}>{wine.vintage}</Text>
            </View>
          )}
          {wine.capacity && (
            <View className={styles.metaCard}>
              <Text className={styles.metaLabel}>容量</Text>
              <Text className={styles.metaValue}>{wine.capacity}</Text>
            </View>
          )}
          {wine.decantTime && (
            <View className={styles.metaCard}>
              <Text className={styles.metaLabel}>醒酒时间</Text>
              <Text className={styles.metaValue}>{wine.decantTime}</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>风味描述</Text>
          <Text className={styles.description}>{wine.flavorProfile}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>香气特征</Text>
          <View className={styles.flavorTags}>
            {wine.aroma.map((aroma, index) => (
              <Button key={index} className={classnames(styles.flavorTag, styles.aromaTag)}>
                🌸 {aroma}
              </Button>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>口感特点</Text>
          <View className={styles.flavorTags}>
            {wine.taste.map((taste, index) => (
              <Button key={index} className={classnames(styles.flavorTag, styles.tasteTag)}>
                👅 {taste}
              </Button>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>搭配建议</Text>
          <View className={styles.pairingList}>
            {wine.pairingFood.map((food, index) => (
              <View key={index} className={styles.pairingItem}>
                <Text className={styles.pairingIcon}>🍽️</Text>
                <Text className={styles.pairingText}>{food}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>适用场合</Text>
          <View className={styles.flavorTags}>
            {wine.occasions.map((occasion, index) => (
              <Button key={index} className={classnames(styles.flavorTag, styles.aromaTag)}>
                🎉 {occasion}
              </Button>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>适合人群</Text>
          <View className={styles.flavorTags}>
            {wine.suitableFor.map((people, index) => (
              <Button key={index} className={classnames(styles.flavorTag, styles.tasteTag)}>
                👤 {people}
              </Button>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>真假鉴别</Text>
          <View className={styles.authenticitySection}>
            {wine.authenticityTips.map((tip, index) => (
              <View key={index} className={styles.authenticityItem}>
                <Text className={styles.authenticityIcon}>✅</Text>
                <Text className={styles.authenticityText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>温馨提示</Text>
          <View className={styles.warnings}>
            {wine.warnings.map((warning, index) => (
              <View key={index} className={styles.warningItem}>
                <Text className={styles.warningIcon}>⚠️</Text>
                <Text className={styles.warningText}>{warning}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.actionBtn, styles.secondaryBtn)}
          onClick={handleCompareClick}
        >
          <Text>{inCompare ? '✓' : '+'}</Text>
          <Text>{inCompare ? '已加入对比' : '对比'}</Text>
        </Button>
        <Button
          className={classnames(styles.actionBtn, styles.secondaryBtn)}
          onClick={handleRateClick}
        >
          <Text>⭐</Text>
          <Text>评分笔记</Text>
        </Button>
        <Button
          className={classnames(styles.actionBtn, styles.primaryBtn)}
          onClick={handleFavoriteClick}
        >
          <Text>{isFav ? '❤️' : '🤍'}</Text>
          <Text>{isFav ? '已收藏' : '收藏'}</Text>
        </Button>
      </View>

      {showRatingModal && (
        <View className={styles.ratingModal} onClick={() => setShowRatingModal(false)}>
          <View className={styles.ratingContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.ratingModalTitle}>为 {wine.name} 评分</Text>
            <View className={styles.ratingStarsSelect}>
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  className={styles.starBtn}
                  onClick={() => handleStarClick(star)}
                >
                  <Text style={{ color: star <= selectedRating ? '#D4AF37' : '#E5E6EB' }}>★</Text>
                </Button>
              ))}
            </View>
            <Textarea
              className={styles.ratingNoteInput}
              placeholder='记录您的品鉴感受...'
              value={ratingNote}
              onInput={(e) => setRatingNote(e.detail.value)}
              maxlength={200}
            />
            <View className={styles.ratingActions}>
              <Button
                className={classnames(styles.actionBtn, styles.secondaryBtn)}
                onClick={() => setShowRatingModal(false)}
              >
                取消
              </Button>
              <Button
                className={classnames(styles.actionBtn, styles.primaryBtn)}
                onClick={handleRatingSubmit}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DetailPage;
