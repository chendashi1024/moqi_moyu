import { HotlistItem } from '../types'

// 生成模拟热榜数据的函数
const generateMockData = (): HotlistItem[] => {
  const platforms = [
    {
      id: 'zhihu',
      name: '知乎热榜',
      baseUrl: 'https://www.zhihu.com/question/',
      titles: [
        '如何看待当前的就业形势？',
        '程序员如何提升自己的技术能力？',
        '2024年最值得学习的编程语言是什么？',
        '如何在工作中保持学习的动力？',
        '互联网行业的发展前景如何？',
        '如何平衡工作与生活？',
        '新手程序员应该如何规划职业发展？',
        '人工智能会取代程序员吗？',
        '如何提高代码质量？',
        '远程工作的利弊分析',
        '如何选择适合自己的技术栈？',
        '开源项目对程序员的重要性',
        '如何应对技术更新换代？',
        '程序员如何建立个人品牌？',
        '技术面试的准备策略',
        '如何处理工作中的技术债务？',
        '敏捷开发的实践经验',
        '如何与产品经理有效沟通？',
        '代码审查的最佳实践',
        '如何选择合适的开发工具？'
      ]
    },
    {
      id: 'weibo',
      name: '微博热搜',
      baseUrl: 'https://s.weibo.com/weibo?q=',
      titles: [
        '春节档电影票房创新高',
        '新能源汽车销量突破预期',
        '人工智能技术新突破',
        '北京冬奥会精彩瞬间回顾',
        '全国多地迎来降雪天气',
        '科技企业发布年度财报',
        '教育部发布新政策',
        '环保新举措获得好评',
        '文化旅游市场持续升温',
        '健康生活方式受到关注',
        '数字经济发展迅速',
        '城市建设取得新进展',
        '医疗技术不断创新',
        '体育赛事精彩纷呈',
        '艺术展览吸引观众',
        '科学研究获得突破',
        '社会公益活动增多',
        '国际合作不断深化',
        '青年创业热情高涨',
        '传统文化传承发展'
      ]
    },
    {
      id: 'bilibili',
      name: 'B站热榜',
      baseUrl: 'https://www.bilibili.com/video/BV',
      titles: [
        '【技术分享】React 18新特性详解',
        '【游戏解说】最新游戏评测',
        '【科普】量子计算机工作原理',
        '【编程教程】Python入门指南',
        '【数码评测】最新手机深度体验',
        '【动画推荐】本季度必看番剧',
        '【音乐分享】治愈系BGM合集',
        '【美食制作】家常菜制作技巧',
        '【旅行vlog】城市探索之旅',
        '【学习方法】高效学习技巧分享',
        '【科技前沿】AI发展现状分析',
        '【历史解说】古代文明探秘',
        '【艺术欣赏】名画背后的故事',
        '【健身指导】居家锻炼方案',
        '【摄影技巧】风景摄影入门',
        '【读书分享】经典文学解读',
        '【手工制作】创意DIY教程',
        '【语言学习】英语口语练习',
        '【投资理财】理财知识科普',
        '【心理健康】压力管理方法'
      ]
    },
    {
      id: 'douyin',
      name: '抖音热榜',
      baseUrl: 'https://www.douyin.com/video/',
      titles: [
        '春节回家路上的温暖瞬间',
        '职场新人必备技能分享',
        '美食制作简单易学',
        '宠物搞笑日常合集',
        '城市夜景拍摄技巧',
        '健身达人分享经验',
        '时尚穿搭灵感推荐',
        '亲子互动游戏大全',
        '居家收纳整理妙招',
        '学习效率提升方法',
        '创意手工制作教程',
        '旅行攻略实用分享',
        '音乐才艺展示平台',
        '科普知识趣味讲解',
        '情感故事真实分享',
        '生活小窍门实用技巧',
        '舞蹈教学基础入门',
        '美妆护肤心得体会',
        '汽车知识科普解析',
        '园艺种植经验分享'
      ]
    },
    {
      id: 'baidu',
      name: '百度热搜',
      baseUrl: 'https://www.baidu.com/s?wd=',
      titles: [
        '2024年经济发展趋势分析',
        '健康生活方式指南',
        '教育改革最新动态',
        '环境保护政策解读',
        '科技创新成果展示',
        '文化产业发展现状',
        '医疗健康服务升级',
        '交通出行便民措施',
        '住房政策调整影响',
        '就业市场变化趋势',
        '消费升级新特点',
        '数字化转型进程',
        '绿色发展理念推广',
        '社会保障体系完善',
        '国际贸易合作机遇',
        '创新创业政策支持',
        '城乡发展一体化',
        '公共服务均等化',
        '法治建设新进展',
        '民生改善新举措'
      ]
    },
    {
      id: 'toutiao',
      name: '头条热榜',
      baseUrl: 'https://www.toutiao.com/article/',
      titles: [
        '科技创新推动产业升级',
        '教育改革新政策解读',
        '医疗技术突破性进展',
        '环保行动取得显著成效',
        '文化传承与创新发展',
        '体育事业蓬勃发展',
        '旅游业复苏势头强劲',
        '农业现代化步伐加快',
        '制造业转型升级加速',
        '服务业创新模式涌现',
        '金融科技应用广泛',
        '能源结构优化调整',
        '交通基础设施完善',
        '信息技术深度融合',
        '生态文明建设推进',
        '社会治理创新实践',
        '国际交流合作深化',
        '人才培养体系优化',
        '创新驱动发展战略',
        '高质量发展新成就'
      ]
    }
  ]

  const items: HotlistItem[] = []
  
  platforms.forEach(platform => {
    platform.titles.forEach((title, index) => {
      // 生成真实的URL ID
      const urlId = Math.random().toString(36).substr(2, 10)
      let url = ''
      
      switch (platform.id) {
        case 'zhihu':
          url = `${platform.baseUrl}${600000000 + index}`
          break
        case 'weibo':
          url = `${platform.baseUrl}${encodeURIComponent(title)}`
          break
        case 'bilibili':
          url = `${platform.baseUrl}1${urlId}`
          break
        case 'douyin':
          url = `${platform.baseUrl}${Date.now() + index}`
          break
        case 'baidu':
          url = `${platform.baseUrl}${encodeURIComponent(title)}`
          break
        case 'toutiao':
          url = `${platform.baseUrl}${Date.now() + index}`
          break
        default:
          url = `${platform.baseUrl}${urlId}`
      }
      
      items.push({
        id: `${platform.id}-${index + 1}`,
        title,
        url,
        hot: Math.floor(Math.random() * 100000) + 10000,
        platform: platform.id,
        platformName: platform.name,
      })
    })
  })
  
  return items
}

// 模拟热榜数据
export const MOCK_HOTLIST_DATA: HotlistItem[] = generateMockData()

// 根据平台ID获取模拟数据
export const getMockDataByPlatform = (platformId: string): HotlistItem[] => {
  return MOCK_HOTLIST_DATA.filter(item => item.platform === platformId)
}

// 获取所有模拟数据
export const getAllMockData = (): HotlistItem[] => {
  return MOCK_HOTLIST_DATA
}