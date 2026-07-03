<template>
  <view class="login-container">
    <!-- 顶部 -->
    <view class="login-top">
      <view class="logo-text">
        <t-image src="/static/logo.png" width="72" height="72" shape="round" />
        <view class="title">智慧校园</view>
        <view>智能化校园综合服务平台</view>
      </view>
    </view>

    <!-- 登录组件（根据 typeUI 切换显示） -->
    <comLogin v-if="typeUI === 0" @toRegister="typeUI = 1" />
    
    <!-- 注册组件 -->
    <comRegister v-else-if="typeUI === 1" @toLogin="typeUI = 0" />

    <!-- 底部 -->
    <view class="footer">
      <comFooter />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import comFooter from '@/components/comFooter.vue'
import comLogin from '@/components/comLogin.vue'
import comRegister from '@/components/comRegister.vue'

// 定义 typeUI，控制显示登录还是注册（0: 登录, 1: 注册）
const typeUI = ref(0)
</script>

<style lang="less">
.login-container {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .login-top {
    width: 100%;
    height: 32vh;
    background-color: #2d69e8;
    border-bottom-right-radius: 50rpx;
    border-bottom-left-radius: 50rpx;
    display: flex;

    .logo-text {
      margin: auto;
      text-align: center;

      .t-image {
        box-shadow: 0rpx 5rpx 10rpx #484848;
      }

      .title {
        font-weight: bold;
        font-size: 36rpx;
        text-shadow: 0rpx 5rpx 10rpx #484848;
        color: #fff;
      }

      view {
        text-align: center;
        color: #fff;
        margin: 15rpx 0 !important;
      }
    }
  }

  .footer {
    width: 100%;
    position: absolute;
    bottom: 6%;
    text-align: center;
    --td-footer-text-color: #666666;
  }
}

// 全局样式覆盖
.t-form__item {
  padding: 22rpx 20rpx !important;
}

.t-form__label-text {
  font-weight: bold !important;
}

.input-placeholder {
  font-size: 30rpx !important;
}

.t-input__label {
  font-weight: bold !important;
  font-size: 28rpx !important;
}

.t-checkbox__title {
  color: #515151 !important;
  font-size: 28rpx !important;
}

.t-radio__title {
  color: #515151 !important;
  font-size: 28rpx !important;
}
</style>