<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '../../api/product'
import { createOrder } from '../../api/order'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const product = ref(null)
const quantity = ref(1)
const orderLoading = ref(false)

const fetchProduct = async () => {
  loading.value = true
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data
  } catch (error) {
    console.error('获取商品详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleBuy = async () => {
  if (quantity.value > product.value.stock) {
    ElMessage.warning('库存不足')
    return
  }
  orderLoading.value = true
  try {
    await createOrder({
      productId: product.value.id,
      quantity: quantity.value
    })
    ElMessage.success('下单成功')
    router.push('/order')
  } catch (error) {
    console.error('下单失败:', error)
  } finally {
    orderLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <div class="product-detail-container">
    <el-header class="header">
      <div class="logo" @click="router.push('/')">电商系统</div>
      <div class="nav">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-header>
    <el-main class="main" v-loading="loading">
      <template v-if="product">
        <el-card>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-image
                :src="product.image || 'https://via.placeholder.com/400'"
                fit="cover"
                class="product-image"
              />
            </el-col>
            <el-col :span="12">
              <div class="product-info">
                <h1 class="product-name">{{ product.name }}</h1>
                <p class="product-desc">{{ product.description }}</p>
                <div class="product-meta">
                  <div class="price-row">
                    <span class="label">价格：</span>
                    <span class="price">¥{{ product.price }}</span>
                  </div>
                  <div class="stock-row">
                    <span class="label">库存：</span>
                    <span class="stock">{{ product.stock }}</span>
                  </div>
                </div>
                <div class="buy-section">
                  <span class="label">数量：</span>
                  <el-input-number
                    v-model="quantity"
                    :min="1"
                    :max="product.stock"
                  />
                </div>
                <div class="action">
                  <el-button
                    type="primary"
                    size="large"
                    :loading="orderLoading"
                    @click="handleBuy"
                  >
                    立即购买
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </el-main>
  </div>
</template>

<style scoped>
.product-detail-container {
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
  max-width: 1000px;
  margin: 0 auto;
}

.product-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

.product-info {
  padding: 20px 0;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin: 0 0 16px 0;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.product-meta {
  margin-bottom: 24px;
}

.price-row,
.stock-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.label {
  font-size: 14px;
  color: #666;
  width: 60px;
}

.price {
  font-size: 28px;
  color: #ff4d4f;
  font-weight: bold;
}

.stock {
  font-size: 14px;
  color: #333;
}

.buy-section {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.action {
  margin-top: 20px;
}
</style>