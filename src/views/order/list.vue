<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, cancelOrder } from '../../api/order'

const router = useRouter()
const loading = ref(false)
const orderList = ref([])

const statusMap = {
  0: { label: '待支付', type: 'warning' },
  1: { label: '已支付', type: 'success' },
  2: { label: '已取消', type: 'info' }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await getOrderList()
    orderList.value = res.data || []
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cancelOrder(id)
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
    }
  }
}

const getStatusInfo = (status) => {
  return statusMap[status] || { label: '未知', type: 'info' }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="order-list-container">
    <el-header class="header">
      <div class="logo" @click="router.push('/')">电商系统</div>
      <div class="nav">
        <el-button @click="router.push('/')">首页</el-button>
        <el-button type="primary" @click="router.push('/product')">商品列表</el-button>
      </div>
    </el-header>
    <el-main class="main">
      <h2 class="page-title">我的订单</h2>
      <el-table :data="orderList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="80" />
        <el-table-column prop="productName" label="商品名称" min-width="150" />
        <el-table-column prop="quantity" label="数量" width="80" align="center" />
        <el-table-column prop="totalPrice" label="总价" width="120" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusInfo(row.status).type">
              {{ getStatusInfo(row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="router.push(`/order/${row.id}`)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="danger"
              link
              @click="handleCancel(row.id)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && orderList.length === 0" description="暂无订单" />
    </el-main>
  </div>
</template>

<style scoped>
.order-list-container {
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 20px;
  color: #333;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}
</style>