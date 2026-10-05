<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList } from '../../api/product'

const router = useRouter()
const loading = ref(false)
const productList = ref([])
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const searchForm = ref({
  keyword: '',
  minPrice: '',
  maxPrice: ''
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    }
    if (searchForm.value.keyword) {
      params.keyword = searchForm.value.keyword
    }
    if (searchForm.value.minPrice !== '') {
      params.minPrice = searchForm.value.minPrice
    }
    if (searchForm.value.maxPrice !== '') {
      params.maxPrice = searchForm.value.maxPrice
    }
    const res = await getProductList(params)
    productList.value = res.data.records
    pagination.value.total = res.data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.pageNum = 1
  fetchProducts()
}

const handleReset = () => {
  searchForm.value = {
    keyword: '',
    minPrice: '',
    maxPrice: ''
  }
  pagination.value.pageNum = 1
  fetchProducts()
}

const handlePageChange = (page) => {
  pagination.value.pageNum = page
  fetchProducts()
}

const goDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="product-list-container">
    <el-header class="header">
      <div class="logo" @click="router.push('/')">电商系统</div>
      <div class="nav">
        <el-button type="primary" @click="router.push('/')">首页</el-button>
      </div>
    </el-header>
    <el-main class="main">
      <h2 class="page-title">商品列表</h2>
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入商品名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="最低价">
            <el-input-number
              v-model="searchForm.minPrice"
              :min="0"
              :precision="2"
              placeholder="最低价"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="最高价">
            <el-input-number
              v-model="searchForm.maxPrice"
              :min="0"
              :precision="2"
              placeholder="最高价"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-row :gutter="20">
        <el-col
          v-for="item in productList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card
            class="product-card"
            :body-style="{ padding: '0px' }"
            shadow="hover"
            @click="goDetail(item.id)"
          >
            <div class="product-image">
              <el-image
                :src="item.image || 'https://via.placeholder.com/200'"
                fit="cover"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ item.name }}</h3>
              <p class="product-desc">{{ item.description }}</p>
              <div class="product-footer">
                <span class="price">¥{{ item.price }}</span>
                <span class="stock">库存: {{ item.stock }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="pagination" v-if="pagination.total > 0">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
      <el-empty v-if="!loading && productList.length === 0" description="暂无商品" />
    </el-main>
  </div>
</template>

<style scoped>
.product-list-container {
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

.search-card {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: bold;
}

.stock {
  font-size: 12px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>