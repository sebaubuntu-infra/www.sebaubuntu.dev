//
// SPDX-FileCopyrightText: 2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

export default class InfoTab {
	/**
	 * Constructor for InfoTab.
	 * @param {string} title The title of the tab
	 * @param {Map<string, any>} informations The informations to display
	 */
	constructor(
		title,
		informations,
	) {
		this.title = title;
		this.informations = informations;
	}

	/**
	 * Get the HTML representation of the tab.
	 * @returns {HTMLDivElement} The HTML representation of the tab
	 */
	toHtml() {
		let div = document.createElement("div");
		div.classList.add("information-tab");

		div.innerHTML = `
			<h2>${this.title}</h2>
		`;

		for (const [key, value] of this.informations) {
			let valueString = value;
			if (
				value === null
				|| (typeof value === "string" && value.trim() === "")
			) {
				valueString = "Unknown";
			} else if (typeof value === "boolean") {
				valueString = value === true ? "Yes" : "No";
			} else if (Array.isArray(value)) {
				if (value.length === 0) {
					valueString = "Empty";
				} else {
					valueString = value.join(", ");
				}
			}

			div.innerHTML += `
				<h3>${key}: ${valueString}</h3>
			`;
		}

		return div;
	}
}
