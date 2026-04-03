<template>
  <div class="app-container">
    <van-nav-bar title="員工打卡系統" fixed placeholder />

    <div v-if="!isLogin" class="login-page">
      <van-nav-bar title="員工系統登入" />
      <van-form @submit="handleLogin" style="margin-top: 50px;">
        <van-cell-group inset>
          <van-field v-model="loginForm.username" label="帳號" placeholder="請輸入帳號" />
          <van-field v-model="loginForm.password" type="password" label="密碼" placeholder="請輸入密碼" />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">登入</van-button>
        </div>
      </van-form>
    </div>

    <div v-else>
      <van-nav-bar :title="'你好，' + currentUser.displayName" right-text="登出" @click-right="handleLogout" />


      <div class="message-section">
        <van-notice-bar left-icon="volume-o" text="☕ 周二衝刺，保持好節奏！祝您有美好的一天。" />
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
    </div>

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
const isLogin = ref(false);
const currentUser = ref(null); // 儲存登入後的員工資訊

const loginForm = ref({
  username: '',
  password: ''
});


// 1. 初始化：從後端取得今日紀錄 (這就是原本 AppSheet 自動載入資料的過程)
const fetchRecords = async () => {

  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:3000/api/records', {
      headers: {
        Authorization: `Bearer ${token}` // 在 Header 放入通行證
      }
    });
    punchRecords.value = response.data;

    // 簡單邏輯：判斷目前狀態
    if (punchRecords.value.some(r => r.punch_type === '下班')) {
      punchStatus.value = 'out'
    } else if (punchRecords.value.some(r => r.punch_type === '上班')) {
      punchStatus.value = 'in'
    }
  } catch (error) {
    if (error.response?.status === 401) handleLogout();
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
      user: currentUser.value.username // 這裡會根據你是用 admin 還是 staff01 登入而改變
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
onMounted(async () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
    isLogin.value = true;
    await fetchRecords();//避免畫面閃爍 用於同步資料
  }

  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', loginForm.value);
    const { token, user } = response.data;    
    currentUser.value = response.data.user;
    isLogin.value = true;

    // 同時存下 User 和 Token
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token); // 存下通行證

    showSuccessToast(`歡迎回來，${currentUser.value.displayName}`);
    fetchRecords(); // 登入後抓取該員工紀錄
  } catch (error) {
    showFailToast('登入失敗，請檢查帳密');
  }
};

const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '確定要登出系統嗎？',
  }).then(() => {
    // 1. 清除變數
    isLogin.value = false;
    currentUser.value = null;
    punchRecords.value = [];
    // 2. 清除快取
    localStorage.removeItem('user');
    showSuccessToast('已安全登出');
  });
};
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
  padding-bottom: 80px;
  /* 避免被底部導覽擋住 */
}
</style>