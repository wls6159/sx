<template>
  <view class="form-box">
    <t-form ref="formRef" class="form" :data="formData" :rules="rules" show-error-message
      scroll-to-first-error="smooth" label-align="top">
      
      <!-- 账号 -->
      <t-form-item label="账号" name="account">
        <t-input v-model:value="formData.account" borderless placeholder="请输入账号/手机号" clearable />
      </t-form-item>
      
      <!-- 密码 -->
      <t-form-item label="密码" name="password">
        <t-input v-model:value="formData.password" password borderless placeholder="请输入密码" type="password" clearable />
        <text class="forget-password">忘记密码?</text>
      </t-form-item>
      
      <!-- 验证码 -->
      <t-form-item class="captcha" name="captcha">
        <t-input v-model:value="formData.captcha" type="number" 
          placeholder="输入验证码" label="验证码" borderless>
          <template #suffix>
            <view class="suffix">
              <view class="suffix--line" />
              <image v-if="capImg" class="cap" :src="capImg" mode="heightFix" @click="getCap" />
              <view v-else class="cap" @click="getCap">点击获取</view>
            </view>
          </template>
        </t-input>
      </t-form-item>
      
      <!-- 记住密码 -->
      <view class="remember-password">
        <t-checkbox icon="rectangle" :block="false" v-model:checked="remember" label="记住密码" borderless @change="onRememberChange" />
        <view class="tip-box">
          <text class="tip-text">还没有账号？</text>
          <text class="go-btn" @click="$emit('toRegister')">访客注册</text>
        </view>
      </view>
      
      <!-- 同意用户协议条款 -->
      <view class="agree">
        <t-radio label="同意用户协议与隐私条款" 
          allow-uncheck :block="false" v-model:checked="agree" />
      </view>
      
      <!-- 登录按钮 -->
      <t-button theme="primary" form-type="submit" block size="large" @click="onLogin">登录</t-button>
    </t-form>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { getCaptcha, login, getInfo } from '@/api/author.js'

// 响应式表单数据
const formData = ref({
  account: '',
  password: '',
  captcha: '',
  captchaKey: ''
})

// 表单引用
const formRef = ref(null)

// 校验规则
const rules = {
  account: [{ validator: val => val !== '', message: '请输入账号/手机号' }],
  password: [{ validator: val => val !== '', message: '请输入密码' }],
  captcha: [{ validator: val => val !== '', message: '请输入验证码' }],
}

// 是否同意
const agree = ref(false)

// 声明验证码图片变量
const capImg = ref('')

// 获取验证码图片事件（完全按照第一个简洁版本）
const getCap = async () => {
  try {
    const res = await getCaptcha()
    capImg.value = res.data.captchaImage
    formData.value.captchaKey = res.data.captchaKey
    console.log('验证码获取成功:', res)
  } catch (error) {
    console.error('获取验证码失败:', error)
    // 不显示任何提示，保持简洁
  }
}

// 记住密码
const remember = ref(false)

// 记住密码事件
const onRememberChange = (e) => {
  if (!e.checked) {
    uni.removeStorageSync('savedUser')
  }
}

// 生命周期函数
onShow(() => {
  // 一刷新页面调用获取验证码图片事件
  getCap()
  // 一进入登录页，检查是否有记住密码的缓存数据
  const user = uni.getStorageSync('savedUser') || ''
  if (user !== '') {
    formData.value.account = user.account
    formData.value.password = user.password
    remember.value = true
  }
})

// 登录事件
const onLogin = () => {
  if (formRef.value) {
    formRef.value.validate().then(async valid => {
      if (!agree.value) {
        uni.showToast({
          title: '请同意用户协议与隐私条款',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({
          title: '登录中...',
          mask: true
        })
        
        const res = await login(formData.value)
        
        uni.hideLoading()
        
        if (res.code !== 200) {
          formData.value.captcha = ''
          getCap()
          uni.showToast({
            title: res.msg || '登录失败',
            icon: 'none'
          })
          return
        }
        
        if (remember.value) {
          let user = {
            account: formData.value.account,
            password: formData.value.password,
          }
          uni.setStorageSync('savedUser', user)
        }
        
        uni.setStorageSync('sc-token', res.data.token)
        
        const result = await getInfo()
        const role = result.data.role
        
        uni.setStorageSync('sc-role', role)
        
        uni.showToast({ 
          title: res.msg || '登录成功', 
          icon: 'success' 
        })
        
        setTimeout(() => {
          if (role === 'visitor') {
            uni.reLaunch({
              url: '/pages/visitor/visitor'
            })
            return
          }
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }, 500)
        
      } catch (error) {
        uni.hideLoading()
        console.error('登录失败:', error)
        formData.value.captcha = ''
        getCap()
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    })
  }
}
</script>

<style lang="less">
.form-box {
  width: 600rpx;
  padding: 30rpx 25rpx 40rpx 25rpx;
  margin: -5vh auto;
  background-color: #ffffff;
  top: -6vh;
  border-radius: 20rpx;
  box-shadow: 0rpx 0rpx 50rpx #34343466;
  
  .forget-password {
    color: #4d4d4d;
    text-decoration: underline;
    margin-left: 30rpx;
  }
  
  .cap {
    height: 75rpx;
    line-height: 75rpx;
    width: 200rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #34343410;
    color: #545454;
  }
  
  .remember-password {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #4a4a4a;
    margin: 30rpx 20rpx;
    
    .tip-box {
      .tip-text {
        font-size: 26rpx;
        color: #9ca3af;
      }
      .go-btn {
        font-size: 26rpx;
        color: #3b82f6;
        font-weight: bold;
        margin-left: 8rpx;
      }
    }
  }
  
  .agree {
    margin: 20rpx;
    margin-top: 50rpx;
  }
  
  .t-button--block {
    width: 100% !important;
    --td-button-border-width: 0rpx;
    color: #fff !important;
    border: none !important;
    background: linear-gradient(135deg, #2d69e8, #60a5fa) !important;
    border-radius: 50rpx !important;
  }
}
</style>