import React from 'react';
import { Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface FlavorTagProps {
  name: string;
  active?: boolean;
  onClick?: () => void;
}

const FlavorTag: React.FC<FlavorTagProps> = ({ name, active = false, onClick }) => {
  return (
    <Button
      className={classnames(styles.flavorTag, active && styles.active)}
      onClick={onClick}
    >
      {name}
    </Button>
  );
};

export default FlavorTag;
