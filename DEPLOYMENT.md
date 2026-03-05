# 🚀 Triển khai E-Sign (Deployment Guide)

Tài liệu này mô tả cách **build**, **deploy** và **cấu hình** ứng dụng E-Sign trong các môi trường `development`, `uat`, `production`.

---

## 📂 Cấu trúc dự án liên quan đến triển khai

```
.
├── Dockerfile
├── docker-compose.yml
└── env/
    ├── .env.dev
    ├── .env.uat
    └── .env.prod
```

- **Dockerfile**: Định nghĩa cách build image của ứng dụng.
- **docker-compose.yml**: Quản lý container (app, Nginx, …).
- **env/**: Thư mục chứa file biến môi trường cho từng môi trường.

---

## ⚙️ Build & Deploy với NPM Scripts

Trong `package.json` đã có sẵn scripts:

```json
"scripts": {
  "docker:menu": "node docker-menu.js",

  "docker:build:dev": "npm run build && cross-env NODE_ENV=dev docker-compose --env-file env/.env.dev build",
  "docker:push:dev": "docker-compose --env-file env/.env.dev push",
  "docker:deploy:dev": "npm run docker:build:dev && npm run docker:push:dev",

  "docker:build:uat": "npm run build && cross-env NODE_ENV=uat docker-compose --env-file env/.env.uat build",
  "docker:push:uat": "docker-compose --env-file env/.env.uat push",
  "docker:deploy:uat": "npm run docker:build:uat && npm run docker:push:uat",

  "docker:build:prod": "npm run build && cross-env NODE_ENV=prod docker-compose --env-file env/.env.prod build",
  "docker:push:prod": "docker-compose --env-file env/.env.prod push",
  "docker:deploy:prod": "npm run docker:build:prod && npm run docker:push:prod"
}
```

---

### 📋 Menu Docker

Để hiển thị menu chọn nhanh (Dev / UAT / Prod):

```bash
npm run docker:menu
```

---

### 🚀 Các lệnh theo môi trường

| Môi trường | Build                       | Push                       | Build + Push (Deploy)        |
| ---------- | --------------------------- | -------------------------- | ---------------------------- |
| **Dev**    | `npm run docker:build:dev`  | `npm run docker:push:dev`  | `npm run docker:deploy:dev`  |
| **UAT**    | `npm run docker:build:uat`  | `npm run docker:push:uat`  | `npm run docker:deploy:uat`  |
| **Prod**   | `npm run docker:build:prod` | `npm run docker:push:prod` | `npm run docker:deploy:prod` |

---

✅ Với cấu trúc này:

- Muốn nhanh → chạy `npm run docker:menu`.
- Muốn thủ công → chọn lệnh theo bảng.

---
