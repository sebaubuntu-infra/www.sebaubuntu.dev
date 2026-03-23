//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import Device from "./Device.js";

const devicesListElement = document.getElementById("devices-list");
const deviceInfoElement = document.getElementById("device-info-tab");
const deviceImageElement = document.getElementById("device-image-tab");

/**
 * @type {Device[]}
 */
let devices = [];

function updateDeviceInfo(codename) {
    let selectedButton = document.getElementById(`device-${codename}`);
    if (!selectedButton || selectedButton.variant === "filled") {
        return;
    }

    let buttons = document.getElementsByClassName("device-button");
    for (let button of buttons) {
        button.variant = "";
    }

    selectedButton.variant = "filled";

    let device = devices.find(device => device.codename == codename);
    if (device == null) {
        return;
    }

    deviceInfoElement.innerHTML = `
        <h1>${device.manufacturer} ${device.model}</h1>
        <h2>Codename: ${device.codename}</h2>
        <h3>Release date: ${device.releaseDate}</h3>
        <h3>CPU: ${device.soc.vendor} ${device.soc.model} (<span style="font-family:monospace;">${device.soc.codename}</span>)</h3>
        <h3>Display: ${device.display.height}x${device.display.width}@${device.display.refreshRate}hz</h3>
        <br>
        <h2>Downloads</h2>
        <h3><a href="${device.getDownloadUrl()}">LineageOS</a></h3>
    `;

    deviceImageElement.innerHTML = `<img src="${device.getImageUrl()}" alt="${device.model}">`;
}

async function main() {
    devicesListElement.innerHTML = "<h1>Devices</h1>";

    devices = await Device.getDevices();
    if (!devices) {
        devicesListElement.innerHTML += "<h2>Failed to load devices.</h2>";
        return;
    }

    devices.forEach(device => {
        const deviceElement = document.createElement("mdui-card");
        deviceElement.id = `device-${device.codename}`;
        deviceElement.className = "device-button";
        deviceElement.clickable = true;
        deviceElement.innerHTML = `
            <div style="display:inline-block;">
                <p>${device.model}</p>
                <p>${device.codename}</p>
            </div>
        `;

        deviceElement.addEventListener("click", () => {
            updateDeviceInfo(device.codename);
        });

        devicesListElement.appendChild(deviceElement);
    });
}

main();
