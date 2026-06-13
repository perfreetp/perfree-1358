import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { FilterOption } from '@/types/wine';

interface FilterBarProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onSelect: (id: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ label, options, selectedIds, onSelect }) => {
  return (
    <View className={styles.filterBar}>
      <View className={styles.filterRow}>
        <Text className={styles.filterLabel}>{label}</Text>
        <View className={styles.filterOptions}>
          {options.map(option => (
            <Button
              key={option.id}
              className={classnames(
                styles.filterOption,
                selectedIds.includes(option.id) && styles.active
              )}
              onClick={() => onSelect(option.id)}
            >
              {option.name}
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FilterBar;
