//
// SPDX-FileCopyrightText: 2022-2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

const PAGES_JSON_PATH = "assets/blog/pages.json";

const mainPageElement = document.getElementById("main-page");

class Page {
	/**
	 * Page constructor.
	 * @param {number} id The ID of the page
	 * @param {string} title The title of the page
	 * @param {string} description The description of the page
	 * @param {string} author The author of the page
	 * @param {number} timestamp The timestamp of the page
	 */
	constructor(id, title, description, author, timestamp) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.author = author;
		this.timestamp = timestamp;
	}

	/**
	 * Create a Page from a JSON object.
	 * @param {object} json A JSON object representing the page
	 * @returns {Page} The page object
	 */
	static fromJson(json) {
		return new Page(json.id, json.title, json.description, json.author, json.timestamp);
	}

	/**
	 * Get a human readable date from the timestamp.
	 * @returns {string} The formatted date
	 */
	getFormattedDate() {
		var date = new Date(this.timestamp);
		return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
	}

	/**
	 * Get a button to let the user open the page.
	 * @returns {HTMLDivElement} The HTML representation of the page
	 */
	getButtonHtml() {
		let div = document.createElement("div");
		div.classList.add("post-card");
		div.innerHTML = `
			<h5 class="post-card-description">${this.description}</h5>
			<h2 class="post-card-title"><a href="blog.html?page=${this.id}">${this.title}</a></h2>
			<p class="post-card-info">
				<img src="assets/blog/icons/calendar_month.svg" alt="Date">
				<a>${this.getFormattedDate()}</a>
				<img src="assets/blog/icons/account_circle.svg" alt="Author">
				<a>${this.author}</a>
			</p>
		`;
		return div;
	}

	/**
	 * Get the HTML content of the page.
	 * @returns {Promise<string>} The HTML content of the page
	 */
	async getContentHtml() {
		var response = await fetch(`assets/blog/pages/${this.id}.html`);
		var text = await response.text();
		return text;
	}
}

/**
 * Get the pages from the JSON file.
 * @returns {Promise<Page[]?>} The pages, or null if the request failed
 */
async function getPages() {
	let response = await fetch(PAGES_JSON_PATH);
	if (!response.ok) {
		return null;
	}

	let data = await response.json();

	return data.map(page => Page.fromJson(page));
}

async function main() {
	mainPageElement.innerHTML = "";

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	let pages = await getPages();
	if (!pages) {
		// Add a warning to the user
		mainPageElement.innerHTML += `
			<h1 class="warning">Failed to load the blog posts.</h1>
		`;
		return;
	}

	// If the user requested a specific page, show it
	if (urlParams.has('page')) {
		let requestedPage = urlParams.get('page');
		let page = pages.find(page => page.id == requestedPage);
		if (!page) {
			// Add a warning to the user
			mainPageElement.innerHTML += `
				<h1 class="warning">The requested post does not exist.</h1>
				<a href="blog.html" class="back-button">Back</a>
			`;
			return;
		}

		// Replace the blog content with the requested page
		let contentHtml = await page.getContentHtml();

		// Add title, description and date
		mainPageElement.innerHTML += `
			<div id="post-header">
				<h1 id="post-header-title">${page.title}</h1>
				<h4 id="post-header-info">Written on ${page.getFormattedDate()} by ${page.author}</h4>
			</div>
			<div id="post-content">
				${contentHtml}
			</div>
		`;
	} else {
		// The user didn't request a specific page, show the list of pages
		pages.forEach(page => {
			mainPageElement.appendChild(page.getButtonHtml());
		});
	}
}

main();
