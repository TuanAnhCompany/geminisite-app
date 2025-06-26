import { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';

type GeneratedCode = {
  id?: string;
  html: string;
  css: string;
  js: string;
};

type Website = {
  id: string;
  title: string;
  prompt: string;
  originalPrompt?: string;
  editPrompt?: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
  updatedAt?: string;
};

// Styles mới để đảm bảo thay đổi rõ ràng
const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
  },
  contentArea: {
    backgroundColor: '#f8fafc',
    padding: '2rem 0',
  },
  tabs: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  promptSection: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#0f172a',
  },
  previewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem',
  },
  buttonPrimary: {
    backgroundColor: '#0ea5e9',
    color: 'white',
    borderRadius: '0.5rem',
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#0f172a',
    borderRadius: '0.5rem',
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    border: '1px solid #e2e8f0',
  },
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [previousPrompt, setPreviousPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [currentTab, setCurrentTab] = useState<'prompt' | 'preview' | 'saved'>('prompt');
  const [savedWebsites, setSavedWebsites] = useState<Website[]>([]);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Thêm effect để đảm bảo font được load
  useEffect(() => {
    // Thêm font Inter vào document
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Thêm style trực tiếp vào body
    document.body.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Tải danh sách websites đã lưu
    fetchSavedWebsites();
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Hàm lấy danh sách websites đã lưu
  const fetchSavedWebsites = async () => {
    try {
      setIsLoadingWebsites(true);
      const response = await fetch('/api/websites');
      if (!response.ok) {
        throw new Error('Không thể tải danh sách websites');
      }
      const data = await response.json();
      setSavedWebsites(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách websites:', error);
      toast.error('Không thể tải danh sách websites');
    } finally {
      setIsLoadingWebsites(false);
    }
  };

  // Hàm lấy thông tin một website cụ thể
  const fetchWebsite = async (id: string) => {
    try {
      setIsGenerating(true);
      const response = await fetch(`/api/websites/${id}`);
      if (!response.ok) {
        throw new Error('Không thể tải thông tin website');
      }
      const data = await response.json();
      setGeneratedCode({
        id: data.id,
        html: data.html,
        css: data.css,
        js: data.js
      });
      setPreviousPrompt(data.prompt || data.originalPrompt || '');
      setSelectedWebsiteId(data.id);
      setCurrentTab('preview');
    } catch (error) {
      console.error('Lỗi khi tải thông tin website:', error);
      toast.error('Không thể tải thông tin website');
    } finally {
      setIsGenerating(false);
    }
  };

  // Hàm xóa một website
  const deleteWebsite = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa website này không?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Không thể xóa website');
      }
      
      toast.success('Đã xóa website thành công');
      fetchSavedWebsites();
      
      // Nếu đang xem website bị xóa, quay về tab prompt
      if (selectedWebsiteId === id) {
        setSelectedWebsiteId(null);
        setGeneratedCode(null);
        setCurrentTab('prompt');
      }
    } catch (error) {
      console.error('Lỗi khi xóa website:', error);
      toast.error('Không thể xóa website');
    }
  };

  const handleGenerate = async () => {
    // Kiểm tra nếu không có prompt
    if ((!prompt.trim() && !isEditing) || (isEditing && !editPrompt.trim())) {
      toast.error('Vui lòng nhập mô tả về ứng dụng web bạn muốn tạo!');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Xác định endpoint và payload dựa vào chế độ
      const endpoint = isEditing ? '/api/edit' : '/api/generate';
      const payload = isEditing 
        ? { 
            originalPrompt: previousPrompt, 
            editPrompt: editPrompt,
            websiteId: selectedWebsiteId
          }
        : { prompt };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi tạo ứng dụng web');
      }

      const data = await response.json();
      setGeneratedCode(data);
      setSelectedWebsiteId(data.id);
      
      // Lưu prompt hiện tại để sử dụng cho việc chỉnh sửa sau này
      if (!isEditing) {
        setPreviousPrompt(prompt);
      } else {
        // Kết hợp prompt gốc và prompt chỉnh sửa để tạo context mới
        setPreviousPrompt(previousPrompt + " " + editPrompt);
      }
      
      setCurrentTab('preview');
      
      const successMessage = isEditing 
        ? 'Ứng dụng web đã được chỉnh sửa thành công!' 
        : 'Ứng dụng web đã được tạo thành công!';
      toast.success(successMessage);
      
      // Cập nhật danh sách websites
      fetchSavedWebsites();
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo ứng dụng web');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    if (previewRef.current && generatedCode) {
      const { current: iframe } = previewRef;
      const { html, css, js } = generatedCode;
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        
        // Combine HTML, CSS, and JS
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Tuấn Anh Company - GeminiSite Preview</title>
              <!-- Thêm các thư viện phổ biến -->
              <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r159/three.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js"></script>
              <style>
                /* Reset CSS */
                *, *::before, *::after {
                  box-sizing: border-box;
                }
                body {
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  overflow-x: hidden;
                }
                canvas {
                  display: block;
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: auto;
                }
                ${css || ''}
              </style>
            </head>
            <body>
              ${html || ''}
              <script>
                // Hàm để báo hiệu đã load xong
                function notifyLoaded() {
                  try {
                    window.parent.postMessage('preview-loaded', '*');
                  } catch (e) {
                    console.error('Không thể gửi thông báo đến parent:', e);
                  }
                }
                
                // Wrapper để bắt lỗi
                try {
                  ${js || ''}
                  
                  // Thông báo đã load xong sau khi script chạy
                  if (window.addEventListener) {
                    window.addEventListener('load', function() {
                      notifyLoaded();
                    });
                  }
                  
                  // Backup nếu sự kiện load không được kích hoạt
                  setTimeout(notifyLoaded, 1000);
                } catch (error) {
                  console.error('Error in preview:', error);
                  document.body.innerHTML += '<div style="color: red; padding: 20px; background: #ffeeee; border: 1px solid #ff0000; margin: 20px;">Lỗi khi chạy JavaScript: ' + error.message + '</div>';
                  notifyLoaded();
                }
              </script>
            </body>
          </html>
        `;
        
        iframeDoc.write(fullHTML);
        iframeDoc.close();
      }
    }
  };

  const handleEditWebsite = (website: Website) => {
    setIsEditing(true);
    setPreviousPrompt(website.prompt || website.originalPrompt || '');
    setEditPrompt('');
    setSelectedWebsiteId(website.id);
    setGeneratedCode({
      id: website.id,
      html: website.html,
      css: website.css,
      js: website.js
    });
    setCurrentTab('prompt');
  };

  return (
    <div className="app" style={styles.app}>
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      
      <div className="tabs" style={styles.tabs}>
        <div className="container">
          <button 
            className={`tab ${currentTab === 'prompt' ? 'active' : ''}`}
            onClick={() => setCurrentTab('prompt')}
          >
            Thiết kế
          </button>
          <button 
            className={`tab ${currentTab === 'preview' ? 'active' : ''}`}
            onClick={() => setCurrentTab('preview')}
            disabled={!generatedCode}
          >
            Xem trước
          </button>
          <button 
            className={`tab ${currentTab === 'saved' ? 'active' : ''}`}
            onClick={() => setCurrentTab('saved')}
          >
            Đã lưu
          </button>
        </div>
      </div>

      <div className="content-area" style={styles.contentArea}>
        <main className="container">
          {currentTab === 'prompt' ? (
            <div className="prompt-section" style={styles.promptSection}>
              <div className="mode-toggle">
                <button 
                  className={`mode-btn ${!isEditing ? 'active' : ''}`} 
                  onClick={() => setIsEditing(false)}
                >
                  Tạo mới
                </button>
                <button 
                  className={`mode-btn ${isEditing ? 'active' : ''}`} 
                  onClick={() => setIsEditing(true)}
                  disabled={!generatedCode}
                >
                  Chỉnh sửa
                </button>
              </div>
              <h1 style={styles.heading}>{isEditing ? 'Chỉnh Sửa' : 'Tạo'} Ứng Dụng Web với Gemini 2.5 Flash</h1>
              
              {!isEditing ? (
                <>
                  <p className="description">
                    Mô tả chi tiết ứng dụng web bạn muốn tạo. Bạn càng cung cấp nhiều chi tiết, kết quả càng tốt.
                  </p>
                  
                  <div className="features-highlight">
                    <h3>Tính năng mới:</h3>
                    <ul>
                      <li><strong>Hỗ trợ Canvas:</strong> Tạo đồ họa và animation 2D.</li>
                      <li><strong>Hỗ trợ Three.js:</strong> Tạo đồ họa 3D ấn tượng.</li>
                      <li><strong>Tương thích nhiều thiết bị:</strong> Hiển thị tốt trên desktop, tablet và mobile.</li>
                    </ul>
                    <p className="example-prompt">Ví dụ: "Tạo một trang web với đồ họa 3D hiển thị một quả địa cầu xoay tròn với hiệu ứng sáng"</p>
                  </div>

                  <div className="prompt-input">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Nhập mô tả chi tiết về ứng dụng web bạn muốn tạo..."
                      className="prompt-textarea"
                      rows={8}
                      disabled={isGenerating}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="description">
                    Nhập thay đổi bạn muốn thực hiện cho trang web hiện tại.
                  </p>
                  
                  <div className="features-highlight">
                    <h3>Gợi ý chỉnh sửa:</h3>
                    <ul>
                      <li><strong>Thêm đồ họa:</strong> "Thêm một mô hình 3D quay tròn ở góc trang web"</li>
                      <li><strong>Thêm Canvas:</strong> "Vẽ một biểu đồ dạng cột bằng Canvas API"</li>
                      <li><strong>Thay đổi phong cách:</strong> "Thay đổi màu sắc thành tông xanh dương"</li>
                    </ul>
                  </div>
                  
                  <div className="edit-info">
                    <div className="original-prompt-container">
                      <h4>Prompt gốc:</h4>
                      <div className="original-prompt">
                        {previousPrompt || 'Chưa có prompt gốc'}
                      </div>
                    </div>

                    <div className="prompt-input">
                      <textarea
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Nhập các thay đổi bạn muốn thực hiện..."
                        className="prompt-textarea"
                        rows={6}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="actions">
                <button 
                  className="button btn-primary"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Đang xử lý...' : isEditing ? 'Chỉnh sửa trang web' : 'Tạo trang web'}
                </button>
              </div>
            </div>
          ) : currentTab === 'preview' ? (
            <>
              {generatedCode ? (
                <div className="preview-container" style={styles.previewContainer}>
                  <h2>Xem trước trang web</h2>
                  <Preview code={generatedCode} ref={previewRef} />
                  
                  <div className="code-editors">
                    <CodeEditor title="HTML" language="html" value={generatedCode.html} />
                    <CodeEditor title="CSS" language="css" value={generatedCode.css} />
                    <CodeEditor title="JavaScript" language="javascript" value={generatedCode.js} />
                  </div>
                  
                  <div className="actions">
                    <button 
                      className="button btn-secondary"
                      onClick={handleRefresh}
                    >
                      Làm mới
                    </button>
                    <button 
                      className="button btn-primary"
                      onClick={() => {
                        setIsEditing(true);
                        setEditPrompt('');
                        setCurrentTab('prompt');
                      }}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Chưa có trang web nào được tạo. Vui lòng tạo một trang web mới.</p>
                  <button 
                    className="button btn-primary"
                    onClick={() => setCurrentTab('prompt')}
                  >
                    Tạo trang web mới
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="saved-websites" style={styles.promptSection}>
              <h2>Trang web đã lưu</h2>
              
              {isLoadingWebsites ? (
                <div className="loading-state">
                  <div className="loading"></div>
                  <p>Đang tải danh sách trang web...</p>
                </div>
              ) : savedWebsites.length > 0 ? (
                <div className="websites-list">
                  {savedWebsites.map(website => (
                    <div className="website-item" key={website.id}>
                      <div className="website-info">
                        <h3>{website.title}</h3>
                        <p className="prompt">{website.prompt}</p>
                        <p className="date">Tạo lúc: {new Date(website.createdAt).toLocaleString()}</p>
                        {website.updatedAt && (
                          <p className="date">Cập nhật lúc: {new Date(website.updatedAt).toLocaleString()}</p>
                        )}
                      </div>
                      <div className="website-actions">
                        <button 
                          className="button btn-secondary"
                          onClick={() => fetchWebsite(website.id)}
                        >
                          Xem
                        </button>
                        <button 
                          className="button btn-primary"
                          onClick={() => handleEditWebsite(website)}
                        >
                          Chỉnh sửa
                        </button>
                        <button 
                          className="button btn-danger"
                          onClick={() => deleteWebsite(website.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Chưa có trang web nào được lưu.</p>
                  <button 
                    className="button btn-primary"
                    onClick={() => setCurrentTab('prompt')}
                  >
                    Tạo trang web mới
                  </button>
                </div>
              )}
              
              <div className="actions">
                <button 
                  className="button btn-secondary"
                  onClick={fetchSavedWebsites}
                >
                  Làm mới danh sách
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App; 