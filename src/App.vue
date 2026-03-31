<template>
  <div class="app-container">
    <van-nav-bar title="員工打卡系統" fixed placeholder />

    <div class="user-card">
      <van-image
        round
        width="80"
        height="80"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <h2 class="user-name">王小明</h2>
      <p class="user-dept">IT 部門 | 軟體工程師</p>
    </div>

    <div class="message-section">
      <van-notice-bar
        left-icon="volume-o"
        text="☕ 周二衝刺，保持好節奏！祝您有美好的一天。"
      />
    </div>

    <div class="action-section">
      <div class="clock-display">{{ currentTime }}</div>
      <van-button 
        type="primary" 
        round 
        size="large" 
        class="punch-btn"
        @click="handlePunch"
      >
        一鍵上班打卡
      </van-button>
    </div>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="clock-o">打卡</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o">紀錄</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showSuccessToast } from 'vant'

const active = ref(0)
const currentTime = ref('')

// 更新時鐘
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handlePunch = () => {
  showSuccessToast('上班打卡成功！');
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.user-card {
  background: white;
  padding: 30px;
  text-align: center;
  margin-bottom: 10px;
}

.user-name {
  margin: 10px 0 5px;
  font-size: 20px;
}

.user-dept {
  color: #969799;
  font-size: 14px;
}

.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 0 20px;
}

.clock-display {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #323233;
}

.punch-btn {
  height: 120px;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
}
</style>