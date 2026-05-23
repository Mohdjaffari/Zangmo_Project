const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'Zangmo POS Terminal',
    autoHideMenuBar: true, // Kiosk / POS style clean layout
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Check if we are running in development mode
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // Load local Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in dev mode
    mainWindow.webContents.openDevTools();
  } else {
    // Load compiled index.html
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler for system printers
ipcMain.handle('get-printers', async () => {
  if (!mainWindow) return [];
  try {
    return await mainWindow.webContents.getPrintersAsync();
  } catch (error) {
    console.error('Error fetching printers:', error);
    return [];
  }
});

// IPC handler for silent receipt printing
ipcMain.handle('print-receipt', async (event, options) => {
  if (!mainWindow) return { success: false, error: 'Main window not initialized' };
  
  const { printerName, htmlContent } = options;

  // Create an offscreen temporary window to render and print the receipt html
  let printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load standard receipt styling & HTML content
  const receiptHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 80mm;
            margin: 0;
            padding: 10px;
            font-size: 12px;
            color: #000;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 5px 0; }
          .flex-row { display: flex; justify-content: space-between; }
          .header-title { font-size: 16px; margin-bottom: 2px; }
          .header-subtitle { font-size: 10px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 3px 0; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Write to temporary HTML file
  const tempPath = path.join(app.getPath('temp'), 'temp-receipt.html');
  fs.writeFileSync(tempPath, receiptHTML, 'utf-8');
  
  printWindow.loadFile(tempPath);

  return new Promise((resolve) => {
    printWindow.webContents.once('did-finish-load', () => {
      printWindow.webContents.print({
        silent: true,
        printBackground: true,
        deviceName: printerName || '', // fallback to default if blank
        margins: { marginType: 'none' }
      }, (success, failureReason) => {
        // Clean up window and file
        printWindow.close();
        try { fs.unlinkSync(tempPath); } catch(e) {}
        
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: failureReason });
        }
      });
    });
  });
});
