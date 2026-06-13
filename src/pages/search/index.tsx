import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Input, ScrollView, Button } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh, useRouter, useReachBottom, useDidShow } from '@tarojs/taro';
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
  const { compareList, searchFilters, setSearchFilters, resetSearchFilters } = useWineStore();

  const [keyword, setKeyword] = useState(searchFilters.keyword);
  const [selectedCategory, setSelectedCategory] = useState(searchFilters.category);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>(searchFilters.budgets);
  const [selectedSweetness, setSelectedSweetness] = useState<string[]>(searchFilters.sweetness);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(searchFilters.occasions);
  const [selectedFoods, setSelectedFoods] = useState<string[]>(searchFilters.foods);
  const [selectedPeople, setSelectedPeople] = useState<string[]>(searchFilters.people);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(searchFilters.flavors);
  const [selectedTasteTags, setSelectedTasteTags] = useState<string[]>(searchFilters.tasteTags);
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>(searchFilters.styleTags);
  const [displayWines, setDisplayWines] = useState<Wine[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [activeFlavorTab, setActiveFlavorTab] = useState<'aroma' | 'taste' | 'style'>('aroma');

  useDidShow(() => {
    console.log('[SearchPage] useDidShow, filters from store:', searchFilters);
    setKeyword(searchFilters.keyword);
    setSelectedCategory(searchFilters.category);
    setSelectedBudgets(searchFilters.budgets);
    setSelectedSweetness(searchFilters.sweetness);
    setSelectedOccasions(searchFilters.occasions);
    setSelectedFoods(searchFilters.foods);
    setSelectedPeople(searchFilters.people);
    setSelectedFlavors(searchFilters.flavors);
    setSelectedTasteTags(searchFilters.tasteTags);
    setSelectedStyleTags(searchFilters.styleTags);
  });

  useEffect(() => {
    console.log('[SearchPage] Mounted');
    filterWines();
  }, []);

  usePullDownRefresh(() => {
    console.log('[SearchPage] Pull down refresh');
    filterWines();
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

  const persistFilters = () => {
    setSearchFilters({
      keyword,
      category: selectedCategory,
      budgets: selectedBudgets,
      sweetness: selectedSweetness,
      occasions: selectedOccasions,
      foods: selectedFoods,
      people: selectedPeople,
      flavors: selectedFlavors,
      tasteTags: selectedTasteTags,
      styleTags: selectedStyleTags
    });
  };

  useEffect(() => {
    filterWines();
    persistFilters();
  }, [keyword, selectedCategory, selectedBudgets, selectedSweetness, selectedOccasions, selectedFoods, selectedPeople, selectedFlavors, selectedTasteTags, selectedStyleTags]);

  const getActiveFilterCount = () => {
    return selectedBudgets.length + selectedSweetness.length + selectedOccasions.length + 
           selectedFoods.length + selectedPeople.length + selectedFlavors.length + 
           selectedTasteTags.length + selectedStyleTags.length + 
           (keyword ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0);
  };

  const getActiveFilterLabels = () => {
    const labels: { type: string; value: string; label: string }[] = [];
    
    if (keyword) {
      labels.push({ type: 'keyword', value: keyword, label: `关键词: ${keyword}` });
    }
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.id === selectedCategory);
      if (cat) labels.push({ type: 'category', value: selectedCategory, label: cat.name });
    }
    selectedBudgets.forEach(id => {
      const opt = budgetOptions.find(o => o.id === id);
      if (opt) labels.push({ type: 'budget', value: id, label: opt.name });
    });
    selectedSweetness.forEach(id => {
      const opt = sweetnessOptions.find(o => o.id === id);
      if (opt) labels.push({ type: 'sweetness', value: id, label: opt.name });
    });
    selectedOccasions.forEach(id => {
      const opt = occasionOptions.find(o => o.id === id);
      if (opt) labels.push({ type: 'occasion', value: id, label: opt.name });
    });
    selectedFoods.forEach(id => {
      const opt = foodOptions.find(o => o.id === id);
      if (opt) labels.push({ type: 'food', value: id, label: opt.name });
    });
    selectedPeople.forEach(id => {
      const opt = peopleOptions.find(o => o.id === id);
      if (opt) labels.push({ type: 'people', value: id, label: opt.name });
    });
    selectedFlavors.forEach(f => {
      labels.push({ type: 'flavor', value: f, label: f });
    });
    selectedTasteTags.forEach(f => {
      labels.push({ type: 'taste', value: f, label: f });
    });
    selectedStyleTags.forEach(f => {
      labels.push({ type: 'style', value: f, label: f });
    });
    
    return labels;
  };

  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case 'keyword':
        setKeyword('');
        break;
      case 'category':
        setSelectedCategory('all');
        break;
      case 'budget':
        setSelectedBudgets(prev => prev.filter(id => id !== value));
        break;
      case 'sweetness':
        setSelectedSweetness(prev => prev.filter(id => id !== value));
        break;
      case 'occasion':
        setSelectedOccasions(prev => prev.filter(id => id !== value));
        break;
      case 'food':
        setSelectedFoods(prev => prev.filter(id => id !== value));
        break;
      case 'people':
        setSelectedPeople(prev => prev.filter(id => id !== value));
        break;
      case 'flavor':
        setSelectedFlavors(prev => prev.filter(f => f !== value));
        break;
      case 'taste':
        setSelectedTasteTags(prev => prev.filter(f => f !== value));
        break;
      case 'style':
        setSelectedStyleTags(prev => prev.filter(f => f !== value));
        break;
    }
  };

  const filterWines = () => {
    let result = [...wines];

    if (keyword) {
      result = searchWines(keyword);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(wine => wine.category === selectedCategory);
    }

    const allFlavorTags = [...selectedFlavors, ...selectedTasteTags, ...selectedStyleTags];
    if (allFlavorTags.length > 0) {
      result = result.filter(wine =>
        allFlavorTags.some(flavor =>
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

  const handleFlavorClick = (flavorName: string, type: 'aroma' | 'taste' | 'style') => {
    console.log('[SearchPage] Flavor clicked:', flavorName, type);
    if (type === 'aroma') {
      setSelectedFlavors(prev =>
        prev.includes(flavorName)
          ? prev.filter(f => f !== flavorName)
          : [...prev, flavorName]
      );
    } else if (type === 'taste') {
      setSelectedTasteTags(prev =>
        prev.includes(flavorName)
          ? prev.filter(f => f !== flavorName)
          : [...prev, flavorName]
      );
    } else {
      setSelectedStyleTags(prev =>
        prev.includes(flavorName)
          ? prev.filter(f => f !== flavorName)
          : [...prev, flavorName]
      );
    }
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
    resetSearchFilters();
    setKeyword('');
    setSelectedCategory('all');
    setSelectedBudgets([]);
    setSelectedSweetness([]);
    setSelectedOccasions([]);
    setSelectedFoods([]);
    setSelectedPeople([]);
    setSelectedFlavors([]);
    setSelectedTasteTags([]);
    setSelectedStyleTags([]);
  };

  const allCategories = [{ id: 'all', name: '全部', icon: '🍾', description: '', count: wines.length }, ...categories];
  const aromaFlavors = flavorTags.filter(f => f.type === 'aroma');
  const tasteFlavors = flavorTags.filter(f => f.type === 'taste');
  const styleFlavors = flavorTags.filter(f => f.type === 'style');
  const activeFilterLabels = getActiveFilterLabels();

  const getCurrentFlavorList = () => {
    if (activeFlavorTab === 'aroma') return aromaFlavors;
    if (activeFlavorTab === 'taste') return tasteFlavors;
    return styleFlavors;
  };

  const isFlavorSelected = (name: string) => {
    if (activeFlavorTab === 'aroma') return selectedFlavors.includes(name);
    if (activeFlavorTab === 'taste') return selectedTasteTags.includes(name);
    return selectedStyleTags.includes(name);
  };

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
        {activeFilterLabels.length > 0 && (
          <View className={styles.activeFilters}>
            <View className={styles.activeFiltersHeader}>
              <Text className={styles.activeFiltersTitle}>已选筛选 ({activeFilterLabels.length})</Text>
              <Button className={styles.clearAllBtn} onClick={handleResetFilters}>
                清空全部
              </Button>
            </View>
            <View className={styles.activeFiltersTags}>
              {activeFilterLabels.map((filter, index) => (
                <View key={index} className={styles.activeFilterTag}>
                  <Text className={styles.activeFilterText}>{filter.label}</Text>
                  <Text className={styles.activeFilterClose} onClick={() => handleRemoveFilter(filter.type, filter.value)}>
                    ✕
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <Text className={styles.filterToggleText}>
            高级筛选
            {getActiveFilterCount() > 0 &&
              ` (已选${getActiveFilterCount()}项)`
            }
          </Text>
          <Button className={styles.filterToggleBtn}>
            {showFilters ? '收起 ↑' : '展开 ↓'}
          </Button>
        </View>

        {showFilters && (
          <View className={styles.advancedFilters}>
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
            >
              重置筛选
            </Button>
          </View>
        )}

        <View className={styles.flavorSection}>
          <View className={styles.flavorTabs}>
            <Button
              className={classnames(styles.flavorTab, activeFlavorTab === 'aroma' && styles.activeFlavorTab)}
              onClick={() => setActiveFlavorTab('aroma')}
            >
              香气
            </Button>
            <Button
              className={classnames(styles.flavorTab, activeFlavorTab === 'taste' && styles.activeFlavorTab)}
              onClick={() => setActiveFlavorTab('taste')}
            >
              口感
            </Button>
            <Button
              className={classnames(styles.flavorTab, activeFlavorTab === 'style' && styles.activeFlavorTab)}
              onClick={() => setActiveFlavorTab('style')}
            >
              风格
            </Button>
          </View>
          <ScrollView className={styles.flavorScroll} scrollX>
            <View className={styles.flavorTags}>
              {getCurrentFlavorList().map(flavor => (
                <FlavorTag
                  key={flavor.id}
                  name={flavor.name}
                  active={isFlavorSelected(flavor.name)}
                  onClick={() => handleFlavorClick(flavor.name, activeFlavorTab)}
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
              <Text className={styles.emptySubText}>
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
