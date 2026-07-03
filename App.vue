<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    
    // 拦截页面到登录页面
    const token = uni.getStorageSync('sc-token') || ''
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    
    // 拦截页面到访客页面
    const role = uni.getStorageSync('sc-role') || ''
    if (role === 'visitor') {
      uni.reLaunch({
        url: '/pages/visitor/visitor'
      })
      return
    }
    
    // 如果已登录且不是访客，跳转到首页
    if (token && role !== 'visitor') {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="less">
page {
  background-color: #F8F8F8;
}
</style>