import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useWineStore } from '@/store/WineContext';
import { getWineById } from '@/data/wines';
import { Wine } from '@/types/wine';

const ComparePage: React.FC = () => {
  const { compareList, toggleCompare, clearCompare } = useWineStore();
  const [compareWines, setCompareWines] = useState<Wine[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log('[ComparePage] Compare list:', compareList);
    const wines = compareList.map(id => getWineById(id)).filter(Boolean) as Wine[];
    setCompareWines(wines);
    const total = wines.reduce((sum, wine) => sum + wine.price, 0);
    setTotalPrice(total);
  }, [compareList]);

  useShareAppMessage(() => {
    const shareText = generateShareText(compareWines);
    return {
      title: shareText.title,
      path: '/pages/compare/index'
    };
  });

  const generateShareText = (wines: Wine[]) => {
    if (wines.length === 0) {
      return {
        title: '酒识百科 - 对比清单',
        content: '来酒识百科发现更多美酒'
      };
    }
    const total = wines.reduce((sum, w) => sum + w.price, 0);
    
    const lines = wines.map((w, i) => {
      const forPeople = w.suitableFor.slice(0, 2).join('、');
      const occasions = w.occasions.slice(0, 2).join('、');
      return `${i + 1}. ${w.name}\n   💰 ¥${w.price} / 瓶\n   👥 适合: ${forPeople}\n   🎉 场合: ${occasions}`;
    }).join('\n\n');
    
    const content = `📊 【对比清单】我的酒单对比\n\n${lines}\n\n━━━━━━━━━━━━━\n共${wines.length}款，合计 ¥${total}\n\n—— 来自「酒识百科」`;
    return {
      title: `对比${wines.length}款好酒，合计¥${total}`,
      content
    };
  };

  const handleRemove = (wineId: string) => {
    console.log('[ComparePage] Removing from compare:', wineId);
    const result = toggleCompare(wineId);
    if (result.success) {
      Taro.showToast({ title: result.message, icon: 'success' });
    }
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
    console.log('[ComparePage] Opening export modal');
    setShowExportModal(true);
  };

  const handleCopyText = () => {
    const { content } = generateShareText(compareWines);
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  };

  const handleShareText = () => {
    const { content } = generateShareText(compareWines);
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

      {showExportModal && (
        <View className={styles.exportModal} onClick={() => setShowExportModal(false)}>
          <View className={styles.exportContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.exportTitle}>
              对比清单
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

      {showCardPreview && compareWines.length > 0 && (
        <View className={styles.exportModal} onClick={() => setShowCardPreview(false)}>
          <ScrollView className={styles.cardScroll} onClick={(e) => e.stopPropagation()}>
            <View className={styles.giftCard}>
              <View className={styles.giftCardHeader}>
                <View className={styles.giftCardBadge}>
                  📊 对比清单
                </View>
                <Text className={styles.giftCardTitle}>🍷 酒款对比</Text>
                <Text className={styles.giftCardSubtitle}>来自「酒识百科」</Text>
              </View>
              
              <View className={styles.giftCardBody}>
                {compareWines.map((wine, index) => (
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
                      <View className={styles.giftCardTags}>
                        <Text className={styles.giftCardTag}>
                          👥 {wine.suitableFor.slice(0, 2).join('、')}
                        </Text>
                        <Text className={styles.giftCardTag}>
                          🎉 {wine.occasions.slice(0, 2).join('、')}
                        </Text>
                      </View>
                    </View>
                    <Text className={styles.giftCardPrice}>¥{wine.price}</Text>
                  </View>
                ))}
              </View>

              <View className={styles.giftCardFooter}>
                <View className={styles.giftCardTotal}>
                  <Text className={styles.giftCardTotalLabel}>共{compareWines.length}款 · 合计</Text>
                  <Text className={styles.giftCardTotalPrice}>¥{totalPrice}</Text>
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

export default ComparePage;
