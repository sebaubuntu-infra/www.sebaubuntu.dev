//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

/**
 * Class representing a SoC.
 */
export default class SoC {
    constructor(
        codename,
        vendor,
        model,
    ) {
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
