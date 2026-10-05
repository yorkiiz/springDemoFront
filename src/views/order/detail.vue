<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderDetail, cancelOrder } from '../../api/order'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const order = ref(null)
const cancelLoading = ref(false)

const statusMap = {
  0: { label: '待支付', type: 'warning' },
  1: { label: '已支付', type: 'success' },
  2: { label: '已取消', type: 'info' }
}

const fetchOrder = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res.data
  } catch (error) {
    console.error('获取订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    cancelLoading.value = true
    await cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    fetchOrder()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
    }
  } finally {
    cancelLoading.value = false
  }
}

const getStatusInfo = (status) => {
  return statusMap[status] || { label: '未知', type: 'info' }
}

onMounted(() => {
  fetchOrder()
})
</script>

<template>
  <div class="order-detail-container">
    <el-header class="header">
      <div class="logo" @click="router.push('/')">电商系统</div>
      <div class="nav">
        <el-button @click="router.push('/order')">订单列表</el-button>
      </div>
    </el-header>
    <el-main class="main" v-loading="loading">
      <template v-if="order">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="title">订单详情</span>
              <el-tag :type="getStatusInfo(order.status).type" size="large">
                {{ getStatusInfo(order.status).label }}
              </el-tag>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单ID">{{ order.id }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{ order.productName }}</el-descriptions-item>
            <el-descriptions-item label="单价">
              <span class="price">¥{{ order.productPrice }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="数量">{{ order.quantity }}</el-descriptions-item>
            <el-descriptions-item label="总价">
              <span class="price total-price">¥{{ order.totalPrice }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ order.createTime }}</el-descriptions-item>
          </el-descriptions>
          <div class="action" v-if="order.status === 0">
            <el-button
              type="danger"
              :loading="cancelLoading"
              @click="handleCancel"
            >
              取消订单
            </el-button>
          </div>
        </el-card>
      </template>
    </el-main>
  </div>
</template>

<style scoped>
.order-detail-container {
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
  cursor: pointer;
}

.main {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.total-price {
  font-size: 20px;
}

.action {
  margin-top: 24px;
  text-align: center;
}
</style>