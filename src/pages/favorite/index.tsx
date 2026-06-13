import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useWineStore } from '@/store/WineContext';
import { getWineById, getWinesByIds } from '@/data/wines';
import WineCard from '@/components/WineCard';
import SectionHeader from '@/components/SectionHeader';
import { Wine } from '@/types/wine';

const FavoritePage: React.FC = () => {
  const { favorites, ratingNotes, compareList, clearCompare, toggleFavorite, toggleCompare, isFavorite, isInCompare } = useWineStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'compare'>('favorites');
  const [favoriteWines, setFavoriteWines] = useState<Wine[]>([]);
  const [compareWines, setCompareWines] = useState<Wine[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSource, setExportSource] = useState<'favorites' | 'compare'>('favorites');
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [compareTotalPrice, setCompareTotalPrice] = useState(0);

  useEffect(() => {
    console.log('[FavoritePage] Mounted');
    loadFavorites();
    loadCompareWines();
  }, [favorites, compareList]);

  usePullDownRefresh(() => {
    console.log('[FavoritePage] Pull down refresh');
    loadFavorites();
    loadCompareWines();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useShareAppMessage(() => {
    const wines = exportSource === 'favorites' ? favoriteWines : compareWines;
    const shareText = generateShareText(wines);
    return {
      title: shareText.title,
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

  const loadCompareWines = () => {
    console.log('[FavoritePage] Loading compare wines:', compareList);
    const wines = compareList.map(id => getWineById(id)).filter(Boolean) as Wine[];
    setCompareWines(wines);
    const total = wines.reduce((sum, wine) => sum + wine.price, 0);
    setCompareTotalPrice(total);
  };

  const generateShareText = (wines: Wine[]) => {
    if (wines.length === 0) {
      return {
        title: '酒识百科 - 我的酒单',
        content: '来酒识百科发现更多美酒'
      };
    }
    const total = wines.reduce((sum, w) => sum + w.price, 0);
    const lines = wines.map(w => `· ${w.name} ¥${w.price}`).join('\n');
    const content = `🍷 我的酒单推荐\n\n${lines}\n\n共${wines.length}款，合计 ¥${total}\n—— 来自「酒识百科」`;
    return {
      title: `精选${wines.length}款好酒推荐，合计¥${total}`,
      content
    };
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

  const handleExportClick = (source: 'favorites' | 'compare') => {
    const wines = source === 'favorites' ? favoriteWines : compareWines;
    if (wines.length === 0) {
      Taro.showToast({ title: '暂无酒款可导出', icon: 'none' });
      return;
    }
    console.log('[FavoritePage] Opening export modal, source:', source);
    setExportSource(source);
    setShowExportModal(true);
  };

  const handleCopyText = () => {
    const wines = exportSource === 'favorites' ? favoriteWines : compareWines;
    const { content } = generateShareText(wines);
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  };

  const handleShareText = () => {
    const wines = exportSource === 'favorites' ? favoriteWines : compareWines;
    const { content } = generateShareText(wines);
    Taro.showModal({
      title: '分享文案',
      content,
      showCancel: false,
      confirmText: '复制文案',
      success: () => {
        Taro.setClipboardData({
          data: content,
          success: () => {
            Taro.showToast({ title: '已复制文案', icon: 'success' });
          }
        });
      }
    });
  };

  const handleShowCard = () => {
    setShowExportModal(false);
    setShowCardPreview(true);
  };

  const handleSaveCard = () => {
    Taro.showToast({ title: '长按卡片可保存图片', icon: 'none' });
  };

  const handleClearCompare = () => {
    console.log('[FavoritePage] Clearing compare list');
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空对比清单吗？',
      success: (res) => {
        if (res.confirm) {
          clearCompare();
          Taro.showToast({ title: '已清空对比清单', icon: 'success' });
        }
      }
    });
  };

  const handleBatchAddCompare = () => {
    if (favoriteWines.length === 0) {
      Taro.showToast({ title: '暂无收藏酒款', icon: 'none' });
      return;
    }
    const canAdd = favoriteWines.filter(w => !isInCompare(w.id)).slice(0, 3 - compareList.length);
    if (canAdd.length === 0) {
      Taro.showToast({ title: '对比清单已满或已全部添加', icon: 'none' });
      return;
    }
    canAdd.forEach(w => toggleCompare(w.id));
    Taro.showToast({ title: `已添加${canAdd.length}款到对比`, icon: 'success' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} className={i <= fullStars ? styles.star : styles.emptyStar}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const sortedNotes = [...ratingNotes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const currentWines = activeTab === 'favorites' ? favoriteWines : compareWines;
  const currentTotal = activeTab === 'favorites' ? totalPrice : compareTotalPrice;

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
            className={classnames(styles.tab, activeTab === 'compare' && styles.activeTab)}
            onClick={() => setActiveTab('compare')}
          >
            对比清单 ({compareList.length})
          </Button>
        </View>

        <View className={styles.actionBar}>
          <Button className={styles.actionBtn} onClick={() => handleExportClick(activeTab)}>
            <Text>📤</Text>
            <Text>导出清单</Text>
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.primaryBtn)}
            onClick={() => handleShareText()}
          >
            <Text>📝</Text>
            <Text>生成分享文案</Text>
          </Button>
        </View>

        {activeTab === 'compare' && compareList.length > 0 && (
          <View className={styles.compareActions}>
            <Button className={styles.compareActionBtn} onClick={handleCompareClick}>
              查看详细对比
            </Button>
            <Button className={styles.compareActionSecondary} onClick={handleClearCompare}>
              清空
            </Button>
          </View>
        )}

        {activeTab === 'favorites' && favorites.length > 0 && (
          <Button className={styles.batchAddBtn} onClick={handleBatchAddCompare}>
            批量加入对比
          </Button>
        )}

        <View>
          <SectionHeader title={activeTab === 'favorites' ? '我的收藏' : '对比清单'} />
          {currentWines.length > 0 ? (
            <View className={styles.wineList}>
              {currentWines.map(wine => (
                <WineCard key={wine.id} wine={wine} showCompare />
              ))}
              <View className={styles.totalBar}>
                <Text className={styles.totalLabel}>共{currentWines.length}款，合计</Text>
                <Text className={styles.totalPrice}>¥{currentTotal}</Text>
              </View>
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>{activeTab === 'favorites' ? '🤍' : '📋'}</Text>
              <Text className={styles.emptyText}>
                {activeTab === 'favorites' ? '还没有收藏任何酒款' : '对比清单还是空的'}
              </Text>
              <Text className={styles.emptyHint}>
                {activeTab === 'favorites' ? '去发现喜欢的美酒吧' : '去搜索页添加酒款对比'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {showExportModal && (
        <View className={styles.exportModal} onClick={() => setShowExportModal(false)}>
          <View className={styles.exportContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.exportTitle}>
              {exportSource === 'favorites' ? '收藏清单' : '对比清单'}
            </Text>
            
            <View className={styles.exportOptions}>
              <Button className={styles.exportOption} onClick={handleCopyText}>
                <View className={styles.exportOptionIcon}>📋</View>
                <View className={styles.exportOptionInfo}>
                  <Text className={styles.exportOptionTitle}>一键复制</Text>
                  <Text className={styles.exportOptionDesc}>复制清单文字到剪贴板</Text>
                </View>
              </Button>
              
              <Button className={styles.exportOption} onClick={handleShareText}>
                <View className={styles.exportOptionIcon}>💬</View>
                <View className={styles.exportOptionInfo}>
                  <Text className={styles.exportOptionTitle}>分享文案</Text>
                  <Text className={styles.exportOptionDesc}>生成适合转发的分享文案</Text>
                </View>
              </Button>
              
              <Button className={styles.exportOption} onClick={handleShowCard}>
                <View className={styles.exportOptionIcon}>🖼️</View>
                <View className={styles.exportOptionInfo}>
                  <Text className={styles.exportOptionTitle}>清单卡片</Text>
                  <Text className={styles.exportOptionDesc}>生成精美清单图片卡片</Text>
                </View>
              </Button>
            </View>

            <Button
              className={classnames(styles.exportBtn, styles.cancelBtn)}
              onClick={() => setShowExportModal(false)}
            >
              取消
            </Button>
          </View>
        </View>
      )}

      {showCardPreview && currentWines.length > 0 && (
        <View className={styles.exportModal} onClick={() => setShowCardPreview(false)}>
          <ScrollView className={styles.cardScroll} onClick={(e) => e.stopPropagation()}>
            <View className={styles.giftCard}>
              <View className={styles.giftCardHeader}>
                <Text className={styles.giftCardTitle}>🍷 我的精选酒单</Text>
                <Text className={styles.giftCardSubtitle}>来自「酒识百科」</Text>
              </View>
              
              <View className={styles.giftCardBody}>
                {currentWines.map((wine, index) => (
                  <View key={wine.id} className={styles.giftCardItem}>
                    <View className={styles.giftCardIndex}>{index + 1}</View>
                    <Image
                      className={styles.giftCardImage}
                      src={`https://picsum.photos/id/${wine.imageId}/100/100`}
                      mode='aspectFill'
                    />
                    <View className={styles.giftCardInfo}>
                      <Text className={styles.giftCardName}>{wine.name}</Text>
                      <Text className={styles.giftCardDesc}>
                        {wine.origin} · {wine.subCategory}
                      </Text>
                      <Text className={styles.giftCardFor}>
                        适合: {wine.suitableFor.slice(0, 2).join('、')}
                      </Text>
                    </View>
                    <Text className={styles.giftCardPrice}>¥{wine.price}</Text>
                  </View>
                ))}
              </View>

              <View className={styles.giftCardFooter}>
                <View className={styles.giftCardTotal}>
                  <Text className={styles.giftCardTotalLabel}>共{currentWines.length}款 · 合计</Text>
                  <Text className={styles.giftCardTotalPrice}>¥{currentTotal}</Text>
                </View>
                <Text className={styles.giftCardSlogan}>探索美酒世界，品味生活艺术</Text>
              </View>
            </View>

            <View className={styles.cardActions}>
              <Button
                className={classnames(styles.exportBtn, styles.cancelBtn)}
                onClick={() => setShowCardPreview(false)}
              >
                关闭
              </Button>
              <Button
                className={classnames(styles.exportBtn, styles.confirmBtn)}
                onClick={handleSaveCard}
              >
                保存图片
              </Button>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FavoritePage;
