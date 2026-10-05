<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'
import { updateUserInfo } from '../../api/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const isEdit = ref(false)
const saveLoading = ref(false)

const formRef = ref()

const editForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value && value !== editForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleEdit = () => {
  isEdit.value = true
  editForm.email = userStore.userInfo?.email || ''
  editForm.password = ''
  editForm.confirmPassword = ''
}

const handleCancel = () => {
  isEdit.value = false
  formRef.value?.resetFields()
}

const handleSave = async () => {
  try {
    await formRef.value.validate()
    saveLoading.value = true
    const data = { email: editForm.email }
    if (editForm.password) {
      data.password = editForm.password
    }
    await updateUserInfo(data)
    await userStore.fetchUserInfo()
    ElMessage.success('修改成功')
    isEdit.value = false
  } catch (error) {
    console.error('修改失败:', error)
  } finally {
    saveLoading.value = false
  }
}

onMounted(async () => {
  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      router.push('/login')
    }
  }
})
</script>

<template>
  <div class="user-container">
    <el-header class="header">
      <div class="logo" @click="router.push('/')">电商系统</div>
      <div class="nav">
        <el-button @click="router.push('/')">首页</el-button>
        <el-button type="primary" @click="router.push('/product')">商品列表</el-button>
        <el-button @click="router.push('/order')">我的订单</el-button>
      </div>
    </el-header>
    <el-main class="main">
      <el-card class="user-card">
        <template #header>
          <div class="card-header">
            <span class="title">个人中心</span>
            <el-button v-if="!isEdit" type="primary" @click="handleEdit">编辑资料</el-button>
          </div>
        </template>

        <template v-if="!isEdit">
          <el-descriptions :column="1" border v-if="userStore.userInfo">
            <el-descriptions-item label="用户名">
              {{ userStore.userInfo.username }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userStore.userInfo.email || '未设置' }}
            </el-descriptions-item>
          </el-descriptions>
        </template>

        <template v-else>
          <el-form
            ref="formRef"
            :model="editForm"
            :rules="rules"
            label-width="100px"
            style="max-width: 500px; margin: 0 auto"
          >
            <el-form-item label="用户名">
              <el-input :model-value="userStore.userInfo?.username" disabled />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="editForm.password"
                type="password"
                placeholder="不修改请留空"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="editForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-card>
    </el-main>
  </div>
</template>

<style scoped>
.user-container {
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
</style>