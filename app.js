const { app, BrowserWindow, ipcMain } = require('electron');
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
const socket = require('socket.io-client')('http://192.168.0.100:5000');

let interval;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Change to true with preload.js setup
        }
    });
    win.removeMenu();
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on("start-share", (event) => {
    console.log("Received start-share event");

    const uuid = uuidv4();
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(() => {
        screenshot().then((img) => {
            const imgStr = Buffer.from(img).toString('base64');
            const obj = {
                room: uuid,
                image: imgStr
            };
            socket.emit("screen-data", JSON.stringify(obj));
        }).catch(err => {
            console.error("Screenshot error: ", err);
        });
    }, 100);
});

ipcMain.on("stop-share", () => {
    console.log("Received stop-share event");
    clearInterval(interval);
});
