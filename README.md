# 🚀 GeminiSite

<div align="center">
  <img src="public/logo.svg" alt="GeminiSite Logo" width="200">
  <h3>Tạo trang web từ mô tả bằng Gemini 2.5 Flash</h3>
  <p>Phát triển bởi <a href="https://github.com/TuanAnhCompany">Tuấn Anh Company</a></p>
</div>

## 📋 Giới thiệu

GeminiSite là một ứng dụng web cho phép bạn tạo trang web hoàn chỉnh chỉ bằng cách mô tả ý tưởng của mình. Sử dụng sức mạnh của Google Gemini 2.5 Flash, ứng dụng sẽ biến mô tả của bạn thành mã HTML, CSS và JavaScript hoạt động đầy đủ.

### ✨ Tính năng chính

- 🎨 **Tạo trang web từ mô tả** - Chỉ cần nhập mô tả, Gemini sẽ tạo mã nguồn
- 🔄 **Chỉnh sửa trang web** - Dễ dàng thay đổi trang web đã tạo bằng cách mô tả thay đổi
- 💾 **Lưu trữ tự động** - Tất cả trang web được lưu trữ để sử dụng lại sau này
- 📱 **Xem trước đa thiết bị** - Kiểm tra trang web trên desktop, tablet và mobile
- 🖼️ **Hỗ trợ Canvas** - Tạo đồ họa và animation 2D
- 🌐 **Hỗ trợ Three.js** - Tạo đồ họa 3D ấn tượng

## 🛠️ Cài đặt

### Yêu cầu

- Node.js (phiên bản 16.x trở lên)
- NPM hoặc Yarn
- Google API Key cho Gemini API

### Các bước cài đặt

1. **Clone repository**

```bash
git clone https://github.com/TuanAnhCompany/geminisite.git
cd geminisite
```

2. **Cài đặt các gói phụ thuộc**

```bash
npm install
```

3. **Tạo file .env**

Tạo file `.env` trong thư mục gốc của dự án và thêm API key của bạn:

```
GOOGLE_API_KEY=your_gemini_api_key_here
```

4. **Xây dựng ứng dụng**

```bash
npm run build
```

5. **Khởi động server**

```bash
npm start
```

6. **Truy cập ứng dụng**

Mở trình duyệt và truy cập `http://localhost:3000`

## 📝 Hướng dẫn sử dụng

### Tạo trang web mới

1. Chọn tab "Thiết kế" và chế độ "Tạo mới"
2. Nhập mô tả chi tiết về trang web bạn muốn tạo
3. Nhấn nút "Tạo trang web"
4. Đợi vài giây để Gemini tạo mã nguồn
5. Xem kết quả trong tab "Xem trước"

### Chỉnh sửa trang web

1. Chọn tab "Thiết kế" và chế độ "Chỉnh sửa"
2. Nhập mô tả về các thay đổi bạn muốn thực hiện
3. Nhấn nút "Chỉnh sửa trang web"
4. Xem kết quả trong tab "Xem trước"

### Quản lý trang web đã lưu

1. Chọn tab "Đã lưu" để xem danh sách trang web
2. Nhấn "Xem" để xem trang web
3. Nhấn "Chỉnh sửa" để tiếp tục chỉnh sửa trang web
4. Nhấn "Xóa" để xóa trang web

## 🧩 Ví dụ prompt

- "Tạo một trang web giới thiệu về công ty công nghệ với màu chủ đạo là xanh dương và trắng, có phần header, giới thiệu, dịch vụ, đội ngũ và liên hệ"
- "Tạo một trang web với đồ họa 3D hiển thị một quả địa cầu xoay tròn với hiệu ứng sáng"
- "Tạo một trang web sử dụng Canvas để vẽ biểu đồ dạng cột hiển thị dữ liệu bán hàng theo quý"

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Nếu bạn muốn đóng góp, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 👨‍💻 Tác giả

**Tuấn Anh Company**

- GitHub: [@TuanAnhCompany](https://github.com/TuanAnhCompany)
- Website: [tuananhtricker.blogspot.com](https://tuananhtricker.blogspot.com/)
- Telegram: [@TuanAnhCompanyOffical](https://t.me/TuanAnhCompanyOffical)
- Tên thật: Tuấn Anh

## 🙏 Lời cảm ơn

- Google Gemini API cho khả năng tạo mã nguồn
- Cộng đồng mã nguồn mở cho các thư viện và công cụ tuyệt vời

---

<div align="center">
  <p>© 2025 Tuấn Anh Company. All rights reserved.</p>
</div> 