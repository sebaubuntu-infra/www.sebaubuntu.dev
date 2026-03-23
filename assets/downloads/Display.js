//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

/**
 * Class representing a display.
 */
export default class Display {
    constructor(
        height,
        width,
        refreshRate,
    ) {
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
