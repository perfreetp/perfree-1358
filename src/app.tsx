import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { WineProvider } from '@/store/WineContext';
import './app.scss';

function App(props) {
  useEffect(() => {});

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <WineProvider>
      {props.children}
    </WineProvider>
  );
}

export default App;
