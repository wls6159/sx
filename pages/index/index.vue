<template>
  <view>
    <!-- 轮播图 -->
    <view class="swiper-box">
      <!-- logo -->
      <view class="logo">
        <t-image src="/static/logo.png" width="40" height="40" shape="circle" />
        <view class="title">智慧校园</view>
        <t-icon name="wifi" size="48rpx" t-class="icon" />
        <t-icon name="scan" size="48rpx" t-class="icon" />
        <t-icon name="notification-filled" size="48rpx" t-class="icon" />
      </view>
      <!-- 轮播图 -->
      <t-swiper autoplay :list="swiperList" :navigation="{ type: 'dots-bar' }" />
    </view>

    <!-- 通知 -->
    <t-notice-bar visible prefix-icon="sound" :content="noticeText" suffix-icon="close" />

    <!-- 校园资讯 -->
    <view class="newsHot">
      <t-image src="/static/images/news.png" width="75" height="25" />
      <t-notice-bar
        visible
        :prefix-icon="false"
        :content="newsHot"
        direction="vertical"
        suffix-icon="chevron-right"
      />
    </view>

    <!-- 搜索 -->
    <view class="search">
      <t-search placeholder="请输入搜索的关键词" margin="20rpx" />
    </view>

    <!-- tab 列表 -->
    <view class="tab-box">
      <t-tabs :animation="{ duration: 0.6 }" :default-value="0">
        <t-tab-panel label="全部" value="0">
          <view class="custom-panel__content">
            <!-- 标题 -->
            <view class="card-header">
              <view class="card-title-bar"></view>
              <text class="card-title">功能服务</text>
            </view>
            <!-- 表格数据 -->
            <t-grid :column="4">
              <t-grid-item
                t-class-image="image"
                v-for="(item, index) in appList"
                :key="index"
                :text="item.app_name"
                :image="item.icon"
              />
            </t-grid>
          </view>
        </t-tab-panel>
        <t-tab-panel label="智慧校园通" value="1">
          <view class="custom-panel__content">
            <t-empty icon="education-filled" description="暂无智慧校园通数据~" />
          </view>
        </t-tab-panel>
        <t-tab-panel label="请假登记" value="2">
          <view class="custom-panel__content">
            <t-empty icon="education-filled" description="暂无请假登记数据~" />
          </view>
        </t-tab-panel>
        <t-tab-panel label="假期去向登记" value="3">
          <view class="custom-panel__content">
            <t-empty icon="education-filled" description="暂无假期去向登记数据~" />
          </view>
        </t-tab-panel>
      </t-tabs>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getBannerList } from '@/api/banner.js';
import { getNewsList } from '@/api/news.js';
import { getAppList } from '@/api/app.js';
import { baseUrl } from '@/utils/request.js';

const swiperList = ref([]);
const noticeText = ref('智慧校园已上线！');
const newsHot = ref([]);
const appList = ref([]);

onShow(() => {
  getBannerData();
  getNewsData();
  getAppData();
});

const getBannerData = async () => {
  const res = await getBannerList();
  swiperList.value = res.data.list.map(item => item.image_url);
};

const getNewsData = async () => {
  const res = await getNewsList();
  newsHot.value = res.data.map(item => item.title);
};

const getAppData = async () => {
  const res = await getAppList();
  res.data.forEach(item => {
    item.icon = baseUrl + item.icon;
  });
  appList.value = res.data;
};
</script>

<style lang="less" scoped>
.swiper-box {
  --td-swiper-radius: 0rpx;
  position: relative;

  :deep(.t-swiper__item) {
    filter: brightness(0.8) !important;
  }

  .logo {
    position: fixed;
    top: 90rpx;
    left: 20rpx;
    z-index: 9999;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;

    .title,
    :deep(.t-icon-base) {
      font-size: 34rpx;
      font-weight: bold;
      margin-left: 20rpx;
      text-shadow: 0rpx 0rpx 10rpx #000;
    }
  }
}

.newsHot {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding-left: 25rpx;
  margin: 15rpx 0;
  border-radius: 10rpx;

  .t-image {
    height: auto !important;
  }

  :deep(.t-notice-bar) {
    flex: 1;
    background-color: #ffffff !important;
  }
}

.search {
  --td-search-bg-color: #fff !important;
}

.tab-box {
  .custom-panel__content {
    margin: 20rpx;

    .card-header {
      margin: 10rpx 35rpx;
      margin-top: 40rpx;
      display: flex;
      flex-direction: row;
      align-items: center;

      .card-title-bar {
        width: 6rpx;
        height: 28rpx;
        background: linear-gradient(180deg, #3b82f6, #60a5fa);
        border-radius: 3rpx;
        margin-right: 14rpx;
      }

      .card-title {
        font-weight: bold;
      }
    }
  }
}
</style>