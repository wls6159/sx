import { get } from '../utils/request.js'

// 声明获取轮播图数据的 api 接口并导出
export const getBannerList = () => get('/api/banner/list')