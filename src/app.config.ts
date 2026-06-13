export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/search/index',
    'pages/pairing/index',
    'pages/favorite/index',
    'pages/gift/index',
    'pages/detail/index',
    'pages/compare/index',
    'pages/glossary/index',
    'pages/authenticate/index',
    'pages/decant/index',
    'pages/warning/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B0000',
    navigationBarTitleText: '酒识百科',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F8F5F0'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#8B0000',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '分类'
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索'
      },
      {
        pagePath: 'pages/pairing/index',
        text: '搭配'
      },
      {
        pagePath: 'pages/favorite/index',
        text: '收藏'
      }
    ]
  }
})
