## 功能模块

### 1. 用户认证模块
- [ ] 登录页面
- [ ] 注册页面
- [ ] 登出功能
- [ ] Token 管理（localStorage）
- [ ] 路由守卫（未登录跳转）

### 2. 商品模块
- [ ] 商品列表页（分页加载）
- [ ] 商品详情页
- [ ] 商品搜索/筛选

### 3. 订单模块
- [ ] 创建订单
- [ ] 订单列表
- [ ] 订单详情
- [ ] 取消订单

### 4. 用户中心
- [ ] 用户信息展示
- [ ] 个人信息修改

## 后端 API 对接

| 功能 | 接口地址 | 方法 |
|------|----------|------|
| 注册 | /api/register | POST |
| 登录 | /api/doLogin | POST |
| 登出 | /api/logout | POST |
| 用户信息 | /api/user/info | GET |
| 商品列表 | /api/product/list | GET |
| 商品详情 | /api/product/detail/:id | GET |
| 创建订单 | /api/order/create | POST |
| 订单列表 | /api/order/list | GET |
| 订单详情 | /api/order/detail/:id | GET |
| 取消订单 | /api/order/cancel/:id | POST |

## 开发计划

### 第一阶段：基础架构
1. 配置路由和状态管理
2. 封装 Axios 请求
3. 实现登录/注册页面
4. 配置路由守卫

### 第二阶段：核心功能
1. 商品列表页
2. 商品详情页
3. 创建订单功能
4. 订单列表页

### 第三阶段：完善优化
1. 用户中心
2. 权限控制
3. 错误处理优化
4. 响应式适配

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
