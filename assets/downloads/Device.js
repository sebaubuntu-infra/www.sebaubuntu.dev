//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import Display from "./Display.js";
import SoC from "./SoC.js";

const ASSETS_URL = "assets/downloads";
const DEVICES_JSON_URL = `${ASSETS_URL}/devices.json`;

const DEVICE_IMAGES_URL = `${ASSETS_URL}/images`;
const DEVICE_IMAGES_URL_OFFICIAL = "https://wiki.lineageos.org/images/devices/";
const DOWNLOADS_URL = "https://lineage.sebaubuntu.dev";
const DOWNLOADS_URL_OFFICIAL = "https://download.lineageos.org";

/**
 * Class representing a device.
 */
export default class Device {
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

    /**
     * Fetches the devices list from the server and returns it as an array of Device objects.
     * @return {Promise<Device[]?>} A promise that resolves to an array of Device objects
     */
    static async getDevices() {
        const response = await fetch(DEVICES_JSON_URL);
        if (!response.ok) {
            console.log("Error fetching devices list");
            return null;
        }

        const json = await response.json();
        if (json == null) {
            console.log("Error fetching devices list");
            return null;
        }

        return json.map(device => Device.fromJSON(device));
    }
}
