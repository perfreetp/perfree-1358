import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useWineStore } from '@/store/WineContext';
import { getWineById } from '@/data/wines';
import WineCard from '@/components/WineCard';
import SectionHeader from '@/components/SectionHeader';
import { Wine } from '@/types/wine';

const FavoritePage: React.FC = () => {
  const { favorites, ratingNotes, compareList, clearCompare } = useWineStore();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favoriteWines, setFavoriteWines] = useState<Wine[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log('[FavoritePage] Mounted');
    loadFavorites();
  }, [favorites]);

  usePullDownRefresh(() => {
    console.log('[FavoritePage] Pull down refresh');
    loadFavorites();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useShareAppMessage(() => {
    return {
      title: '酒识百科 - 专业酒类知识库',
      path: '/pages/favorite/index'
    };
  });

  const loadFavorites = () => {
    console.log('[FavoritePage] Loading favorites:', favorites);
    const wines = favorites.map(id => getWineById(id)).filter(Boolean) as Wine[];
    setFavoriteWines(wines);
    const total = wines.reduce((sum, wine) => sum + wine.price, 0);
    setTotalPrice(total);
  };

  const handleCompareClick = () => {
    if (compareList.length < 2) {
      Taro.showToast({ title: '请先在搜索页添加对比酒款', icon: 'none' });
      return;
    }
    console.log('[FavoritePage] Navigating to compare');
    Taro.navigateTo({
      url: '/pages/compare/index'
    });
  };

  const handleExportClick = () => {
    if (favoriteWines.length === 0) {
      Taro.showToast({ title: '暂无收藏酒款可导出', icon: 'none' });
      return;
    }
    console.log('[FavoritePage] Opening export modal');
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    console.log('[FavoritePage] Exporting gift list');
    Taro.showModal({
      title: '导出成功',
      content: `礼品清单已生成，共${favoriteWines.length}款酒，总价¥${totalPrice}`,
      showCancel: false,
      confirmText: '好的'
    });
    setShowExportModal(false);
  };

  const handleClearCompare = () => {
    console.log('[FavoritePage] Clearing compare list');
    clearCompare();
    Taro.showToast({ title: '已清空对比清单', icon: 'success' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} className={i <= rating ? styles.star : styles.emptyStar}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const sortedNotes = [...ratingNotes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View className={styles.favoritePage}>
      <View className={styles.content}>
        <View className={styles.tabs}>
          <Button
            className={classnames(styles.tab, activeTab === 'favorites' && styles.activeTab)}
            onClick={() => setActiveTab('favorites')}
          >
            收藏夹 ({favorites.length})
          </Button>
          <Button
            className={classnames(styles.tab, activeTab === 'notes' && styles.activeTab)}
            onClick={() => setActiveTab('notes')}
          >
            评分笔记 ({ratingNotes.length})
          </Button>
        </View>

        <View className={styles.actionBar}>
          <Button className={styles.actionBtn} onClick={handleCompareClick}>
            <Text>📋</Text>
            <Text>对比清单 ({compareList.length})</Text>
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.primaryBtn)}
            onClick={handleExportClick}
          >
            <Text>📄</Text>
            <Text>导出礼品单</Text>
          </Button>
        </View>

        {compareList.length > 0 && (
          <Button
            onClick={handleClearCompare}
            style={{ width: '100%', height: '64rpx', borderRadius: '32rpx', background: '#fff', color: '#86909C', fontSize: '24rpx', marginBottom: '24rpx', border: '1rpx solid #e5e6eb' }}
          >
            清空对比清单
          </Button>
        )}

        {activeTab === 'favorites' && (
          <View>
            <SectionHeader title='我的收藏' />
            {favoriteWines.length > 0 ? (
              <View className={styles.wineList}>
                {favoriteWines.map(wine => (
                  <WineCard key={wine.id} wine={wine} showCompare />
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🤍</Text>
                <Text className={styles.emptyText}>还没有收藏任何酒款</Text>
                <Text className={styles.emptyHint}>去发现喜欢的美酒吧</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'notes' && (
          <View>
            <SectionHeader title='我的笔记' />
            {sortedNotes.length > 0 ? (
              <View>
                {sortedNotes.map(note => {
                  const wine = getWineById(note.wineId);
                  if (!wine) return null;
                  return (
                    <View key={note.wineId} className={styles.noteCard}>
                      <View className={styles.noteHeader}>
                        <Image
                          className={styles.noteWineImage}
                          src={`https://picsum.photos/id/${wine.imageId}/100/100`}
                          mode='aspectFill'
                          onError={(e) => console.error('[FavoritePage] Image error:', e)}
                        />
                        <View className={styles.noteWineInfo}>
                          <Text className={styles.noteWineName}>{wine.name}</Text>
                          <View className={styles.noteRating}>
                            {renderStars(note.rating)}
                          </View>
                        </View>
                      </View>
                      {note.note && (
                        <Text className={styles.noteContent}>{note.note}</Text>
                      )}
                      <Text className={styles.noteDate}>
                        {new Date(note.createdAt).toLocaleDateString('zh-CN')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📝</Text>
                <Text className={styles.emptyText}>还没有任何评分笔记</Text>
                <Text className={styles.emptyHint}>在酒款详情页记录您的品鉴感受</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {showExportModal && (
        <View className={styles.exportModal} onClick={() => setShowExportModal(false)}>
          <View className={styles.exportContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.exportTitle}>礼品清单预览</Text>
            {favoriteWines.map(wine => (
              <View key={wine.id} className={styles.exportItem}>
                <Text className={styles.exportItemName}>{wine.name}</Text>
                <Text className={styles.exportItemPrice}>¥{wine.price}</Text>
              </View>
            ))}
            <View className={styles.exportTotal}>
              <Text className={styles.exportTotalLabel}>合计</Text>
              <Text className={styles.exportTotalPrice}>¥{totalPrice}</Text>
            </View>
            <View className={styles.exportActions}>
              <Button
                className={classnames(styles.exportBtn, styles.cancelBtn)}
                onClick={() => setShowExportModal(false)}
              >
                取消
              </Button>
              <Button
                className={classnames(styles.exportBtn, styles.confirmBtn)}
                onClick={handleConfirmExport}
              >
                确认导出
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FavoritePage;
