# Hướng dẫn Deploy Angular App lên Vercel

## Các bước deploy:

### 1. Chuẩn bị project
- Đảm bảo đã commit tất cả thay đổi
- Kiểm tra `package.json` có script `build` đúng
- Kiểm tra `vercel.json` đã được tạo

### 2. Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Login vào Vercel
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### 3. Deploy qua GitHub/GitLab/Bitbucket

1. Push code lên repository
2. Vào [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import repository của bạn
5. Vercel sẽ tự động detect Angular và sử dụng cấu hình trong `vercel.json`

### 4. Cấu hình Environment Variables (nếu cần)

Nếu bạn có API keys hoặc environment variables:
1. Vào Project Settings trên Vercel
2. Chọn "Environment Variables"
3. Thêm các biến cần thiết

**Lưu ý:** Hiện tại project đang sử dụng TMDB API key. Nếu muốn thay đổi:
- Tạo environment variable trên Vercel: `TMDB_API_KEY`
- Hoặc giữ nguyên trong code (API key này là public)

### 5. Kiểm tra sau khi deploy

- Kiểm tra URL được cung cấp bởi Vercel
- Test routing (Angular SPA cần rewrite rules)
- Kiểm tra console để xem có lỗi không

## Lưu ý:

- Output directory: `dist/sandbox/browser` (Angular 19)
- Build command: `npm run build --configuration production`
- Framework: Detected automatically
- Routing: Đã được cấu hình trong `vercel.json` với rewrite rules

## Troubleshooting:

### Lỗi build:
- Kiểm tra Node version (Vercel hỗ trợ Node 18+)
- Kiểm tra `package.json` có đầy đủ dependencies
- Xem build logs trên Vercel dashboard

### Lỗi routing:
- Đảm bảo `vercel.json` có rewrite rules
- Kiểm tra Angular routes đã được cấu hình đúng

### Lỗi 404:
- Kiểm tra output directory trong `vercel.json`
- Đảm bảo `index.html` có trong output directory

