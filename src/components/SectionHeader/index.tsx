import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onAction }) => {
  return (
    <View className={styles.sectionHeader}>
      <Text className={styles.title}>{title}</Text>
      {actionText && onAction && (
        <Button className={styles.action} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default SectionHeader;
