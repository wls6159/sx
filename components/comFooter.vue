<template>
	<view class="footer-example">
		<t-footer :text="text" :links="links" />
	</view>
</template>

<script setup>
import { ref } from 'vue'

const text = ref("Copyright © 2021-2031 GY.All Rights Reserved.")

const links = ref([
	{ 
		name: '隐私政策', 
		url: '/pages/home/home', 
		openType: 'navigate' 
	},
	{ 
		name: '使用条款', 
		url: '', 
		openType: 'navigateBack' 
	},
	{ 
		name: '常见问题', 
		url: '', 
		openType: 'navigateBack' 
	}
])
</script>

<style lang="less">
.footer-example {
	width: 100%;
	padding: 20rpx 0;
	
	// 可以添加更多样式
}
</style>