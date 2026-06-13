import { FlavorTag, FilterOption } from '@/types/wine';

export const flavorTags: FlavorTag[] = [
  { id: 'f1', name: '果香', type: 'aroma' },
  { id: 'f2', name: '花香', type: 'aroma' },
  { id: 'f3', name: '橡木香', type: 'aroma' },
  { id: 'f4', name: '烟熏', type: 'aroma' },
  { id: 'f5', name: '蜂蜜', type: 'aroma' },
  { id: 'f6', name: '香草', type: 'aroma' },
  { id: 'f7', name: '焦糖', type: 'aroma' },
  { id: 'f8', name: '坚果', type: 'aroma' },
  { id: 'f9', name: '巧克力', type: 'aroma' },
  { id: 'f10', name: '柑橘', type: 'aroma' },
  { id: 'f11', name: '单宁', type: 'taste' },
  { id: 'f12', name: '酸度', type: 'taste' },
  { id: 'f13', name: '醇厚', type: 'taste' },
  { id: 'f14', name: '清爽', type: 'taste' },
  { id: 'f15', name: '圆润', type: 'taste' },
  { id: 'f16', name: '辛辣', type: 'taste' },
  { id: 'f17', name: '苦涩', type: 'taste' },
  { id: 'f18', name: '回甘', type: 'taste' },
  { id: 'f19', name: '优雅', type: 'style' },
  { id: 'f20', name: '浓郁', type: 'style' },
  { id: 'f21', name: '清新', type: 'style' },
  { id: 'f22', name: '复杂', type: 'style' },
  { id: 'f23', name: '柔顺', type: 'style' },
  { id: 'f24', name: '平衡', type: 'style' }
];

export const budgetOptions: FilterOption[] = [
  { id: 'b1', name: '¥100以下', type: 'budget' },
  { id: 'b2', name: '¥100-300', type: 'budget' },
  { id: 'b3', name: '¥300-500', type: 'budget' },
  { id: 'b4', name: '¥500-1000', type: 'budget' },
  { id: 'b5', name: '¥1000以上', type: 'budget' }
];

export const sweetnessOptions: FilterOption[] = [
  { id: 's1', name: '干型', type: 'sweetness' },
  { id: 's2', name: '半干', type: 'sweetness' },
  { id: 's3', name: '半甜', type: 'sweetness' },
  { id: 's4', name: '甜型', type: 'sweetness' }
];

export const occasionOptions: FilterOption[] = [
  { id: 'o1', name: '商务宴请', type: 'occasion' },
  { id: 'o2', name: '家庭聚会', type: 'occasion' },
  { id: 'o3', name: '浪漫约会', type: 'occasion' },
  { id: 'o4', name: '朋友小酌', type: 'occasion' },
  { id: 'o5', name: '节日送礼', type: 'occasion' },
  { id: 'o6', name: '独饮品鉴', type: 'occasion' }
];

export const foodOptions: FilterOption[] = [
  { id: 'fd1', name: '牛排红肉', type: 'food' },
  { id: 'fd2', name: '海鲜鱼类', type: 'food' },
  { id: 'fd3', name: '中餐家常菜', type: 'food' },
  { id: 'fd4', name: '烧烤', type: 'food' },
  { id: 'fd5', name: '火锅', type: 'food' },
  { id: 'fd6', name: '日料刺身', type: 'food' },
  { id: 'fd7', name: '甜点蛋糕', type: 'food' },
  { id: 'fd8', name: '芝士奶酪', type: 'food' }
];

export const peopleOptions: FilterOption[] = [
  { id: 'p1', name: '新手入门', type: 'people' },
  { id: 'p2', name: '女性偏好', type: 'people' },
  { id: 'p3', name: '资深酒友', type: 'people' },
  { id: 'p4', name: '长辈送礼', type: 'people' },
  { id: 'p5', name: '商务伙伴', type: 'people' }
];
