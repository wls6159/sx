// 导入并解构 get、post 方法
import { get, post } from '../utils/request.js'

// 声明登录的 api 接口并导出
export const login = (data) => post('/api/auth/login', data)

// 声明登出的 api 接口并导出
export const logout = () => post('/api/auth/logout')

// 声明注册的 api 接口并导出
export const register = (data) => post('/auth/register', data)

// 声明获取用户信息的 api 接口并导出
export const getInfo = () => get('/api/auth/info')

// 声明获取验证码的 api 接口并导出
export const getCaptcha = () => get('/api/auth/captcha')

// 声明发送验证码的 api 接口并导出
export const sendCode = (data) => post('/api/auth/send-code', data)

// 声明忘记密码的 api 接口并导出
export const forgetPassword = (data) => post('/auth/forget', data)

// 声明刷新 token 的 api 接口并导出
export const refreshToken = () => post('/api/auth/refresh')