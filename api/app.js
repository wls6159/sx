// api/app.js
import { get } from '@/utils/request.js'

// 获取应用列表
export const getAppList = () => {
  return get('/api/app/list')
}