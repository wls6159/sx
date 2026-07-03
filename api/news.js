// 导入并解构 get 方法
import { get } from '../utils/request.js'

// 声明获取校园资讯数据的 api 接口并导出
export const getNewsList = (params) => get('/api/news/list', params)

// 声明获取校园资讯详情数据的 api 接口并导出
export const getNewsDetail = (id) => get('/api/news/detail/' + id)