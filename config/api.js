// const ApiRootUrl = 'http://127.0.0.1:8778/';
const ApiRootUrl = 'https://www.jly2020.com/api/';

module.exports = { 
  fileRootUrl: 'http://file.jly2020.com/',
  UserInfoUpdate: ApiRootUrl + 'customer/v1/save-or-update',
  Code2Session: ApiRootUrl + 'wechat/v1/login', //首页数据接口
  
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口
  CatalogList: ApiRootUrl + 'catalog/index',  //分类目录全部分类数据接口
  CatalogCurrent: ApiRootUrl + 'catalog/current',  //分类目录当前分类数据接口
  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录

  CategoriesParent: ApiRootUrl + 'category/f/v1/parent-list', // 父级分类
  CategoriesChild: ApiRootUrl + 'category/f/v1/child-list',  // 子集分类
  CategoriesSameLevel: ApiRootUrl + 'category/f/v1/same-level-list',  // 平级分类

  CustomerCoupon: ApiRootUrl + 'customer-coupon/f/v1/list',  //客户可用优惠券

  GoodsCount: ApiRootUrl + 'product/f/v1/total',  //统计商品总数
  GoodsList: ApiRootUrl + 'product/f/v1/list-by-category-id',  //获得商品列表
  GoodsCategory: ApiRootUrl + 'goods/category',  //获得分类数据
  GoodsDetail: ApiRootUrl + '/product/f/v1/detail',  //获得商品的详情
  GoodsNew: ApiRootUrl + 'goods/new',  //新品
  GoodsHot: ApiRootUrl + 'goods/hot',  //热门
  GoodsRelated: ApiRootUrl + 'goods/related',  //商品详情页的关联商品（大家都在看）

  BrandList: ApiRootUrl + 'brand/list',  //品牌列表
  BrandDetail: ApiRootUrl + 'brand/detail',  //品牌详情

  CartList: ApiRootUrl + 'cart/f/v1/customer-cart', //获取购物车的数据
  CartChange: ApiRootUrl + 'cart/f/v1/change', // 添加商品到购物车
  CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
  CartDelete: ApiRootUrl + 'cart/f/v1/del', // 删除购物车的商品
  CartChecked: ApiRootUrl + 'cart/f/v1/checked-all', // 选择或取消选择商品
  CartGoodsCount: ApiRootUrl + 'cart/f/v1/customer-cart-count', // 获取购物车商品件数
  CartCheckout: ApiRootUrl + 'cart/f/v1/checkout', // 下单前信息确认

  OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
  PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

  Recharge: ApiRootUrl + 'customer-recharge/f/v1/recharge',// 充值接口
  RechargeRuleList: ApiRootUrl + 'recharge-rule/f/v1/list', //充值卡片列表

  CollectList: ApiRootUrl + 'collect/list',  //收藏列表
  CollectAddOrDelete: ApiRootUrl + 'collect/addordelete',  //添加或取消收藏

  CommentList: ApiRootUrl + 'comment/list',  //评论列表
  CommentCount: ApiRootUrl + 'comment/count',  //评论总数
  CommentPost: ApiRootUrl + 'comment/post',   //发表评论

  TopicList: ApiRootUrl + 'topic/list',  //专题列表
  TopicDetail: ApiRootUrl + 'topic/detail',  //专题详情
  TopicRelated: ApiRootUrl + 'topic/related',  //相关专题

  SearchIndex: ApiRootUrl + 'search/index',  //搜索页面数据
  SearchResult: ApiRootUrl + 'search/result',  //搜索数据
  SearchHelper: ApiRootUrl + 'search/helper',  //搜索帮助
  SearchClearHistory: ApiRootUrl + 'search/clearhistory',  //搜索帮助

  AddressList: ApiRootUrl + 'customer-receive/f/v1/customer-address',  //收货地址列表
  AddressEdit: ApiRootUrl + 'customer-receive/f/v1/save-or-update', // 保存/修改 地址
  AddressDetail: ApiRootUrl + 'customer-receive/f/v1/find',  //收货地址详情
  AddressSave: ApiRootUrl + 'address/save',  //保存收货地址
  AddressDelete: ApiRootUrl + 'customer-receive/f/v1/del',  //保存收货地址
  AppendDeliveryFee: ApiRootUrl + 'delivery/f/v1/append-delivery-fee',// 追加配送费
  RegionList: ApiRootUrl + 'region/list',  //获取区域列表

  OrderList: ApiRootUrl + 'order/list',  //订单列表
  OrderDetail: ApiRootUrl + 'order/detail',  //订单详情
  OrderCancel: ApiRootUrl + 'order/cancel',  //取消订单
  OrderExpress: ApiRootUrl + 'order/express', //物流详情

  FootprintList: ApiRootUrl + 'footprint/list',  //足迹列表
  FootprintDelete: ApiRootUrl + 'footprint/delete',  //删除足迹
};