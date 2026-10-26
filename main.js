const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) { app.quit(); }

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200, height: 800, minWidth: 380, minHeight: 600,
    title: 'ELIOT-DISTRIBUTORS',
    icon: path.join(__dirname, 'icons', 'icon-512.png'),
    backgroundColor: '#4338ca',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));

  // WhatsApp, SMS, phone and web links open outside the app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^(https?|sms|tel|mailto):/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) {
      e.preventDefault();
      if (/^(https?|sms|tel|mailto):/i.test(url)) shell.openExternal(url);
    }
  });
}

app.whenReady().then(createWindow);
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => app.quit());
