<template>
  <view class="form-box">
    <t-form ref="formRef" class="form" :data="formData" :rules="rules" show-error-message
      scroll-to-first-error="smooth" label-align="left" label-width="180rpx">
      
      <!-- 手机号 -->
      <t-form-item label="手机号" name="phone">
        <t-input v-model:value="formData.phone" borderless placeholder="请输入手机号" clearable />
      </t-form-item>
      
      <!-- 设置密码 -->
      <t-form-item label="设置密码" name="password">
        <t-input v-model:value="formData.password" borderless placeholder="请输入要设置的密码" clearable />
      </t-form-item>
      
      <!-- 确认密码 -->
      <t-form-item label="确认密码" name="conPassword">
        <t-input v-model:value="formData.conPassword" borderless placeholder="请再次确认设置的密码" clearable />
      </t-form-item>
      
      <!-- 验证码 -->
      <t-form-item class="captcha" name="captcha">
        <t-input v-model:value="formData.captcha" type="number" label="验证码" placeholder="输入验证码" borderless>
          <template #suffix>
            <view class="suffix">
              <view class="suffix--line" />
              <image v-if="capImg" class="cap" :src="capImg" mode="heightFix" @click="getCap" />
              <view v-else class="cap" @click="getCap">点击获取</view>
            </view>
          </template>
        </t-input>
      </t-form-item>
      
      <!-- 同意用户协议条款 -->
      <view class="agree">
        <t-radio label="同意用户协议与隐私条款" allow-uncheck :block="false" v-model:checked="agree" />
      </view>
      
      <!-- 注册按钮 -->
      <t-button theme="primary" form-type="submit" block size="large" @click="handleRegister">
        访客注册
      </t-button>
      
      <!-- 立即登录 -->
      <view class="tip-box">
        <text class="tip-text">已有账号</text>
        <text class="go-btn" @click="$emit('toLogin')">立即登录</text>
      </view>
    </t-form>
  </view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import { register, getCaptcha } from '@/api/author.js'

	// 响应式表单数据
	const formData = ref({
	  phone: '',
	  password: '',
	  conPassword: '',
	  captcha: '',
	  captchaKey: '', // 验证码key
	});

	// 表单引用
	const formRef = ref(null)

	// 校验规则
	const rules = {
	  phone: [{ validator: val => val.length === 11, message: '请输入正确的手机号' }],
	  password: [{ validator: val => val.length >= 6, message: '密码长度大于6个字符' }],
	  conPassword: [{
		validator: (val) => {
		  return val === formData.value.password
		},
		message: '确认密码与设置密码不匹配'
	  }],
	  captcha: [{ validator: val => val !== '', message: '请输入验证码' }],
	}

	// 声明验证码图片变量
	const capImg = ref('')

	// 获取验证码图片事件
	const getCap = async () => {
	  try {
		const res = await getCaptcha()
		capImg.value = res.data.captchaImage
		formData.value.captchaKey = res.data.captchaKey
	  } catch (error) {
		console.error('获取验证码失败:', error)
		uni.showToast({
		  title: '获取验证码失败',
		  icon: 'none'
		})
	  }
	}

	// 是否同意协议
	const agree = ref(false)

	// 生命周期函数
	onShow(() => {
	  // 一刷新页面调用获取验证码图片事件
	  getCap()
	})

	// 注册提交
	const handleRegister = async () => {
	  // 表单验证
	  try {
		const result = await formRef.value.validate()
		if (result !== true) {
		  return
		}
	  } catch (error) {
		return
	  }

	  // 检查是否同意协议
	  if (!agree.value) {
		uni.showToast({
		  title: '请先同意用户协议与隐私条款',
		  icon: 'none'
		})
		return
	  }

	  // 调用注册接口
	  try {
		uni.showLoading({
		  title: '注册中...'
		})

		const res = await register({
		  phone: formData.value.phone,
		  password: formData.value.password,
		  captcha: formData.value.captcha,
		  captchaKey: formData.value.captchaKey
		})

		uni.hideLoading()

		if (res.code === 200) {
		  uni.showToast({
			title: '注册成功',
			icon: 'success'
		  })
		  
		  // 注册成功后跳转到登录页
		  setTimeout(() => {
			$emit('toLogin')
		  }, 1500)
		} else {
		  uni.showToast({
			title: res.message || '注册失败',
			icon: 'none'
		  })
		  // 刷新验证码
		  getCap()
		}
	  } catch (error) {
		uni.hideLoading()
		console.error('注册失败:', error)
		uni.showToast({
		  title: '注册失败，请稍后重试',
		  icon: 'none'
		})
		// 刷新验证码
		getCap()
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

	  .captcha {
		display: flex;

		.cap {
		  height: 80rpx;
		  line-height: 80rpx;
		  width: 200rpx;
		  text-align: center;
		  margin-left: 20rpx;
		  border-radius: 10rpx;
		  background-color: #34343410;
		  color: #545454;
		}
	  }

	  .agree {
		margin: 20rpx;
	  }

	  .t-button--block {
		width: 100% !important;
		--td-button-border-width: 0rpx;
		color: #fff !important;
		border: none !important;
		background: linear-gradient(135deg, #2d69e8, #60a5fa) !important;
		border-radius: 50rpx !important;
	  }

	  .tip-box {
		margin: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

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
</style>