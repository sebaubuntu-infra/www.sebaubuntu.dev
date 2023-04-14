//
// Copyright (C) 2023 Sebastiano Barezzi
//
// SPDX-License-Identifier: MIT
//

let headElement = document.getElementById("topbar-container");

function main() {
	let topbarElement = document.createElement("div");
	topbarElement.innerHTML = `
		<link rel="stylesheet" href="assets/topbar/main.css"/>
		<ul id="topbar">
			<div id="topbar-left">
				<li><img src="https://avatars3.githubusercontent.com/u/38215111?s=42&v=4"></li>
				<li><a>SebaUbuntu</a></li>
			</div>
			<div id="topbar-right">
				<li><a id="topbar-home" href="index.html">Home</a></li>
				<li><a id="topbar-blog" href="blog.html">Blog</a></li>
				<li><a id="topbar-downloads" href="downloads.html">Downloads</a></li>
				<li><a id="topbar-files" href="https://files.sebaubuntu.dev">Files</a></li>
				<li><a id="topbar-contact" href="https://t.me/SebaUbuntu">Contact</a></li>
			</div>
		</ul>
	`;
	headElement.appendChild(topbarElement);

	// Set active button
	let currentPage = `topbar-${document.currentScript.getAttribute("page")}`;
	let currentButton = document.getElementById(currentPage);
	currentButton.setAttribute("class", "active");
}

main();
