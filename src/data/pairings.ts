import { PairingGuide } from '@/types/wine';

export const pairingGuides: PairingGuide[] = [
  {
    id: 'pg01',
    title: '牛排红肉搭配',
    description: '浓郁的红酒能够平衡红肉的油腻感，单宁可以柔化肉质',
    food: '牛排红肉',
    wineCategories: ['wine'],
    wineRecommendations: ['w001', 'w002'],
    imageId: 292
  },
  {
    id: 'pg02',
    title: '海鲜鱼类搭配',
    description: '清爽的白葡萄酒和起泡酒能够带出海鲜的鲜美',
    food: '海鲜鱼类',
    wineCategories: ['wine', 'sake'],
    wineRecommendations: ['w003', 'w011'],
    imageId: 312
  },
  {
    id: 'pg03',
    title: '川菜火锅搭配',
    description: '高度白酒能够中和麻辣，清爽啤酒可以解辣降温',
    food: '火锅川菜',
    wineCategories: ['baijiu', 'beer'],
    wineRecommendations: ['w006', 'w008'],
    imageId: 431
  },
  {
    id: 'pg04',
    title: '日料刺身搭配',
    description: '清酒的细腻和威士忌的圆润能够完美搭配日料',
    food: '日料刺身',
    wineCategories: ['sake', 'whisky'],
    wineRecommendations: ['w011', 'w004'],
    imageId: 401
  },
  {
    id: 'pg05',
    title: '烧烤派对搭配',
    description: '啤酒和IPA的苦度能够平衡烤肉的油脂感',
    food: '烧烤',
    wineCategories: ['beer', 'whisky'],
    wineRecommendations: ['w009', 'w005'],
    imageId: 570
  },
  {
    id: 'pg06',
    title: '甜点蛋糕搭配',
    description: '甜酒的甜度能够与甜点相得益彰，避免口感发苦',
    food: '甜点蛋糕',
    wineCategories: ['wine', 'spirit'],
    wineRecommendations: ['w010', 'w003'],
    imageId: 625
  }
];

export const occasionGuides = [
  {
    id: 'og01',
    title: '商务宴请',
    description: '选择知名度高、品质有保障的酒款，彰显品位与诚意',
    tips: ['红酒推荐波尔多列级庄', '白酒推荐茅台、五粮液', '威士忌推荐山崎、麦卡伦'],
    wineRecommendations: ['w001', 'w006', 'w004']
  },
  {
    id: 'og02',
    title: '浪漫约会',
    description: '选择口感柔顺、香气优雅的酒款，营造浪漫氛围',
    tips: ['推荐起泡酒和桃红葡萄酒', '避免过于浓郁的酒款', '注意对方的口味偏好'],
    wineRecommendations: ['w003', 'w011']
  },
  {
    id: 'og03',
    title: '家庭聚会',
    description: '选择大众易饮、性价比高的酒款，兼顾不同口味',
    tips: ['准备多种品类供选择', '啤酒和葡萄酒最安全', '注意长辈的饮酒习惯'],
    wineRecommendations: ['w002', 'w008', 'w007']
  },
  {
    id: 'og04',
    title: '节日送礼',
    description: '包装精美、品牌知名的酒款是送礼佳品',
    tips: ['白酒送长辈首选茅台、五粮液', '红酒送领导推荐名庄酒', '送年轻人可选精酿或网红酒'],
    wineRecommendations: ['w006', 'w001', 'w010']
  }
];

export const giftGuides = [
  {
    id: 'gg01',
    target: '长辈送礼',
    budget: '500-2000元',
    recommendations: [
      { wineId: 'w006', reason: '茅台品牌响亮，长辈认可度高' },
      { wineId: 'w007', reason: '五粮液浓香型，口感醇厚适合长辈' },
      { wineId: 'w010', reason: '轩尼诗XO高端大气，档次感十足' }
    ]
  },
  {
    id: 'gg02',
    target: '商务伙伴',
    budget: '1000-5000元',
    recommendations: [
      { wineId: 'w001', reason: '拉菲古堡顶级名庄，彰显身份' },
      { wineId: 'w004', reason: '山崎12年品质出众，日威热门' },
      { wineId: 'w006', reason: '飞天茅台硬通货，人人喜欢' }
    ]
  },
  {
    id: 'gg03',
    target: '女性朋友',
    budget: '200-800元',
    recommendations: [
      { wineId: 'w003', reason: '长相思清爽易饮，果香浓郁' },
      { wineId: 'w008', reason: '福佳白果香清新，颜值高' },
      { wineId: 'w011', reason: '獭祭清酒优雅细腻，口感纯净' }
    ]
  }
];
