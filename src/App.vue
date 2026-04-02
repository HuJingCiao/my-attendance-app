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
      <h2 class="user-name">黃小明</h2>
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
     <van-button type="primary" round size="large" class="punch-btn" :disabled="isFinished" @click="handlePunch">
        {{ buttonText }} </van-button>
    </div>
    <div class="records-section" v-if="punchRecords.length > 0">
      <van-divider content-position="left">今日行程</van-divider>
      <van-steps direction="vertical" :active="punchRecords.length - 1">
        <van-step v-for="(item, index) in punchRecords" :key="index">
          <h3>{{ item.punch_type }}成功</h3>
          <p>{{ item.display_time || item.punch_time }}</p>
        </van-step>         
      </van-steps>
    </div>
   <van-empty v-if="punchRecords.length === 0" description="今天尚未有打卡紀錄" image="search" />

    <van-tabbar v-model="active">
      <van-tabbar-item icon="clock-o">打卡</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o">紀錄</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
  <van-overlay :show="loading" z-index="100">
    <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
      <van-loading type="spinner" color="#1989fa" vertical>處理中...</van-loading>
    </div>
  </van-overlay>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { showSuccessToast, showConfirmDialog, showFailToast } from 'vant'
import axios from 'axios' // 匯入通訊工具


// 1. 定義狀態：'none' (未打卡), 'in' (已上班), 'out' (已下班)
const punchStatus = ref('none')
const punchRecords = ref([]) // 儲存今日打卡紀錄
const currentTime = ref('')
const loading = ref(false);

// 1. 初始化：從後端取得今日紀錄 (這就是原本 AppSheet 自動載入資料的過程)
const fetchRecords = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/records')
    punchRecords.value = response.data
    
    // 簡單邏輯：判斷目前狀態
    if (punchRecords.value.some(r => r.type === '下班')) {
      punchStatus.value = 'out'
    } else if (punchRecords.value.some(r => r.type === '上班')) {
      punchStatus.value = 'in'
    }
  } catch (error) {
    console.error('取得資料失敗', error)
  }
}

// 2. 計算屬性：根據狀態決定按鈕文字 (類似 AppSheet 的公式)
const buttonText = computed(() => {
  if (punchStatus.value === 'none') return '一鍵上班打卡'
  if (punchStatus.value === 'in') return '一鍵下班打卡'
  return '今日已完成打卡'
})

const isFinished = computed(() => punchStatus.value === 'out')

// 3. 處理打卡動作
const handlePunch = async () => {
  if (isFinished.value || loading.value) return; // 如果正在讀取中，不允許再次點擊

  loading.value = true; // 開啟 Loading
  try {
    const type = punchStatus.value === 'none' ? '上班' : '下班';
    const response = await axios.post('http://localhost:3000/api/punch', {
      type: type,
      user: '王小明'
    });
    showSuccessToast(response.data.message);
    await fetchRecords(); 
  } catch (error) {
    if (error.response && error.response.status === 400) {
      showFailToast(error.response.data.message);
    } else {
      showFailToast('系統異常');
    }
  } finally {
    loading.value = false; // 無論成功或失敗，最後都要關閉 Loading
  }
};

// 時鐘邏輯 (保持不變)
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}
let timer
onMounted(() => {
  fetchRecords()
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))
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

.records-section {
  margin-top: 30px;
  padding-bottom: 80px; /* 避免被底部導覽擋住 */
}
</style>