import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

// Cấu hình môi trường
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn đến file lưu trữ
const STORAGE_DIR = path.join(__dirname, 'storage');
const WEBSITES_FILE = path.join(STORAGE_DIR, 'websites.json');

// Khởi tạo API key từ biến môi trường
const apiKey = process.env.GOOGLE_API_KEY;

// Kiểm tra API key
if (!apiKey) {
  console.error('GOOGLE_API_KEY không được cấu hình trong file .env');
  process.exit(1);
}

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// Đảm bảo thư mục storage tồn tại
async function ensureStorageExists() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(WEBSITES_FILE);
    } catch (error) {
      // File không tồn tại, tạo file mới
      await fs.writeFile(WEBSITES_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Lỗi khi tạo thư mục storage:', error);
  }
}

// Hàm để đọc dữ liệu từ file
async function readWebsites() {
  try {
    const data = await fs.readFile(WEBSITES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Lỗi khi đọc file websites.json:', error);
    return [];
  }
}

// Hàm để ghi dữ liệu vào file
async function saveWebsite(websiteData) {
  try {
    const websites = await readWebsites();
    
    // Tạo ID mới nếu chưa có
    if (!websiteData.id) {
      websiteData.id = Date.now().toString();
      websiteData.createdAt = new Date().toISOString();
      websites.push(websiteData);
    } else {
      // Cập nhật website hiện có
      const index = websites.findIndex(site => site.id === websiteData.id);
      if (index >= 0) {
        websiteData.updatedAt = new Date().toISOString();
        websites[index] = websiteData;
      } else {
        websiteData.createdAt = new Date().toISOString();
        websites.push(websiteData);
      }
    }
    
    await fs.writeFile(WEBSITES_FILE, JSON.stringify(websites, null, 2));
    return websiteData;
  } catch (error) {
    console.error('Lỗi khi lưu website:', error);
    throw error;
  }
}

// API endpoint để lấy danh sách websites
app.get('/api/websites', async (req, res) => {
  try {
    const websites = await readWebsites();
    res.json(websites);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách websites', details: error.message });
  }
});

// API endpoint để lấy một website cụ thể
app.get('/api/websites/:id', async (req, res) => {
  try {
    const websites = await readWebsites();
    const website = websites.find(site => site.id === req.params.id);
    
    if (!website) {
      return res.status(404).json({ error: 'Không tìm thấy website' });
    }
    
    res.json(website);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin website', details: error.message });
  }
});

// API endpoint để tạo ứng dụng web mới
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, modelName = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Vui lòng cung cấp prompt' });
    }

    console.log(`Đang xử lý yêu cầu với prompt: ${prompt.substring(0, 50)}...`);

    // Chuẩn bị prompt để gửi đến Gemini
    const fullPrompt = `
Bạn là một chuyên gia phát triển web. Hãy tạo một trang web hoàn chỉnh dựa trên yêu cầu sau:
"${prompt}"

Hãy cung cấp mã nguồn hoàn chỉnh của trang web trong các phần riêng biệt:
1. HTML (toàn bộ trang, bao gồm thẻ <html>, <head>, và <body>)
2. CSS (trong thẻ <style> riêng biệt)
3. JavaScript (trong thẻ <script> riêng biệt)

Đảm bảo rằng:
- Thiết kế phải responsive và hiện đại
- Mã nguồn phải sạch và được format tốt
- Trang web phải hoạt động hoàn toàn
- Bao gồm các tính năng tương tác nếu yêu cầu

QUAN TRỌNG:
- Nếu yêu cầu tạo đồ họa hoặc hiệu ứng động, ưu tiên sử dụng Canvas API hoặc Three.js
- Đối với Canvas 2D, sử dụng thẻ <canvas> với context 2D
- Đối với đồ họa 3D, sử dụng Three.js (đã được tích hợp sẵn)
- Các thư viện sau đã được tải sẵn, bạn có thể sử dụng trực tiếp:
  * Three.js phiên bản r159
  * p5.js phiên bản 1.9.0
  * Three.js OrbitControls và GLTFLoader

TRÁNH LỖI JAVASCRIPT:
- Luôn kiểm tra null/undefined trước khi gọi phương thức của một đối tượng
- Sử dụng try-catch để bắt lỗi trong quá trình thực thi
- Đảm bảo tất cả các sự kiện đều được kiểm tra trước khi gọi addEventListener
- Không sử dụng các API không được hỗ trợ rộng rãi

Vui lòng đảm bảo trang web tương thích với cả máy tính để bàn và thiết bị di động. Nếu làm đồ họa 3D, hãy luôn kiểm tra hỗ trợ WebGL.

CHỈ phản hồi với mã nguồn, KHÔNG bao gồm giải thích hoặc chú thích thêm.
`;

    // Khởi tạo mô hình
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Tạo mã nguồn từ prompt
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const textResponse = await response.text();

    // Phân tích kết quả thành các phần HTML, CSS, và JavaScript
    const htmlMatch = textResponse.match(/```html\n([\s\S]*?)\n```/);
    const cssMatch = textResponse.match(/```css\n([\s\S]*?)\n```/);
    const jsMatch = textResponse.match(/```javascript\n([\s\S]*?)\n```/);

    // Kết hợp mã nguồn thành một trang web hoàn chỉnh
    const html = htmlMatch ? htmlMatch[1] : '';
    const css = cssMatch ? cssMatch[1] : '';
    const js = jsMatch ? jsMatch[1] : '';

    // Đảm bảo đã xử lý đúng response
    const processedHtml = html.trim();
    
    // Tạo mã nguồn đầy đủ
    let fullCode = processedHtml;

    // Lưu website vào storage
    const websiteData = {
      prompt,
      html: fullCode,
      css,
      js,
      rawResponse: textResponse,
      title: `Website từ prompt: ${prompt.substring(0, 30)}...`,
      createdAt: new Date().toISOString()
    };

    const savedWebsite = await saveWebsite(websiteData);

    // Gửi kết quả về client
    res.json({
      id: savedWebsite.id,
      html: fullCode,
      css,
      js,
      rawResponse: textResponse
    });

  } catch (error) {
    console.error('Lỗi khi tạo ứng dụng web:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo ứng dụng web', details: error.message });
  }
});

// API endpoint để chỉnh sửa trang web hiện có
app.post('/api/edit', async (req, res) => {
  try {
    const { originalPrompt, editPrompt, websiteId, modelName = 'gemini-2.5-flash' } = req.body;

    if (!originalPrompt || !editPrompt) {
      return res.status(400).json({ error: 'Vui lòng cung cấp prompt gốc và prompt chỉnh sửa' });
    }

    console.log(`Đang xử lý yêu cầu với prompt: ${editPrompt.substring(0, 50)}...`);

    // Lấy dữ liệu website cũ nếu có websiteId
    let originalWebsite = null;
    if (websiteId) {
      const websites = await readWebsites();
      originalWebsite = websites.find(site => site.id === websiteId);
    }

    // Chuẩn bị prompt chỉnh sửa để gửi đến Gemini
    const fullPrompt = `
Bạn là một chuyên gia phát triển web. Trước đây, bạn đã tạo một trang web dựa trên yêu cầu:
"${originalPrompt}"

${originalWebsite ? `
Đây là mã HTML hiện tại:
\`\`\`html
${originalWebsite.html}
\`\`\`

Đây là mã CSS hiện tại:
\`\`\`css
${originalWebsite.css}
\`\`\`

Đây là mã JavaScript hiện tại:
\`\`\`javascript
${originalWebsite.js}
\`\`\`
` : ''}

Bây giờ, người dùng muốn chỉnh sửa trang web với các thay đổi sau:
"${editPrompt}"

Hãy tạo lại mã nguồn hoàn chỉnh của trang web với những thay đổi được yêu cầu. Cung cấp mã nguồn trong các phần riêng biệt:
1. HTML (toàn bộ trang, bao gồm thẻ <html>, <head>, và <body>)
2. CSS (trong thẻ <style> riêng biệt)
3. JavaScript (trong thẻ <script> riêng biệt)

Đảm bảo rằng:
- Thực hiện chính xác các thay đổi được yêu cầu
- Giữ nguyên phần còn lại của thiết kế và chức năng
- Mã nguồn vẫn sạch và được format tốt
- Trang web vẫn hoạt động hoàn toàn

QUAN TRỌNG:
- Nếu yêu cầu tạo đồ họa hoặc hiệu ứng động, ưu tiên sử dụng Canvas API hoặc Three.js
- Đối với Canvas 2D, sử dụng thẻ <canvas> với context 2D
- Đối với đồ họa 3D, sử dụng Three.js (đã được tích hợp sẵn)
- Các thư viện sau đã được tải sẵn, bạn có thể sử dụng trực tiếp:
  * Three.js phiên bản r159
  * p5.js phiên bản 1.9.0
  * Three.js OrbitControls và GLTFLoader

TRÁNH LỖI JAVASCRIPT:
- Luôn kiểm tra null/undefined trước khi gọi phương thức của một đối tượng
- Sử dụng try-catch để bắt lỗi trong quá trình thực thi
- Đảm bảo tất cả các sự kiện đều được kiểm tra trước khi gọi addEventListener
- Không sử dụng các API không được hỗ trợ rộng rãi

Vui lòng đảm bảo trang web tương thích với cả máy tính để bàn và thiết bị di động. Nếu làm đồ họa 3D, hãy luôn kiểm tra hỗ trợ WebGL.

CHỈ phản hồi với mã nguồn, KHÔNG bao gồm giải thích hoặc chú thích thêm.
`;

    // Khởi tạo mô hình
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Tạo mã nguồn từ prompt
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const textResponse = await response.text();

    // Phân tích kết quả thành các phần HTML, CSS, và JavaScript
    const htmlMatch = textResponse.match(/```html\n([\s\S]*?)\n```/);
    const cssMatch = textResponse.match(/```css\n([\s\S]*?)\n```/);
    const jsMatch = textResponse.match(/```javascript\n([\s\S]*?)\n```/);

    // Kết hợp mã nguồn thành một trang web hoàn chỉnh
    const html = htmlMatch ? htmlMatch[1] : '';
    const css = cssMatch ? cssMatch[1] : '';
    const js = jsMatch ? jsMatch[1] : '';

    // Đảm bảo đã xử lý đúng response
    const processedHtml = html.trim();
    
    // Tạo mã nguồn đầy đủ
    let fullCode = processedHtml;

    // Lưu website đã chỉnh sửa vào storage
    const combinedPrompt = `${originalPrompt} ${editPrompt}`;
    const websiteData = {
      id: websiteId || undefined,
      prompt: combinedPrompt,
      originalPrompt,
      editPrompt,
      html: fullCode,
      css,
      js,
      rawResponse: textResponse,
      title: `Website từ prompt: ${combinedPrompt.substring(0, 30)}...`,
    };

    const savedWebsite = await saveWebsite(websiteData);

    // Gửi kết quả về client
    res.json({
      id: savedWebsite.id,
      html: fullCode,
      css,
      js,
      rawResponse: textResponse
    });

  } catch (error) {
    console.error('Lỗi khi chỉnh sửa ứng dụng web:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi chỉnh sửa ứng dụng web', details: error.message });
  }
});

// API endpoint để xóa một website
app.delete('/api/websites/:id', async (req, res) => {
  try {
    const websites = await readWebsites();
    const filteredWebsites = websites.filter(site => site.id !== req.params.id);
    
    if (websites.length === filteredWebsites.length) {
      return res.status(404).json({ error: 'Không tìm thấy website' });
    }
    
    await fs.writeFile(WEBSITES_FILE, JSON.stringify(filteredWebsites, null, 2));
    res.json({ success: true, message: 'Đã xóa website thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa website', details: error.message });
  }
});

// Định tuyến tất cả các yêu cầu khác đến file index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Đảm bảo thư mục storage tồn tại trước khi khởi động server
ensureStorageExists().then(() => {
  // Khởi động server
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  });
}); 