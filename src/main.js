const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fromFile } = require('./speech');
const { fetchOpenAI } = require('./openai');
require('dotenv').config();

/**
 * Create the main application window.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html')).catch(err => {
    console.error('Failed to load index.html:', err);
  });

  // Listen for STT response events and send them to the renderer process
  ipcMain.on('stt-response', (event, response) => {
    win.webContents.send('stt-response', response);
  });
}

// Create the window when the app is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Create a window if the app is activated and no other windows are open (macOS specific)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Listen for request-response events and handle them with OpenAI API calls
ipcMain.on('request-response', async (event, userInput) => {
  try {
    const response = await fetchOpenAI(userInput);
    event.reply('response-openai', response);
  } catch (error) {
    console.error('Error calling the OpenAI API', error);
    event.reply('response-openai', 'Error obtaining response');
  }
});

// Listen for start-stt events and start the speech-to-text process
ipcMain.on('start-stt', async (event) => {
  fromFile();
});
