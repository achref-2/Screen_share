# Screen share

A desktop app built with Electron that shares your screen in near real time. When you click "Start", it creates a room code, takes a screenshot every 100 ms and streams it as base64 images over Socket.IO, so a viewer who joins the same room can watch.

## How it works

- `app.js` (Electron main process) generates a room ID with `uuid`, joins the room on the Socket.IO server and starts a timer that captures the screen with `screenshot-desktop`
- Each frame is sent as a `screen-data` event with the room ID and the image
- `index.js` (renderer) shows the room code and the start and stop buttons, and talks to the main process over IPC
- "Stop" clears the timer

**Stack:** Electron, Node.js, Socket.IO client, `screenshot-desktop`, `uuid`

This repository is the sharing client. It expects a Socket.IO relay server at the address set at the top of `app.js` (currently `http://192.168.0.100:5000`), which forwards each room's frames to its viewers.

## Run it

```bash
npm install
npm install screenshot-desktop   # used by app.js but not yet listed in package.json
npm start
```

## Ideas for later

- Send only changed regions, or encode frames as video with WebRTC, to save bandwidth
- Move to `contextIsolation: true` with a preload script

---

Built by Achraf Aroua · [Portfolio](https://achref-2.github.io)
