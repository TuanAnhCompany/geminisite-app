import React, { forwardRef, useEffect, useState } from 'react';

interface PreviewProps {
  code: {
    html: string;
    css: string;
    js: string;
  };
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const Preview = forwardRef<HTMLIFrameElement, PreviewProps>(({ code }, ref) => {
  const { html, css, js } = code;
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isLoading, setIsLoading] = useState(true);

  const deviceSizes = {
    desktop: { width: '100%', height: '700px' },
    tablet: { width: '768px', height: '700px' },
    mobile: { width: '375px', height: '700px' }
  };

  useEffect(() => {
    setIsLoading(true);
    const iframe = ref as React.RefObject<HTMLIFrameElement>;
    if (iframe.current) {
      const iframeDoc = iframe.current.contentDocument || iframe.current.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        
        // Thêm các thư viện phổ biến để hỗ trợ canvas và three.js
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Tuấn Anh Company - GeminiSite Preview</title>
              <!-- Thêm các thư viện phổ biến -->
              <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r159/three.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js"></script>
              <script src="https://unpkg.com/@react-three/fiber@8.15.12/dist/react-three-fiber.cjs.production.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/controls/OrbitControls.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/loaders/GLTFLoader.js"></script>
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
                .canvas-container, .threejs-container {
                  width: 100%;
                  position: relative;
                  overflow: hidden;
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
                
                // Hàm kiểm tra hỗ trợ WebGL
                function checkWebGLSupport() {
                  try {
                    const canvas = document.createElement('canvas');
                    return !!(window.WebGLRenderingContext && 
                      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
                  } catch (e) {
                    return false;
                  }
                }
                
                // Kiểm tra WebGL và hiển thị thông báo nếu không hỗ trợ
                if (!checkWebGLSupport()) {
                  const warning = document.createElement('div');
                  warning.style.backgroundColor = '#fff3cd';
                  warning.style.color = '#856404';
                  warning.style.padding = '10px';
                  warning.style.margin = '10px 0';
                  warning.style.borderRadius = '4px';
                  warning.style.border = '1px solid #ffeeba';
                  warning.innerHTML = 'Trình duyệt của bạn không hỗ trợ WebGL, cần thiết để hiển thị nội dung 3D.';
                  document.body.prepend(warning);
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

    // Lắng nghe thông báo từ iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'preview-loaded') {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Timeout để đảm bảo không bị kẹt ở loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [code, ref]);

  return (
    <div className="preview-wrapper">
      <div className="preview-controls">
        <div className="device-switcher">
          <button 
            className={`device-btn ${deviceType === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceType('desktop')}
            title="Desktop"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/>
            </svg>
          </button>
          <button 
            className={`device-btn ${deviceType === 'tablet' ? 'active' : ''}`}
            onClick={() => setDeviceType('tablet')}
            title="Tablet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
              <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </button>
          <button 
            className={`device-btn ${deviceType === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceType('mobile')}
            title="Mobile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
              <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </button>
        </div>
      </div>
      <div 
        className="preview-iframe-container"
        style={{ 
          width: deviceSizes[deviceType].width,
          height: deviceSizes[deviceType].height,
          margin: deviceType !== 'desktop' ? '0 auto' : undefined,
          transition: 'width 0.3s ease',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="loading" style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '50%',
                borderTop: '4px solid #0ea5e9',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div>Đang tải trang xem trước...</div>
            </div>
          </div>
        )}
        <iframe
          ref={ref}
          title="Preview"
          className="preview-iframe"
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="fullscreen; accelerometer; camera; gyroscope"
        />
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview; 