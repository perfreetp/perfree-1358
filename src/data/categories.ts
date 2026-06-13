import { Category } from '@/types/wine';

export const categories: Category[] = [
  {
    id: 'wine',
    name: '葡萄酒',
    icon: '🍷',
    description: '红葡萄酒、白葡萄酒、桃红、起泡酒',
    count: 45
  },
  {
    id: 'whisky',
    name: '威士忌',
    icon: '🥃',
    description: '苏格兰、日本、波本、黑麦',
    count: 32
  },
  {
    id: 'baijiu',
    name: '白酒',
    icon: '🍶',
    description: '酱香、浓香、清香、凤香',
    count: 28
  },
  {
    id: 'beer',
    name: '啤酒',
    icon: '🍺',
    description: '精酿、IPA、世涛、小麦啤',
    count: 36
  },
  {
    id: 'spirit',
    name: '洋酒',
    icon: '🥂',
    description: '白兰地、伏特加、金酒、朗姆',
    count: 24
  },
  {
    id: 'sake',
    name: '清酒',
    icon: '🏮',
    description: '纯米大吟酿、本酿造、浊酒',
    count: 18
  }
];
