# SafeHome 🏠

一个现代化的家庭服务平台，专注于隐私保护和安全性，为用户提供便捷的家庭服务预订体验。

## 📋 项目概述

SafeHome是一个全栈Web应用，旨在连接用户与家庭服务提供商。项目特别注重数据隐私和安全，采用多层加密保护用户敏感信息，并集成了现代化的支付解决方案。

### 🌟 核心功能

- **用户管理**：注册、登录、角色管理（客户/服务商/管理员）
- **服务预订**：家庭服务发布、在线预订、时间安排
- **支付系统**：Stripe集成、多种支付方式、二维码支付
- **隐私保护**：敏感信息加密存储、GDPR合规
- **疫情安全**：疫苗接种状态追踪、地理位置筛选

## 🛠 技术栈

### 后端
- **框架**：Django 4.2 + Django REST Framework
- **数据库**：MySQL 8.0
- **认证**：JWT + HttpOnly Cookie
- **加密**：Fernet对称加密 + PBKDF2密钥派生
- **支付**：Stripe API集成

### 前端
- **框架**：Next.js 14 + React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **状态管理**：Zustand
- **数据获取**：TanStack React Query

### 部署
- **容器化**：Docker + Docker Compose
- **数据库**：MySQL容器
- **反向代理**：Nginx（生产环境）

## 🏗 项目架构

```
SafeHome/
├── backend/                 # Django后端
│   ├── accounts/           # 用户管理模块
│   ├── services/           # 服务管理模块
│   ├── bookings/           # 预订系统模块
│   ├── payments/           # 支付处理模块
│   ├── covid/              # 疫情相关功能
│   ├── core/               # 核心工具和中间件
│   └── tests/              # 测试文件
├── frontend/               # Next.js前端
│   ├── app/                # App Router结构
│   └── components/         # React组件
├── compose/                # Docker配置
└── tools/                  # 开发工具
```

## 🚀 快速开始

### 环境要求

- Docker & Docker Compose
- Node.js 18+ (本地开发)
- Python 3.9+ (本地开发)

### 1. 克隆项目

```bash
git clone <repository-url>
cd SafeHome
```

### 2. 生成安全密钥

```bash
# 生成Django密钥、Fernet密钥和JWT签名密钥
python tools/generate-keys.py
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp compose/.env.example compose/.env


# 编辑.env文件，填入生成的密钥和API配置
# 必须配置的变量：
# - DJANGO_SECRET_KEY
# - FERNET_KEY
# - JWT_SIGNING_KEY
# - STRIPE_PUBLISHABLE_KEY
# - STRIPE_SECRET_KEY
```

### 4. 启动服务

```bash
# 使用Docker Compose启动所有服务
cd compose
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 5. 访问应用

- **前端**：http://localhost:3000
- **后端API**：http://localhost:8000
- **API文档**：http://localhost:8000/api/schema/swagger-ui/

## 🔧 开发指南

### 本地开发设置

#### 后端开发

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
python manage.py migrate

# 启动开发服务器
python manage.py runserver
```

#### 前端开发

```bash
cd frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 数据库管理

```bash
# 创建迁移文件
python manage.py makemigrations

# 应用迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 填充测试数据
python manage.py seed
```

### 运行测试

```bash
# 运行所有测试
python manage.py test

# 运行特定测试
python manage.py test tests.test_booking_encryption
python manage.py test tests.test_crypto
```

## 🔐 安全特性

### 数据加密
- **Fernet对称加密**：保护用户地址、电话号码等敏感信息
- **PBKDF2密钥派生**：安全的密钥生成机制
- **多轮加密测试**：确保密文不可读性

### 认证安全
- **JWT令牌**：30分钟访问令牌 + 7天刷新令牌
- **HttpOnly Cookie**：防止XSS攻击
- **令牌轮换**：自动刷新和黑名单机制

### 隐私保护
- **同意日志**：GDPR合规的用户同意追踪
- **IP记录**：请求来源追踪
- **数据最小化**：只收集必要信息

### 支付安全
- **Stripe集成**：PCI DSS合规的支付处理
- **令牌化**：敏感支付信息不本地存储
- **支付验证**：完整的支付生命周期管理

## 📚 API文档

### 认证端点

```http
POST /api/auth/register     # 用户注册
POST /api/auth/login        # 用户登录
POST /api/auth/logout       # 用户登出
POST /api/auth/refresh      # 刷新令牌
GET  /api/auth/me          # 获取用户信息
```

### 服务端点

```http
GET    /api/services/       # 获取服务列表
POST   /api/services/       # 创建服务（管理员）
GET    /api/services/{id}/  # 获取服务详情
PUT    /api/services/{id}/  # 更新服务（管理员）
DELETE /api/services/{id}/  # 删除服务（管理员）
```

### 预订端点

```http
GET    /api/bookings/       # 获取用户预订
POST   /api/bookings/       # 创建预订
GET    /api/bookings/{id}/  # 获取预订详情
PUT    /api/bookings/{id}/  # 更新预订
DELETE /api/bookings/{id}/  # 取消预订
```

### 支付端点

```http
POST /api/payments/create-checkout-session/  # 创建支付会话
POST /api/payments/webhook/                   # Stripe Webhook
GET  /api/payments/qr/{token}/               # 获取支付二维码
```

## 🐳 部署指南

### Docker部署

```bash
# 生产环境部署
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量配置

生产环境需要配置以下关键变量：

```bash
# 安全配置
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<生产密钥>
FERNET_KEY=<生产加密密钥>
JWT_SIGNING_KEY=<生产JWT密钥>

# 数据库配置
MYSQL_PASSWORD=<强密码>
MYSQL_ROOT_PASSWORD=<强密码>

# Stripe配置
STRIPE_SECRET_KEY=<生产密钥>
STRIPE_WEBHOOK_SECRET=<Webhook密钥>

# 域名配置
DJANGO_ALLOWED_HOSTS=yourdomain.com
DJANGO_CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🧪 测试

项目包含全面的测试套件：

```bash
# 加密功能测试
python tests/test_crypto.py
python tests/test_booking_encryption.py

# API测试
python tests/test_auth_api.py
python tests/test_booking_api.py
python tests/test_services_api.py

# 支付测试
python tests/test_payment_model.py
python tests/test_stripe_checkout.py

# 疫情功能测试
python tests/test_covid_restrictions.py
```

## 📝 开发工具

### 密钥生成工具

```bash
# 生成所有必需的密钥
python tools/generate-keys.py
```

### 数据库种子数据

```bash
# 填充测试数据
python manage.py seed
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您遇到问题或有疑问，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue
3. 联系开发团队

## 🔮 未来计划

- [ ] 移动端应用开发
- [ ] 实时通知系统
- [ ] 服务商评价系统
- [ ] 多语言支持
- [ ] 高级分析仪表板

---

**SafeHome** - 让家庭服务更安全、更便捷 🏠✨
