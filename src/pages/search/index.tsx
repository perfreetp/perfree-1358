import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Input, ScrollView, Button } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh, useRouter, useReachBottom } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { wines, searchWines, getWinesByCategory } from '@/data/wines';
import { categories } from '@/data/categories';
import { flavorTags, budgetOptions, sweetnessOptions, occasionOptions, foodOptions, peopleOptions } from '@/data/flavors';
import WineCard from '@/components/WineCard';
import FlavorTag from '@/components/FlavorTag';
import FilterBar from '@/components/FilterBar';
import { useWineStore } from '@/store/WineContext';
import { Wine } from '@/types/wine';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { compareList } = useWineStore();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedSweetness, setSelectedSweetness] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [displayWines, setDisplayWines] = useState<Wine[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log('[SearchPage] Mounted');
    const categoryParam = router.params.category;
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    loadWines();
  }, []);

  usePullDownRefresh(() => {
    console.log('[SearchPage] Pull down refresh');
    loadWines();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useReachBottom(() => {
    console.log('[SearchPage] Reach bottom');
    if (hasMore) {
      Taro.showToast({ title: '已加载全部', icon: 'none' });
    }
  });

  useShareAppMessage(() => {
    return {
      title: '酒识百科 - 专业酒类知识库',
      path: '/pages/search/index'
    };
  });

  useEffect(() => {
    filterWines();
  }, [keyword, selectedCategory, selectedBudgets, selectedSweetness, selectedOccasions, selectedFoods, selectedPeople, selectedFlavors]);

  const loadWines = () => {
    console.log('[SearchPage] Loading wines');
    filterWines();
  };

  const filterWines = () => {
    let result = [...wines];

    if (keyword) {
      result = searchWines(keyword);
    }

    if (selectedCategory !== 'all') {
      result = getWinesByCategory(selectedCategory);
    }

    if (selectedFlavors.length > 0) {
      result = result.filter(wine =>
        selectedFlavors.some(flavor =>
          wine.aroma.includes(flavor) || wine.taste.includes(flavor)
        )
      );
    }

    if (selectedBudgets.length > 0) {
      result = result.filter(wine => {
        return selectedBudgets.some(budget => {
          if (budget === 'b1') return wine.price < 100;
          if (budget === 'b2') return wine.price >= 100 && wine.price < 300;
          if (budget === 'b3') return wine.price >= 300 && wine.price < 500;
          if (budget === 'b4') return wine.price >= 500 && wine.price < 1000;
          if (budget === 'b5') return wine.price >= 1000;
          return true;
        });
      });
    }

    if (selectedSweetness.length > 0) {
      const sweetnessMap: Record<string, string> = {
        's1': 'dry',
        's2': 'off-dry',
        's3': 'semi-sweet',
        's4': 'sweet'
      };
      result = result.filter(wine =>
        selectedSweetness.some(s => sweetnessMap[s] === wine.sweetness)
      );
    }

    if (selectedOccasions.length > 0) {
      const occasionNames = selectedOccasions.map(id => {
        const option = occasionOptions.find(o => o.id === id);
        return option?.name || '';
      });
      result = result.filter(wine =>
        wine.occasions.some(o => occasionNames.includes(o))
      );
    }

    if (selectedFoods.length > 0) {
      const foodNames = selectedFoods.map(id => {
        const option = foodOptions.find(o => o.id === id);
        return option?.name || '';
      });
      result = result.filter(wine =>
        wine.pairingFood.some(f => foodNames.some(fn => f.includes(fn)))
      );
    }

    if (selectedPeople.length > 0) {
      const peopleNames = selectedPeople.map(id => {
        const option = peopleOptions.find(o => o.id === id);
        return option?.name || '';
      });
      result = result.filter(wine =>
        wine.suitableFor.some(p => peopleNames.some(pn => p.includes(pn)))
      );
    }

    console.log('[SearchPage] Filtered wines count:', result.length);
    setDisplayWines(result);
  };

  const handleClearSearch = () => {
    setKeyword('');
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('[SearchPage] Category clicked:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleFlavorClick = (flavorName: string) => {
    console.log('[SearchPage] Flavor clicked:', flavorName);
    setSelectedFlavors(prev =>
      prev.includes(flavorName)
        ? prev.filter(f => f !== flavorName)
        : [...prev, flavorName]
    );
  };

  const toggleFilter = (type: string, id: string) => {
    console.log('[SearchPage] Filter toggle:', type, id);
    const setters: Record<string, React.Dispatch<React.SetStateAction<string[]>>> = {
      budget: setSelectedBudgets,
      sweetness: setSelectedSweetness,
      occasion: setSelectedOccasions,
      food: setSelectedFoods,
      people: setSelectedPeople
    };
    const setter = setters[type];
    if (setter) {
      setter(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const handleCompareClick = () => {
    if (compareList.length < 2) {
      Taro.showToast({ title: '请至少选择2款酒进行对比', icon: 'none' });
      return;
    }
    console.log('[SearchPage] Navigating to compare');
    Taro.navigateTo({
      url: '/pages/compare/index'
    });
  };

  const handleResetFilters = () => {
    setSelectedBudgets([]);
    setSelectedSweetness([]);
    setSelectedOccasions([]);
    setSelectedFoods([]);
    setSelectedPeople([]);
    setSelectedFlavors([]);
    setKeyword('');
    setSelectedCategory('all');
  };

  const allCategories = [{ id: 'all', name: '全部', icon: '🍾', description: '', count: wines.length }, ...categories];
  const aromaFlavors = flavorTags.filter(f => f.type === 'aroma');

  return (
    <View className={styles.searchPage}>
      <View className={styles.header}>
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索酒款名称、风味...'
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            confirmType='search'
          />
          {keyword && (
            <Button className={styles.clearBtn} onClick={handleClearSearch}>
              ✕
            </Button>
          )}
        </View>
        <ScrollView className={styles.categoryTabs} scrollX>
          {allCategories.map(cat => (
            <Button
              key={cat.id}
              className={classnames(styles.categoryTab, selectedCategory === cat.id && styles.activeTab)}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </ScrollView>
      </View>

      <View className={styles.content}>
        <View className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <Text className={styles.filterToggleText}>
            高级筛选
            {selectedBudgets.length + selectedSweetness.length + selectedOccasions.length + selectedFoods.length + selectedPeople.length > 0 &&
              ` (已选${selectedBudgets.length + selectedSweetness.length + selectedOccasions.length + selectedFoods.length + selectedPeople.length}项)`
            }
          </Text>
          <Button className={styles.filterToggleBtn}>
            {showFilters ? '收起 ↑' : '展开 ↓'}
          </Button>
        </View>

        {showFilters && (
          <View>
            <FilterBar
              label='预算范围'
              options={budgetOptions}
              selectedIds={selectedBudgets}
              onSelect={(id) => toggleFilter('budget', id)}
            />
            <FilterBar
              label='甜度'
              options={sweetnessOptions}
              selectedIds={selectedSweetness}
              onSelect={(id) => toggleFilter('sweetness', id)}
            />
            <FilterBar
              label='适用场合'
              options={occasionOptions}
              selectedIds={selectedOccasions}
              onSelect={(id) => toggleFilter('occasion', id)}
            />
            <FilterBar
              label='搭配菜品'
              options={foodOptions}
              selectedIds={selectedFoods}
              onSelect={(id) => toggleFilter('food', id)}
            />
            <FilterBar
              label='适用人群'
              options={peopleOptions}
              selectedIds={selectedPeople}
              onSelect={(id) => toggleFilter('people', id)}
            />
            <Button
              className={styles.resetBtn}
              onClick={handleResetFilters}
              style={{ width: '100%', height: '80rpx', borderRadius: '48rpx', background: '#f5f6f7', color: '#4e5969', fontSize: '28rpx', marginBottom: '24rpx' }}
            >
              重置筛选
            </Button>
          </View>
        )}

        <View className={styles.flavorSection}>
          <Text style={{ fontSize: '30rpx', fontWeight: '500', color: '#1d2129', marginBottom: '16rpx', display: 'block' }}>
            按风味选择
          </Text>
          <ScrollView className={styles.flavorScroll} scrollX>
            <View className={styles.flavorTags}>
              {aromaFlavors.map(flavor => (
                <FlavorTag
                  key={flavor.id}
                  name={flavor.name}
                  active={selectedFlavors.includes(flavor.name)}
                  onClick={() => handleFlavorClick(flavor.name)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <Text className={styles.resultCount}>共找到 {displayWines.length} 款酒</Text>

        <View className={styles.wineList}>
          {displayWines.length > 0 ? (
            displayWines.map(wine => (
              <WineCard key={wine.id} wine={wine} showCompare />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🍷</Text>
              <Text className={styles.emptyText}>没有找到符合条件的酒款</Text>
              <Text className={styles.emptyText} style={{ fontSize: '24rpx', marginTop: '8rpx' }}>
                试试调整筛选条件吧
              </Text>
            </View>
          )}
        </View>
      </View>

      {compareList.length > 0 && (
        <View className={styles.compareFloat}>
          <Button className={styles.compareBtn} onClick={handleCompareClick}>
            <Text>对比清单</Text>
            <View className={styles.compareCount}>
              <Text>{compareList.length}</Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
