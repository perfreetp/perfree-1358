import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useWineStore } from '@/store/WineContext';
import { getWineById } from '@/data/wines';
import { Wine } from '@/types/wine';

const ComparePage: React.FC = () => {
  const { compareList, toggleCompare, clearCompare } = useWineStore();
  const [compareWines, setCompareWines] = useState<Wine[]>([]);

  useEffect(() => {
    console.log('[ComparePage] Compare list:', compareList);
    const wines = compareList.map(id => getWineById(id)).filter(Boolean) as Wine[];
    setCompareWines(wines);
  }, [compareList]);

  useShareAppMessage(() => {
    return {
      title: '酒款对比 - 酒识百科',
      path: '/pages/compare/index'
    };
  });

  const handleRemove = (wineId: string) => {
    console.log('[ComparePage] Removing from compare:', wineId);
    toggleCompare(wineId);
  };

  const handleClearAll = () => {
    console.log('[ComparePage] Clearing all');
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空对比清单吗？',
      success: (res) => {
        if (res.confirm) {
          clearCompare();
        }
      }
    });
  };

  const handleAddMore = () => {
    console.log('[ComparePage] Navigating to search');
    Taro.switchTab({
      url: '/pages/search/index'
    });
  };

  const handleExport = () => {
    if (compareWines.length === 0) return;
    console.log('[ComparePage] Exporting compare list');
    const content = compareWines.map(w => `- ${w.name} ¥${w.price}`).join('\n');
    Taro.showModal({
      title: '对比清单',
      content,
      showCancel: false,
      confirmText: '好的'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} className={styles.ratingStars} style={{ color: i <= fullStars ? '#D4AF37' : '#E5E6EB' }}>
          ★
        </Text>
      );
    }
    return <View>{stars}</View>;
  };

  const getWinnerIndex = (field: string): number => {
    if (compareWines.length < 2) return -1;
    if (field === 'price') {
      const prices = compareWines.map(w => w.price);
      return prices.indexOf(Math.min(...prices));
    }
    if (field === 'abv') {
      const abvs = compareWines.map(w => w.abv);
      return abvs.indexOf(Math.max(...abvs));
    }
    if (field === 'rating') {
      const ratings = compareWines.map(w => w.rating);
      return ratings.indexOf(Math.max(...ratings));
    }
    if (field === 'aroma') {
      const counts = compareWines.map(w => w.aroma.length);
      return counts.indexOf(Math.max(...counts));
    }
    return -1;
  };

  const compareFields = [
    { key: 'origin', label: '产地', render: (w: Wine) => `${w.origin}` },
    { key: 'region', label: '产区', render: (w: Wine) => w.region },
    { key: 'abv', label: '酒精度', render: (w: Wine) => `${w.abv}%` },
    { key: 'price', label: '价格', render: (w: Wine) => `¥${w.price}` },
    { key: 'servingTemp', label: '适饮温度', render: (w: Wine) => w.servingTemp },
    { key: 'glassType', label: '建议杯型', render: (w: Wine) => w.glassType },
    { key: 'rating', label: '评分', render: (w: Wine) => renderStars(w.rating) },
    { key: 'aroma', label: '香气', render: (w: Wine) => w.aroma.map(a => <Text key={a} className={styles.tag}>{a}</Text>) },
    { key: 'taste', label: '口感', render: (w: Wine) => w.taste.map(t => <Text key={t} className={styles.tag}>{t}</Text>) },
    { key: 'vintage', label: '年份', render: (w: Wine) => w.vintage ? w.vintage : '-' },
    { key: 'capacity', label: '容量', render: (w: Wine) => w.capacity || '-' },
    { key: 'decantTime', label: '醒酒时间', render: (w: Wine) => w.decantTime || '-' }
  ];

  if (compareWines.length === 0) {
    return (
      <View className={styles.comparePage}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>还没有添加对比酒款</Text>
          <Button className={styles.actionBtn} onClick={handleAddMore}>
            去添加酒款
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.comparePage}>
      <View className={styles.content}>
        <View className={styles.compareHeader}>
          {compareWines.map(wine => (
            <View key={wine.id} className={styles.headerCell}>
              <Image
                className={styles.wineImage}
                src={`https://picsum.photos/id/${wine.imageId}/150/150`}
                mode='aspectFill'
                onError={(e) => console.error('[ComparePage] Image error:', e)}
              />
              <Text className={styles.wineName}>{wine.name}</Text>
              <Text className={styles.winePrice}>¥{wine.price}</Text>
              <Button
                className={styles.removeBtn}
                onClick={() => handleRemove(wine.id)}
              >
                移除 ✕
              </Button>
            </View>
          ))}
        </View>

        <View className={styles.compareTable}>
          {compareFields.map(field => {
            const winnerIndex = getWinnerIndex(field.key);
            return (
              <View key={field.key} className={styles.compareRow}>
                <View className={styles.rowLabel}>
                  <Text>{field.label}</Text>
                </View>
                {compareWines.map((wine, index) => (
                  <View
                    key={wine.id}
                    className={classnames(
                      styles.rowCell,
                      winnerIndex === index && styles.winner
                    )}
                  >
                    {winnerIndex === index && (
                      <Text className={styles.winnerBadge}>🏆 优胜</Text>
                    )}
                    <View>{field.render(wine)}</View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.bottomBtn, styles.secondaryBtn)}
          onClick={handleClearAll}
        >
          清空
        </Button>
        <Button
          className={classnames(styles.bottomBtn, styles.secondaryBtn)}
          onClick={handleAddMore}
        >
          添加
        </Button>
        <Button
          className={classnames(styles.bottomBtn, styles.primaryBtn)}
          onClick={handleExport}
        >
          导出清单
        </Button>
      </View>
    </View>
  );
};

export default ComparePage;
