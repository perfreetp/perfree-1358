import Taro from '@tarojs/taro';

const STORAGE_KEYS = {
  FAVORITES: 'wine_favorites',
  RATING_NOTES: 'wine_rating_notes',
  COMPARE_LIST: 'wine_compare_list'
};

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    if (data === '' || data === null || data === undefined) {
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('[Storage] getStorage error:', error);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (error) {
    console.error('[Storage] setStorage error:', error);
  }
};

export const removeStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key);
  } catch (error) {
    console.error('[Storage] removeStorage error:', error);
  }
};

export { STORAGE_KEYS };
