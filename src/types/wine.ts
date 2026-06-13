export interface Wine {
  id: string;
  name: string;
  nameEn: string;
  category: WineCategory;
  subCategory: string;
  origin: string;
  region: string;
  abv: number;
  price: number;
  priceRange: PriceRange;
  sweetness: Sweetness;
  aroma: string[];
  taste: string[];
  servingTemp: string;
  glassType: string;
  vintage?: number;
  capacity?: string;
  description: string;
  flavorProfile: string;
  pairingFood: string[];
  occasions: string[];
  suitableFor: string[];
  rating: number;
  imageId: number;
  authenticityTips: string[];
  decantTime?: string;
  warnings: string[];
}

export type WineCategory = 'wine' | 'whisky' | 'baijiu' | 'beer' | 'spirit' | 'sake';

export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury';

export type Sweetness = 'dry' | 'off-dry' | 'semi-sweet' | 'sweet';

export interface Category {
  id: WineCategory;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface FlavorTag {
  id: string;
  name: string;
  type: 'aroma' | 'taste' | 'style';
}

export interface FilterOption {
  id: string;
  name: string;
  type: 'budget' | 'sweetness' | 'occasion' | 'food' | 'people';
}

export interface PairingGuide {
  id: string;
  title: string;
  description: string;
  food: string;
  wineCategories: WineCategory[];
  wineRecommendations: string[];
  imageId: number;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'glossary' | 'authenticate' | 'decant' | 'warning';
}

export interface RatingNote {
  wineId: string;
  rating: number;
  note: string;
  createdAt: string;
}

export interface SearchFilters {
  keyword: string;
  category: string;
  budgets: string[];
  sweetness: string[];
  occasions: string[];
  foods: string[];
  people: string[];
  flavors: string[];
  tasteTags: string[];
  styleTags: string[];
}

export interface GiftFilters {
  budget?: string;
  recipient?: string;
  occasion?: string;
}

export interface WineStore {
  favorites: string[];
  ratingNotes: RatingNote[];
  compareList: string[];
  searchFilters: SearchFilters;
  toggleFavorite: (wineId: string) => void;
  isFavorite: (wineId: string) => boolean;
  addRating: (note: RatingNote) => void;
  getRating: (wineId: string) => RatingNote | undefined;
  toggleCompare: (wineId: string) => void;
  isInCompare: (wineId: string) => boolean;
  clearCompare: () => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
  setQuickFilter: (type: string, value: string) => void;
}
