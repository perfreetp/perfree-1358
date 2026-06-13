import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WineStore, RatingNote } from '@/types/wine';
import { getStorage, setStorage, STORAGE_KEYS } from '@/utils/storage';

const WineContext = createContext<WineStore | undefined>(undefined);

export const WineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() =>
    getStorage<string[]>(STORAGE_KEYS.FAVORITES, [])
  );
  const [ratingNotes, setRatingNotes] = useState<RatingNote[]>(() =>
    getStorage<RatingNote[]>(STORAGE_KEYS.RATING_NOTES, [])
  );
  const [compareList, setCompareList] = useState<string[]>(() =>
    getStorage<string[]>(STORAGE_KEYS.COMPARE_LIST, [])
  );

  useEffect(() => {
    setStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.RATING_NOTES, ratingNotes);
  }, [ratingNotes]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.COMPARE_LIST, compareList);
  }, [compareList]);

  const toggleFavorite = (wineId: string) => {
    setFavorites(prev => {
      if (prev.includes(wineId)) {
        return prev.filter(id => id !== wineId);
      }
      return [...prev, wineId];
    });
  };

  const isFavorite = (wineId: string) => {
    return favorites.includes(wineId);
  };

  const addRating = (note: RatingNote) => {
    setRatingNotes(prev => {
      const existingIndex = prev.findIndex(n => n.wineId === note.wineId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = note;
        return updated;
      }
      return [...prev, note];
    });
  };

  const getRating = (wineId: string) => {
    return ratingNotes.find(n => n.wineId === wineId);
  };

  const toggleCompare = (wineId: string) => {
    setCompareList(prev => {
      if (prev.includes(wineId)) {
        return prev.filter(id => id !== wineId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, wineId];
    });
  };

  const isInCompare = (wineId: string) => {
    return compareList.includes(wineId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const value: WineStore = {
    favorites,
    ratingNotes,
    compareList,
    toggleFavorite,
    isFavorite,
    addRating,
    getRating,
    toggleCompare,
    isInCompare,
    clearCompare
  };

  return (
    <WineContext.Provider value={value}>
      {children}
    </WineContext.Provider>
  );
};

export const useWineStore = () => {
  const context = useContext(WineContext);
  if (!context) {
    throw new Error('useWineStore must be used within a WineProvider');
  }
  return context;
};
