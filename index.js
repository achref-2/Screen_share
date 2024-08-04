const { ipcRenderer } = require('electron');

window.onload = function() {
    ipcRenderer.on("uuid", (event, data) => {
        document.getElementById("code").innerHTML = data;
    });

    ipcRenderer.on("screen-data", (event, data) => {
        const obj = JSON.parse(data);
        if (obj && obj.image) {
            const imgElement = document.getElementById("screenshot");
            imgElement.src = `data:image/png;base64,${obj.image}`;
        }
    });
}

function startShare() {
    console.log("Start Share button clicked");
    ipcRenderer.send("start-share", {});
    document.getElementById("start").style.display = "none";
    document.getElementById("stop").style.display = "block";
}

function stopShare() {
    console.log("Stop Share button clicked");
    ipcRenderer.send("stop-share", {});
    document.getElementById("stop").style.display = "none";
    document.getElementById("start").style.display = "block";
}
