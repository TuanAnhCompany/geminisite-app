# 🚀 GeminiSite

<div align="center">
  <img src="public/logo.svg" alt="GeminiSite Logo" width="200">
  <h2>Tạo trang web từ mô tả bằng Gemini 2.5 Flash</h2>
  <p align="center">
    <a href="https://github.com/TuanAnhCompany/geminisite-app/stargazers"><img src="https://img.shields.io/github/stars/TuanAnhCompany/geminisite-app?style=flat-square&color=yellow" alt="Stars Badge"/></a>
    <a href="https://github.com/TuanAnhCompany/geminisite-app/network/members"><img src="https://img.shields.io/github/forks/TuanAnhCompany/geminisite-app?style=flat-square&color=blue" alt="Forks Badge"/></a>
    <a href="https://github.com/TuanAnhCompany/geminisite-app/pulls"><img src="https://img.shields.io/github/issues-pr/TuanAnhCompany/geminisite-app?style=flat-square&color=red" alt="Pull Requests Badge"/></a>
    <a href="https://github.com/TuanAnhCompany/geminisite-app/issues"><img src="https://img.shields.io/github/issues/TuanAnhCompany/geminisite-app?style=flat-square&color=green" alt="Issues Badge"/></a>
    <a href="https://github.com/TuanAnhCompany/geminisite-app/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TuanAnhCompany/geminisite-app?style=flat-square&color=purple" alt="License Badge"/></a>
  </p>
  <p><b>Phát triển bởi <a href="https://github.com/TuanAnhCompany">Tuấn Anh Company</a></b></p>
  <p>
    <a href="#demo">Xem Demo</a> •
    <a href="#tính-năng-chính">Tính Năng</a> •
    <a href="#cài-đặt">Cài Đặt</a> •
    <a href="#hướng-dẫn-sử-dụng">Hướng Dẫn</a> •
    <a href="#đóng-góp">Đóng Góp</a> •
    <a href="#giấy-phép">Giấy Phép</a>
  </p>
  
</div>

## 📋 Giới thiệu

**GeminiSite** là một ứng dụng web tiên tiến cho phép bạn tạo trang web hoàn chỉnh chỉ bằng cách mô tả ý tưởng của mình bằng ngôn ngữ tự nhiên. Sử dụng sức mạnh của **Google Gemini 2.5 Flash**, ứng dụng sẽ biến mô tả của bạn thành mã HTML, CSS và JavaScript hoạt động đầy đủ trong vài giây.

<p align="center">
  <a href="#" id="demo">
    <img src="https://i.ibb.co/n865BNNH/image.png" alt="GeminiSite Demo" width="70%">
  </a>
</p>

## ✨ Tính năng chính

<table>
  <tr>
    <td width="50%">
      <h3>🎨 Tạo trang web từ mô tả</h3>
      <p>Chỉ cần nhập mô tả chi tiết, Gemini sẽ tự động tạo mã nguồn hoàn chỉnh cho trang web của bạn.</p>
    </td>
    <td width="50%">
      <h3>🔄 Chỉnh sửa trang web</h3>
      <p>Dễ dàng thay đổi trang web đã tạo bằng cách mô tả các thay đổi bạn muốn thực hiện.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>💾 Lưu trữ tự động</h3>
      <p>Tất cả trang web được lưu trữ tự động để bạn có thể truy cập và sử dụng lại sau này.</p>
    </td>
    <td width="50%">
      <h3>📱 Xem trước đa thiết bị</h3>
      <p>Kiểm tra trang web của bạn trên desktop, tablet và mobile một cách dễ dàng.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🖼️ Hỗ trợ Canvas</h3>
      <p>Tạo đồ họa và animation 2D ấn tượng với Canvas API được tích hợp sẵn.</p>
    </td>
    <td width="50%">
      <h3>🌐 Hỗ trợ Three.js</h3>
      <p>Tạo đồ họa 3D ấn tượng với Three.js được tích hợp sẵn trong ứng dụng.</p>
    </td>
  </tr>
</table>

## 🛠️ Cài đặt

### Yêu cầu

- Node.js (phiên bản 16.x trở lên)
- NPM hoặc Yarn
- Google API Key cho Gemini API

### Các bước cài đặt

1. **Clone repository**

```bash
git clone https://github.com/TuanAnhCompany/geminisite-app.git
cd geminisite-app
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

<details>
  <summary><b>Tạo trang web mới</b></summary>
  <ol>
    <li>Chọn tab "Thiết kế" và chế độ "Tạo mới"</li>
    <li>Nhập mô tả chi tiết về trang web bạn muốn tạo</li>
    <li>Nhấn nút "Tạo trang web"</li>
    <li>Đợi vài giây để Gemini tạo mã nguồn</li>
    <li>Xem kết quả trong tab "Xem trước"</li>
  </ol>
</details>

<details>
  <summary><b>Chỉnh sửa trang web</b></summary>
  <ol>
    <li>Chọn tab "Thiết kế" và chế độ "Chỉnh sửa"</li>
    <li>Nhập mô tả về các thay đổi bạn muốn thực hiện</li>
    <li>Nhấn nút "Chỉnh sửa trang web"</li>
    <li>Xem kết quả trong tab "Xem trước"</li>
  </ol>
</details>

<details>
  <summary><b>Quản lý trang web đã lưu</b></summary>
  <ol>
    <li>Chọn tab "Đã lưu" để xem danh sách trang web</li>
    <li>Nhấn "Xem" để xem trang web</li>
    <li>Nhấn "Chỉnh sửa" để tiếp tục chỉnh sửa trang web</li>
    <li>Nhấn "Xóa" để xóa trang web</li>
  </ol>
</details>

## 🧩 Ví dụ prompt

<table>
  <tr>
    <td>
      <code>"Tạo một trang web giới thiệu về công ty công nghệ với màu chủ đạo là xanh dương và trắng, có phần header, giới thiệu, dịch vụ, đội ngũ và liên hệ"</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>"Tạo một trang web với đồ họa 3D hiển thị một quả địa cầu xoay tròn với hiệu ứng sáng"</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>"Tạo một trang web sử dụng Canvas để vẽ biểu đồ dạng cột hiển thị dữ liệu bán hàng theo quý"</code>
    </td>
  </tr>
</table>

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Nếu bạn muốn đóng góp, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file [`LICENSE`](LICENSE) để biết thêm thông tin.

## 👨‍💻 Tác giả

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/TuanAnhCompany" alt="Tuấn Anh Tricker" width="150" style="border-radius:50%">
</p>

<div align="center">
  <h3>Tuấn Anh Company</h3>
  <p>
    <a href="https://github.com/TuanAnhCompany"><img src="https://img.shields.io/badge/GitHub-TuanAnhCompany-181717?style=for-the-badge&logo=github" alt="GitHub"></a>
    <a href="https://tuananhtricker.blogspot.com/"><img src="https://img.shields.io/badge/Blog-tuananhtricker-FF5722?style=for-the-badge&logo=blogger" alt="Website"></a>
    <a href="https://t.me/TuanAnhCompanyOffical"><img src="https://img.shields.io/badge/Telegram-TuanAnhCompanyOffical-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram"></a>
  </p>
</div>

## 🙏 Lời cảm ơn

- Google Gemini API cho khả năng tạo mã nguồn
- Cộng đồng mã nguồn mở cho các thư viện và công cụ tuyệt vời
- Tất cả những người đã đóng góp ý tưởng và phản hồi

---

<div align="center">
  <p>© 2025 Tuấn Anh Company. All rights reserved.</p>
  <p>
    <a href="https://github.com/TuanAnhCompany/geminisite-app/stargazers">⭐ Star GeminiSite</a> •
    <a href="https://github.com/TuanAnhCompany/geminisite-app/issues">🐛 Báo cáo lỗi</a> •
    <a href="https://github.com/TuanAnhCompany/geminisite-app/discussions">💬 Thảo luận</a>
  </p>
</div> 
