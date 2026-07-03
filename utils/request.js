// 封装的 request 
// 基础 URL：后端提供的服务地址
let baseUrl = "https://carain.cloud/smart_campus"

const request = (options) => {
	return new Promise((resolve, reject) => {

		// 获取缓存 token 
		const token = uni.getStorageSync('sc-token')
		const header = { 'Content-Type': 'application/json' }
		if (token) header['Authorization'] = `Bearer ${token}`

		// 请求加载图标
		uni.showLoading()
		
		uni.request({
			url: baseUrl + options.url, 	  // 请求的 url 地址
			method: options.method || 'GET',  // 请求方法(get/post)，默认为 GET
			data: options.data || {}, 		  // 请求参数
			header: header, 				  // 设置请求的 header
			success: (res) => {				  // 成功的回调函数处理
				const { statusCode, data } = res	// 解构状态码、数据
				// 网络返回的状态码
				if (statusCode === 401 || statusCode === 404) {
					uni.removeStorageSync('sc-token')
					uni.showToast({ title: data.msg, icon: 'none' })
					if( data.msg === '账号或密码错误'){
						return
					}
					// 跳转到登录页面
					setTimeout(() => uni.reLaunch({
						url: '/pages/login/login'
					}), 1500)
					
					return reject(new Error('未登录'))
				}

				// 后端返回的状态码
				if (statusCode === 403) { uni.showToast({ title: data.msg || '无权限', icon: 'none' }); return reject(new Error('无权限')) }
				if (statusCode === 500) { uni.showToast({ title: '服务器异常', icon: 'none' }); return reject(new Error('服务器异常')) }
				if (data.code !== 200) { uni.showToast({ title: data.msg || '请求失败', icon: 'none' }); return reject(new Error(data.msg)) }
				
				resolve(data)
				
			},
			fail: (err) => {		// 请求失败回调函数处理
				uni.showToast({ title:'服务器错误，请联系管理员！' , icon:'none'})
				reject(err);
			},complete:() =>{ uni.hideLoading() }
		});
	});
}

// GET 方法的封装
const get = (url, params = {}) => {
  const qs = Object.keys(params).filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  return request({ url: qs ? `${url}?${qs}` : url, method: 'GET' })
}
// POST 方法的封装
const post = (url, data = {}) => request({ url, method: 'POST', data })
// PUT 方法的封装
const put = (url, data = {}) => request({ url, method: 'PUT', data })
// DELETE 方法的封装
const del = (url) => request({ url, method: 'DELETE' })

// 导出变量
export { baseUrl, get, post, put, del }