import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useWineStore } from '@/store/WineContext';
import { wines } from '@/data/wines';
import { budgetOptions, peopleOptions, occasionOptions } from '@/data/flavors';
import { Wine } from '@/types/wine';

const steps = [
  { key: 'budget', label: '预算' },
  { key: 'recipient', label: '对象' },
  { key: 'occasion', label: '场合' },
  { key: 'result', label: '推荐' }
];

const budgetIcons = ['💰', '💵', '💎', '👑', '🏆'];
const peopleIcons = ['🌱', '👩', '🍷', '👴', '💼'];
const occasionIcons = ['🤝', '👨‍👩‍👧', '💕', '🥂', '🎁', '😌'];

interface GiftCombo {
  id: string;
  name: string;
  badge: string;
  wines: Wine[];
  total: number;
}

interface ReplaceState {
  comboId: string;
  wineIndex: number;
  show: boolean;
}

const GiftPage: React.FC = () => {
  const { toggleFavorite, toggleCompare, isFavorite, isInCompare, compareList } = useWineStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [combos, setCombos] = useState<GiftCombo[]>([]);
  const [replaceState, setReplaceState] = useState<ReplaceState>({ comboId: '', wineIndex: -1, show: false });

  const getBudgetRange = (budgetId: string): [number, number] => {
    switch (budgetId) {
      case 'b1': return [0, 100];
      case 'b2': return [100, 300];
      case 'b3': return [300, 500];
      case 'b4': return [500, 1000];
      case 'b5': return [1000, 99999];
      default: return [0, 99999];
    }
  };

  const getOptionName = (type: string, id: string) => {
    if (type === 'budget') {
      return budgetOptions.find(o => o.id === id)?.name || '';
    }
    if (type === 'recipient') {
      return peopleOptions.find(o => o.id === id)?.name || '';
    }
    if (type === 'occasion') {
      return occasionOptions.find(o => o.id === id)?.name || '';
    }
    return '';
  };

  const candidateWines = useMemo<Wine[]>(() => {
    if (!selectedBudget) return [];
    const [minPrice, maxPrice] = getBudgetRange(selectedBudget);
    return wines.filter(wine => wine.price >= minPrice && wine.price <= maxPrice);
  }, [selectedBudget]);

  const getReplaceCandidates = (currentWineId: string): Wine[] => {
    return candidateWines.filter(w => w.id !== currentWineId && !combos.some(c => c.wines.some(wine => wine.id === w.id && w.id !== currentWineId)));
  };

  const handleGenerateRecommendations = () => {
    const [minPrice, maxPrice] = getBudgetRange(selectedBudget);
    const recipientName = getOptionName('recipient', selectedRecipient);
    const occasionName = getOptionName('occasion', selectedOccasion);

    const candidateWinesList = wines.filter(wine => {
      const priceMatch = wine.price >= minPrice && wine.price <= maxPrice;
      const recipientMatch = recipientName ? wine.suitableFor.includes(recipientName) : true;
      const occasionMatch = occasionName ? wine.occasions.includes(occasionName) : true;
      return priceMatch && recipientMatch && occasionMatch;
    });

    const newCombos: GiftCombo[] = [];

    const sortedByRating = [...candidateWinesList].sort((a, b) => b.rating - a.rating);
    if (sortedByRating.length >= 2) {
      const comboWines = sortedByRating.slice(0, 2);
      newCombos.push({
        id: 'combo1',
        name: '尊享之选',
        badge: '🎖️ 高分臻选',
        wines: comboWines,
        total: comboWines.reduce((s, w) => s + w.price, 0)
      });
    } else if (sortedByRating.length >= 1) {
      newCombos.push({
        id: 'combo1',
        name: '品质之选',
        badge: '🎖️ 高分臻选',
        wines: sortedByRating.slice(0, 1),
        total: sortedByRating[0].price
      });
    }

    const sortedByPopularity = [...candidateWinesList].sort((a, b) => {
      const scoreA = a.suitableFor.length + a.occasions.length;
      const scoreB = b.suitableFor.length + b.occasions.length;
      return scoreB - scoreA;
    });
    const usedInCombo1 = newCombos[0]?.wines.map(w => w.id) || [];
    const uniqueForCombo2 = sortedByPopularity.filter(w => !usedInCombo1.includes(w.id));
    if (uniqueForCombo2.length >= 2) {
      const comboWines = uniqueForCombo2.slice(0, 2);
      newCombos.push({
        id: 'combo2',
        name: '稳妥之选',
        badge: '⭐ 人气推荐',
        wines: comboWines,
        total: comboWines.reduce((s, w) => s + w.price, 0)
      });
    } else if (uniqueForCombo2.length >= 1) {
      newCombos.push({
        id: 'combo2',
        name: '稳妥之选',
        badge: '⭐ 人气推荐',
        wines: uniqueForCombo2.slice(0, 1),
        total: uniqueForCombo2[0].price
      });
    }

    const sortedByValue = [...candidateWinesList].sort((a, b) => (b.rating / b.price) - (a.rating / a.price));
    const usedIds = newCombos.flatMap(c => c.wines.map(w => w.id));
    const uniqueForCombo3 = sortedByValue.filter(w => !usedIds.includes(w.id));
    if (uniqueForCombo3.length >= 1) {
      const count = Math.min(2, uniqueForCombo3.length);
      const comboWines = uniqueForCombo3.slice(0, count);
      newCombos.push({
        id: 'combo3',
        name: '性价比之选',
        badge: '💡 超值推荐',
        wines: comboWines,
        total: comboWines.reduce((s, w) => s + w.price, 0)
      });
    }

    setCombos(newCombos);
    setCurrentStep(3);
  };

  const handleReplaceWine = (comboId: string, wineIndex: number) => {
    setReplaceState({ comboId, wineIndex, show: true });
  };

  const handleConfirmReplace = (newWine: Wine) => {
    setCombos(prev => prev.map(combo => {
      if (combo.id !== replaceState.comboId) return combo;
      const newWines = [...combo.wines];
      newWines[replaceState.wineIndex] = newWine;
      return {
        ...combo,
        wines: newWines,
        total: newWines.reduce((s, w) => s + w.price, 0)
      };
    }));
    setReplaceState({ comboId: '', wineIndex: -1, show: false });
    Taro.showToast({ title: '已替换', icon: 'success' });
  };

  const getComboPeopleAnalysis = (combo: GiftCombo) => {
    const peopleCount: Record<string, number> = {};
    combo.wines.forEach(wine => {
      wine.suitableFor.forEach(p => {
        peopleCount[p] = (peopleCount[p] || 0) + 1;
      });
    });
    const sorted = Object.entries(peopleCount).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / combo.wines.length) * 100)
    }));
  };

  const getComboOccasionAnalysis = (combo: GiftCombo) => {
    const occasionCount: Record<string, number> = {};
    combo.wines.forEach(wine => {
      wine.occasions.forEach(o => {
        occasionCount[o] = (occasionCount[o] || 0) + 1;
      });
    });
    const sorted = Object.entries(occasionCount).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / combo.wines.length) * 100)
    }));
  };

  const canGoNext = () => {
    if (currentStep === 0) return !!selectedBudget;
    if (currentStep === 1) return !!selectedRecipient;
    if (currentStep === 2) return !!selectedOccasion;
    return false;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleGenerateRecommendations();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedBudget('');
    setSelectedRecipient('');
    setSelectedOccasion('');
    setCombos([]);
  };

  const handleToggleFavorite = (wineId: string) => {
    const wasFav = isFavorite(wineId);
    toggleFavorite(wineId);
    Taro.showToast({
      title: wasFav ? '已取消收藏' : '已加入收藏',
      icon: 'success'
    });
  };

  const handleToggleCompare = (wineId: string) => {
    const result = toggleCompare(wineId);
    Taro.showToast({
      title: result.message,
      icon: result.success ? 'success' : 'none'
    });
  };

  const handleAddComboToFavorites = (combo: GiftCombo) => {
    let count = 0;
    combo.wines.forEach(w => {
      if (!isFavorite(w.id)) {
        toggleFavorite(w.id);
        count++;
      }
    });
    Taro.showToast({ title: count > 0 ? `已收藏${count}款` : '已全部收藏', icon: 'success' });
  };

  const handleAddComboToCompare = (combo: GiftCombo) => {
    const canAdd = 3 - compareList.length;
    if (canAdd <= 0) {
      Taro.showToast({ title: '对比清单已满（最多3款）', icon: 'none' });
      return;
    }
    const toAdd = combo.wines.filter(w => !isInCompare(w.id)).slice(0, canAdd);
    if (toAdd.length === 0) {
      Taro.showToast({ title: '已全部在对比清单', icon: 'none' });
      return;
    }
    toAdd.forEach(w => toggleCompare(w.id));
    Taro.showToast({ title: `已加入对比${toAdd.length}款`, icon: 'success' });
  };

  const getReplaceWine = () => {
    const combo = combos.find(c => c.id === replaceState.comboId);
    if (!combo) return null;
    return combo.wines[replaceState.wineIndex];
  };

  const renderProgress = () => (
    <View className={styles.progressBar}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <View className={classnames(styles.step, {
            [styles.active]: index === currentStep,
            [styles.done]: index < currentStep
          })}>
            <View className={styles.stepCircle}>
              {index < currentStep ? '✓' : index + 1}
            </View>
            <Text className={styles.stepLabel}>{step.label}</Text>
          </View>
          {index < steps.length - 1 && (
            <View className={classnames(styles.stepConnector, {
              [styles.filled]: index < currentStep
            })} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderBudgetStep = () => (
    <View className={styles.stepSection}>
      <Text className={styles.sectionTitle}>第一步：选择预算</Text>
      <Text className={styles.sectionDesc}>根据您的送礼预算，为您匹配最合适的酒款</Text>
      <View className={styles.optionGrid}>
        {budgetOptions.map((opt, index) => (
          <Button
            key={opt.id}
            className={classnames(styles.optionCard, {
              [styles.selected]: selectedBudget === opt.id
            })}
            onClick={() => setSelectedBudget(opt.id)}
          >
            <Text className={styles.optionIcon}>{budgetIcons[index] || '💰'}</Text>
            <Text className={styles.optionName}>{opt.name}</Text>
          </Button>
        ))}
      </View>
    </View>
  );

  const renderRecipientStep = () => (
    <View className={styles.stepSection}>
      <Text className={styles.sectionTitle}>第二步：选择送礼对象</Text>
      <Text className={styles.sectionDesc}>不同人群有不同的口味偏好，选对人才能选对酒</Text>
      {peopleOptions.map((opt, index) => (
        <Button
          key={opt.id}
          className={classnames(styles.singleOptionCard, {
            [styles.selected]: selectedRecipient === opt.id
          })}
          onClick={() => setSelectedRecipient(opt.id)}
        >
          <Text className={styles.optionIcon}>{peopleIcons[index] || '🎁'}</Text>
          <View className={styles.optionInfo}>
            <Text className={styles.optionName}>{opt.name}</Text>
            <Text className={styles.optionDesc}>
              {opt.id === 'p1' && '容易入口、果香浓的酒款'}
              {opt.id === 'p2' && '口感清爽、甜度适中的酒款'}
              {opt.id === 'p3' && '风味复杂、有层次感的酒款'}
              {opt.id === 'p4' && '传统经典、品质稳重的酒款'}
              {opt.id === 'p5' && '档次够高、品牌知名的酒款'}
            </Text>
          </View>
          <Text className={styles.checkIcon}>✓</Text>
        </Button>
      ))}
    </View>
  );

  const renderOccasionStep = () => (
    <View className={styles.stepSection}>
      <Text className={styles.sectionTitle}>第三步：选择送礼场合</Text>
      <Text className={styles.sectionDesc}>不同场合需要不同的酒，氛围才到位</Text>
      {occasionOptions.map((opt, index) => (
        <Button
          key={opt.id}
          className={classnames(styles.singleOptionCard, {
            [styles.selected]: selectedOccasion === opt.id
          })}
          onClick={() => setSelectedOccasion(opt.id)}
        >
          <Text className={styles.optionIcon}>{occasionIcons[index] || '🎉'}</Text>
          <View className={styles.optionInfo}>
            <Text className={styles.optionName}>{opt.name}</Text>
            <Text className={styles.optionDesc}>
              {opt.id === 'o1' && '正式商务场合，彰显品位与档次'}
              {opt.id === 'o2' && '阖家团圆，大家都喜欢的选择'}
              {opt.id === 'o3' && '浪漫温馨，营造氛围'}
              {opt.id === 'o4' && '轻松自在，朋友欢聚'}
              {opt.id === 'o5' && '节日好礼，得体大方'}
              {opt.id === 'o6' && '独饮细品，犒劳自己'}
            </Text>
          </View>
          <Text className={styles.checkIcon}>✓</Text>
        </Button>
      ))}
    </View>
  );

  const renderResult = () => {
    const replaceWine = getReplaceWine();
    const candidates = replaceWine ? getReplaceCandidates(replaceWine.id) : [];

    return (
      <View>
        <View className={styles.resultHeader}>
          <Text className={styles.resultIcon}>🎁</Text>
          <Text className={styles.resultTitle}>为您精选推荐</Text>
          <Text className={styles.resultSummary}>
            预算：<Text className={styles.highlight}>{getOptionName('budget', selectedBudget)}</Text>
            {' · '}
            对象：<Text className={styles.highlight}>{getOptionName('recipient', selectedRecipient)}</Text>
            {' · '}
            场合：<Text className={styles.highlight}>{getOptionName('occasion', selectedOccasion)}</Text>
          </Text>
        </View>

        {combos.length > 0 ? (
          combos.map((combo, comboIndex) => {
            const peopleAnalysis = getComboPeopleAnalysis(combo);
            const occasionAnalysis = getComboOccasionAnalysis(combo);
            return (
              <View key={combo.id} className={styles.comboCard}>
                <View className={styles.comboHeader}>
                  <Text className={classnames(styles.comboBadge, styles[`badge${comboIndex + 1}`])}>
                    {combo.badge}
                  </Text>
                  <Text className={styles.comboName}>{combo.name}</Text>
                </View>

                <View className={styles.comboAnalysis}>
                  <View className={styles.analysisItem}>
                    <Text className={styles.analysisLabel}>👥 人群偏向</Text>
                    <View className={styles.analysisTags}>
                      {peopleAnalysis.map(p => (
                        <Text key={p.name} className={styles.analysisTag}>
                          {p.name} {p.percent}%
                        </Text>
                      ))}
                    </View>
                  </View>
                  <View className={styles.analysisItem}>
                    <Text className={styles.analysisLabel}>🎉 场合适配</Text>
                    <View className={styles.analysisTags}>
                      {occasionAnalysis.map(o => (
                        <Text key={o.name} className={styles.analysisTag}>
                          {o.name} {o.percent}%
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>

                <View className={styles.comboWines}>
                  {combo.wines.map((wine, wineIndex) => (
                    <View key={`${combo.id}-${wine.id}`} className={styles.comboWineItem}>
                      <View className={styles.comboWineIndex}>{wineIndex + 1}</View>
                      <Image
                        className={styles.wineImage}
                        src={`https://picsum.photos/id/${wine.imageId}/100/100`}
                        mode='aspectFill'
                      />
                      <View className={styles.wineInfo}>
                        <Text className={styles.wineName}>{wine.name}</Text>
                        <Text className={styles.wineDesc}>{wine.origin} · {wine.subCategory}</Text>
                        <Text className={styles.wineFor}>
                          适合: {wine.suitableFor.slice(0, 2).join('、')}
                        </Text>
                      </View>
                      <View className={styles.winePriceWrap}>
                        <Text className={styles.winePrice}>¥{wine.price}</Text>
                        <Button
                          className={styles.replaceBtn}
                          onClick={() => handleReplaceWine(combo.id, wineIndex)}
                        >
                          🔄 换一款
                        </Button>
                      </View>
                    </View>
                  ))}
                </View>

                <View className={styles.comboFooter}>
                  <View className={styles.comboTotal}>
                    <Text className={styles.totalLabel}>共{combo.wines.length}款 · 合计</Text>
                    <Text className={styles.totalPrice}>¥{combo.total}</Text>
                  </View>
                  <View className={styles.comboActions}>
                    <Button
                      className={classnames(styles.actionBtn, styles.favBtn)}
                      onClick={() => handleAddComboToFavorites(combo)}
                    >
                      ❤️ 收藏
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.compareBtn)}
                      onClick={() => handleAddComboToCompare(combo)}
                    >
                      📊 对比
                    </Button>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🤔</Text>
            <Text className={styles.emptyText}>暂无完全匹配的酒款，试试调整筛选条件？</Text>
          </View>
        )}

        <Button className={styles.retryBtn} onClick={handleReset}>
          🔄 重新选择
        </Button>

        {replaceState.show && replaceWine && (
          <View className={styles.replaceModal} onClick={() => setReplaceState({ comboId: '', wineIndex: -1, show: false })}>
            <View className={styles.replaceContent} onClick={(e) => e.stopPropagation()}>
              <Text className={styles.replaceTitle}>替换「{replaceWine.name}」</Text>
              <Text className={styles.replaceSubtitle}>选择同价位的其他酒款</Text>
              
              <ScrollView className={styles.replaceList} scrollY>
                {candidates.length > 0 ? (
                  candidates.map(wine => (
                    <View key={wine.id} className={styles.replaceItem}>
                      <Image
                        className={styles.replaceItemImage}
                        src={`https://picsum.photos/id/${wine.imageId}/100/100`}
                        mode='aspectFill'
                      />
                      <View className={styles.replaceItemInfo}>
                        <Text className={styles.replaceItemName}>{wine.name}</Text>
                        <Text className={styles.replaceItemDesc}>{wine.origin} · {wine.subCategory}</Text>
                        <View className={styles.replaceItemTags}>
                          <Text className={styles.replaceItemTag}>⭐ {wine.rating}</Text>
                          <Text className={styles.replaceItemTag}>
                            {wine.suitableFor.slice(0, 1).join('')}
                          </Text>
                        </View>
                      </View>
                      <View className={styles.replaceItemRight}>
                        <Text className={styles.replaceItemPrice}>¥{wine.price}</Text>
                        <Button
                          className={styles.replaceItemBtn}
                          onClick={() => handleConfirmReplace(wine)}
                        >
                          替换
                        </Button>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className={styles.replaceEmpty}>
                    <Text>暂无可替换的酒款</Text>
                  </View>
                )}
              </ScrollView>

              <Button
                className={classnames(styles.replaceCancelBtn)}
                onClick={() => setReplaceState({ comboId: '', wineIndex: -1, show: false })}
              >
                取消
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBudgetStep();
      case 1: return renderRecipientStep();
      case 2: return renderOccasionStep();
      case 3: return renderResult();
      default: return null;
    }
  };

  return (
    <View className={styles.page}>
      {renderProgress()}

      <ScrollView scrollY className={styles.content}>
        {renderCurrentStep()}
      </ScrollView>

      {currentStep < 3 && (
        <View className={styles.navButtons}>
          <Button
            className={classnames(styles.navBtn, styles.prevBtn)}
            disabled={currentStep === 0}
            onClick={handlePrev}
          >
            {currentStep === 0 ? ' ' : '上一步'}
          </Button>
          <Button
            className={classnames(styles.navBtn, currentStep === 2 ? styles.submitBtn : styles.nextBtn)}
            disabled={!canGoNext()}
            onClick={handleNext}
          >
            {currentStep === 2 ? '🎁 生成推荐' : '下一步'}
          </Button>
        </View>
      )}
    </View>
  );
};

export default GiftPage;
