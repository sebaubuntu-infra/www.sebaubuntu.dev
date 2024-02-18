//
// SPDX-FileCopyrightText: 2023-2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

let ASSETS_URL = "assets/downloads";
let DEVICES_JSON_URL = `${ASSETS_URL}/devices.json`;
let DEVICE_IMAGES_URL = `${ASSETS_URL}/images`;
let DEVICE_IMAGES_URL_OFFICIAL = "https://wiki.lineageos.org/images/devices/";
let DOWNLOADS_URL = "https://lineage.sebaubuntu.dev";
let DOWNLOADS_URL_OFFICIAL = "https://download.lineageos.org";

let devicesListElement = document.getElementById("devices-list");
let deviceInfoElement = document.getElementById("device-info-tab");
let deviceImageElement = document.getElementById("device-image-tab");

let devices = [];

/**
 * Class representing a SoC.
 */
class SoC {
	constructor(codename, vendor, model) {
		this.codename = codename;
		this.vendor = vendor;
		this.model = model;
	}

	static fromJSON(json) {
		return new SoC(
			json.codename,
			json.vendor,
			json.model,
		);
	}
}

/**
 * Class representing a display.
 */
class Display {
	constructor(height, width, refreshRate) {
		this.height = height;
		this.width = width;
		this.refreshRate = refreshRate;
	}

	static fromJSON(json) {
		return new Display(
			json.height,
			json.width,
			json.refreshRate,
		);
	}
}

/**
 * Class representing a device.
 */
class Device {
	constructor(
		codename,
		manufacturer,
		model,
		releaseDate,
		soc,
		display,
		official,
	) {
		this.codename = codename;
		this.manufacturer = manufacturer;
		this.model = model;
		this.releaseDate = releaseDate;
		this.soc = soc;
		this.display = display;
		this.official = official;
	}

	getImageUrl() {
		if (this.official == true) {
			return `${DEVICE_IMAGES_URL_OFFICIAL}/${this.codename}.png`;
		} else {
			return `${DEVICE_IMAGES_URL}/${this.codename}.png`;
		}
	}

	getDownloadUrl() {
		if (this.official == true) {
			return `${DOWNLOADS_URL_OFFICIAL}/${this.codename}`;
		} else {
			return `${DOWNLOADS_URL}/${this.codename}`;
		}
	}

	static fromJSON(json) {
		return new Device(
			json.codename,
			json.manufacturer,
			json.model,
			json.releaseDate,
			SoC.fromJSON(json.soc),
			Display.fromJSON(json.display),
			json.official,
		);
	}
}

function updateDeviceInfo(codename) {
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

	deviceImageElement.innerHTML = `<img src="${device.getImageUrl()}"></img>`;

	let activeBoxes = document.getElementsByClassName("device-active");
	for (let deviceBox of activeBoxes) {
		deviceBox.setAttribute("class", "device-not-active");
	}

	let deviceBox = document.getElementById(`device-${device.codename}`);
	deviceBox.setAttribute("class", "device-active");
}

async function main() {
	let response = await fetch(DEVICES_JSON_URL);
	if (!response.ok) {
		devicesListElement.innerHTML = "<p>Error fetching devices list</p>";
		return;
	}

	let devicesJson = await response.json();

	if (devicesJson == null) {
		devicesListElement.innerHTML = "<p>Error fetching devices list</p>";
		return;
	}

	if (devicesJson.length == 0) {
		devicesListElement.innerHTML = "<p>No devices found</p>";
		return;
	}

	devices = [];
	devicesJson.forEach(device => {
		devices.push(Device.fromJSON(device));
	});

	devicesListElement.innerHTML = "<h1>Devices</h1>";

	devices.forEach(device => {
		devicesListElement.innerHTML += `
			<div class="device-not-active" id="device-${device.codename}" onclick="updateDeviceInfo('${device.codename}')">
				<div style="display:inline-block;">
					<p>${device.model}</p>
					<p>${device.codename}</p>
				</div>
			</div>
			<br>
		`;
	});
}

main();
