//
// Copyright (C) 2022 Sebastiano Barezzi
//
// SPDX-License-Identifier: MIT
//

const pagesJson = "assets/blog/pages.json";

const dateSvg = '' +
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
		'<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>' +
	'</svg>';
const userSvg = '' +
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
		'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"></path>' +
	'</svg>';

class Page {
	constructor(id, title, description, author, timestamp) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.author = author;
		this.timestamp = timestamp;
	}

	static fromJson(json) {
		return new Page(json.id, json.title, json.description, json.author, json.timestamp);
	}

	getFormattedDate() {
		var date = new Date(this.timestamp);
		return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
	}

	getButtonHtml() {
		return '' +
			'<div class="post-card">' +
				'<h5 class="post-card-description">' + this.description + '</h5>' +
				'<h2 class="post-card-title"><a href="blog.html?page=' + this.id + '">' + this.title + '</a></h2>' +
				'<p class="post-card-info">' + dateSvg + ' ' + this.getFormattedDate() + ' ' + userSvg + ' ' + this.author + ' </p>' +
			'</div>';
	}

	async getContentHtml() {
		var response = await fetch('assets/blog/' + this.id + '/page.html');
		var text = await response.text();
		return text;
	}
}

async function getPages(url) {
	const response = await fetch(url);
	const pagesJson = await response.json();

	let pages = new Array(pagesJson.length);
	pagesJson.forEach((page, index) => {
		pages[index] = Page.fromJson(page);
	});

	return pages;
}

function openPage(page) {

}

function main() {
	const blogMain = document.getElementById("blog-main");
	blogMain.innerHTML = "";

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	getPages(pagesJson).then(pages => {
		// If the user requested a specific page, show it
		if (urlParams.has('page')) {
			let requestedPage = urlParams.get('page');
			let page = pages.find(page => page.id == requestedPage);
			if (!page) {
				// Add a warning to the user
				blogMain.innerHTML += '' +
					'<h1 class="warning">The requested post does not exist.</h1>' +
					'<a href="blog.html" class="back-button">Back</a>';
				return;
			}

			// Replace the blog content with the requested page
			page.getContentHtml().then(content => {
				// Add title, description and date
				blogMain.innerHTML += '' +
					'<div id="post-header">' +
						'<h1 id="post-header-title">' + page.title + '</h1>' +
						'<h4 id="post-header-info">Written on ' + page.getFormattedDate() + ' by ' + page.author + '</h4>' +
					'</div>' +
					'<div id="post-content">' +
						content +
					'</div>';
			});
		} else {
			// The user didn't request a specific page, show the list of pages
			pages.forEach(page => {
				blogMain.innerHTML += page.getButtonHtml();
			});
		}
	});
}

main();
