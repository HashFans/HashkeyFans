export default {
  common: {
    loading: "加载中...",
    readMore: "阅读更多",
    copySuccess: "已复制",
    applyNow: "申请参加",
    stayTuned: "敬请期待",
    eventEnded: "活动已结束",
    connectWallet: "连接钱包",
    cancel: "取消",
    optional: "可选"
  },
  nav: {
    events: "活动",
    news: "新闻",
    projects: "项目",
    activities: "活动",
    consensus: "共识大会",
    rankings: "排行榜",
    redpacket: "红包",
    card: "卡牌",
    explore: "探索",
    profile: "个人中心"
  },
  home: {
    slogan: "Web3大航海",
    description: "区块链如何融入人类文明主叙事 · 香港",
    buttonJoin: {
      text: "申请参加",
      link: "https://lu.ma/hzz6mel6"
    },
    buttonReview: {
      text: "查看链上项目",
      link: "/projects"
    }
  },
  events: {
    title: "活动列表",
    current: "进行中",
    upcoming: "即将开始",
    past: "已结束",
    comingSoon: "即将推出",
  },
  news: {
    title: "新闻中心",
    notFound: "未找到文章",
    backToNews: "返回新闻",
    readMore: "阅读更多",
  },
  projects: {
    title: "项目展示",
    loading: "加载中...",
    copySuccess: "已复制",
    points: "积分",
    extraPoints: "额外积分",
    verifiedWallet: "合作钱包",
    verifiedProject: "已验证项目",
    interactionReward: "交互奖励",
    searchPlaceholder: "搜索项目...",
    foundResults: "找到 {{count}} 个项目",
    noResults: "未找到相关项目",
  },
  partners: {
    title: "合作伙伴",
    collaborators: "合作方",
    mediaPartners: "媒体伙伴",
    interested: "有兴趣合作？",
    description: "如果您有兴趣与我们合作，我们很乐意听取您的想法！",
    apply: "申请合作"
  },
  redpacket: {
    title: "红包",
    claim: {
      button: "领取红包",
      processing: "处理中...",
      success: "领取成功",
      connect: "请先连接钱包以查看红包详情"
    },
    share: {
      button: "分享红包",
      title: "我发了一个红包",
      claimed: "领取到了",
      totalValue: "总价值",
      remaining: "还剩",
      remainingCount: "还剩 {{remaining}} / {{total}} 个红包",
      from: "来自",
      saveImage: "保存分享图片",
      close: "关闭",
      scanQR: "扫码领取红包",
      creatorInfo: "总价值 {{totalAmount}}{{unit}}，还剩 {{remaining}}{{count}}",
      remainingStatus: "还剩 {{count}}/{{total}} 个",
      noRemaining: "红包已抢完",
    },
    details: {
      title: "详情",
      totalAmount: "总金额",
      progress: "领取进度",
      myClaim: "我的领取",
      claimRecords: "领取记录",
      noRecords: "暂无领取记录",
      creatorInfo: "创建信息",
      creator: "创建者",
      remainingAmount: "剩余金额",
      loading: "加载中...",
      luckiest: "手气最佳",
      refundStatus: "退回状态",
    },
    unit: "HSK",
    count: "个",
    create: {
      title: "发红包",
      form: {
        message: "祝福语",
        messagePlaceholder: "恭喜发财，大吉大利",
        amount: "金额",
        amountPlaceholder: "输入红包总金额",
        count: "数量",
        countPlaceholder: "输入红包个数",
        submit: "发红包",
        processing: "处理中...",
        success: "发送成功"
      },
      validation: {
        messageRequired: "请输入祝福语",
        amountRequired: "请输入金额",
        amountMin: "金额必须大于 0",
        countRequired: "请输入数量",
        countMin: "数量必须大于 0",
        countInteger: "数量必须是整数"
      },
      connect: "请先连接钱包以发送红包",
      preview: "红包预览",
      success: {
        title: "创建成功!",
        amount: "红包金额",
        count: "红包个数",
        message: "祝福语",
        view: "查看红包"
      }
    },
    history: {
      title: "红包记录",
      created: "我发出的",
      received: "我收到的",
      empty: "暂无记录",
      loading: "加载中...",
      connect: "请先连接钱包以查看红包记录",
      amount: "金额",
      count: "个数",
      date: "时间",
      status: {
        active: "进行中",
        completed: "已领完"
      }
    },
    refund: {
      button: "退回红包",
      processing: "退回中...",
      success: "退回成功"
    },
    status: {
      refunded: "红包已退回",
    }
  },
  lottery: {
    title: '幸运抽奖',
    description: '创建精彩的抽奖活动或查看历史记录',
    create_card_title: '发起新抽奖',
    create_card_desc: '创建一个新的抽奖活动，自定义奖励',
    history_card_title: '抽奖历史',
    history_card_desc: '查看所有历史抽奖活动及获奖者',
    create: '发起抽奖',
    history: '查看历史',
    history_title: '抽奖历史',
    no_history: '暂无抽奖记录',
    connect_wallet_tip: '请先连接钱包以发起抽奖',
    create_modal: {
      title: '创建抽奖',
      event_title: '活动标题',
      event_title_placeholder: '请输入活动标题',
      description: '活动描述',
      description_placeholder: '请输入活动描述',
      image: '背景图片',
      image_placeholder: '请输入图片链接',
      prizes: '奖品设置',
      add_prize: '添加奖品',
      prize_name_placeholder: '请输入奖品名称',
      create: '创建抽奖'
    },
    not_found: '抽奖未找到',
    not_found_desc: '您查找的抽奖不存在或已被删除',
    created_by: '创建者',
    prizes: '奖品',
    amount: '数量',
    share: '分享',
  }
} 