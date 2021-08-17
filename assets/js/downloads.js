// Global variables
var BASE_URL = "https://raw.githubusercontent.com/SebaUbuntu/data/master/"
var DEVICES_DATA_URL = BASE_URL + "devices.json"
var DEVICES_BASE_URL = BASE_URL + "devices/"
var DEVICE_IMAGES_BASE_URL_OFFICIAL = "https://wiki.lineageos.org/images/devices/"
var DEVICE_IMAGES_BASE_URL_UNOFFICIAL = BASE_URL + "images/"
var DOWNLOAD_BASE_URL_OFFICIAL = "https://download.lineageos.org/"
var DOWNLOAD_BASE_URL_UNOFFICIAL = "https://files.sebaubuntu.dev/ROMs/"
var devicesData

// Functions
function getJSON(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};

function devicesDataSetup(status, devicesjson) {
	if (status != null) {
		devicesListElement.innerHTML = '<p>Error fetching devices list</p>';
	} else {
		devicesData = devicesjson
		updateDevicesList()
	}
}

function updateDevicesList() {
	var devicesListPage = '<h1>Devices</h1>'
	var devicesList = Object.keys(devicesData);
	devicesList.forEach(device => {
		var devicejson = devicesData[device]
		devicesListPage += '' +
			'<div class="device-not-active" id="' + device + '" onclick="updateDeviceInfo(' + "'" + device + "'" + ')">' +
				'<div style="display:inline-block;">' +
					'<p>' + devicejson.name + '</p>' +
					'<p>' + device + '</p>' +
				'</div>' +
			'</div>' +
			'<br>'
	});
	devicesListElement.innerHTML = devicesListPage;
}

function updateDeviceInfo(device) {
	var deviceData = devicesData[device];
	var deviceInfoPage = '' +
		'<h1>' + deviceData.name + '</h1>' +
		'<h2>Codename: ' + device + '</h2>' +
		'<h3>Release date: ' + deviceData.release + '</h3>' +
		'<h3>CPU: ' + deviceData.specs.cpu.vendor + ' ' + deviceData.specs.cpu.model + ' (<span style="font-family:monospace;">' + deviceData.specs.cpu.codename + '</span>)</h3>' +
		'<h3>Display: ' + deviceData.specs.display.height + 'x' + deviceData.specs.display.width + ' (' + deviceData.specs.display.hz + 'hz)</h3>' +
		'<br>'

	deviceInfoPage += '<h2>Downloads:</h2>'

	if (deviceData.official == "true") {
		deviceDownloadURL = DOWNLOAD_BASE_URL_OFFICIAL + device
	} else {
		deviceDownloadURL = DOWNLOAD_BASE_URL_UNOFFICIAL + device + "/LineageOS"
	}
	deviceInfoPage += '<h3><a href="' + deviceDownloadURL + '">LineageOS download</a></h3>'

	deviceInfoElement.innerHTML = deviceInfoPage;

	if (deviceData.official == "true") {
		deviceImageURL = DEVICE_IMAGES_BASE_URL_OFFICIAL + device + '.png'
	} else {
		deviceImageURL = DEVICE_IMAGES_BASE_URL_UNOFFICIAL + device + '.png'
	}
	
	deviceImageElement.innerHTML = '<img src="' + deviceImageURL + '"></img>'

	var activeBoxes = document.getElementsByClassName("device-active");
	for (let deviceBox of activeBoxes) {
		deviceBox.setAttribute("class", "device-not-active");
	}

	var deviceBox = document.getElementById(device);
	deviceBox.setAttribute("class", "device-active")
}

var devicesListElement = document.getElementById("devices-list");
var deviceInfoElement = document.getElementById("device-info-tab");
var deviceImageElement = document.getElementById("device-image-tab");
getJSON(DEVICES_DATA_URL, devicesDataSetup);
