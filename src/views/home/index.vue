<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.isLoggedIn() && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      router.push('/login')
    }
  }
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <el-header class="header">
      <div class="logo">电商系统</div>
      <div class="header-right">
        <el-button type="primary" @click="router.push('/product')">商品列表</el-button>
        <el-button @click="router.push('/order')">我的订单</el-button>
        <el-dropdown>
          <span class="user-name">
            {{ userStore.userInfo?.username || '用户' }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/user')">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="main">
      <div class="welcome">
        <h1>欢迎回来，{{ userStore.userInfo?.username || '用户' }}！</h1>
        <p>这是一个电商管理系统</p>
        <el-button type="primary" size="large" @click="router.push('/product')">
          去购物
        </el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.main {
  padding: 20px;
}

.welcome {
  text-align: center;
  padding: 100px 0;
}

.welcome h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

.welcome p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}
</style>