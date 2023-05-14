//
// Copyright (C) 2023 Sebastiano Barezzi
//
// SPDX-License-Identifier: MIT
//

let topbarContainerElement = document.getElementById("topbar-container");

const PAGES = {
	"Home": "/index.html",
	"Blog": "/blog.html",
	"Downloads": "/downloads.html",
	"Files": "https://files.sebaubuntu.dev",
	"Contact": "https://t.me/SebaUbuntu",
}

function main() {
	topbarContainerElement.innerHTML = `
		<style>
			#topbar {
				flex: 0 1 auto;
				margin: 0;
				padding: 12px;
				list-style-type: none;
				overflow: hidden;
			}
			
			#topbar li {
				float: left;
			}
			
			#topbar li a {
				display: block;
				color: white;
				text-align: center;
				padding: 14px 16px;
				text-decoration: none;
			}
			
			#topbar li a:hover {
				background-color: #111;
			}
			
			#topbar li a.active {
				background-color: #333;
			}
			
			#topbar li img {
				display: block;
				transform: translateY(5%);
			}
			
			#topbar-left {
				float: left;
			}
			
			#topbar-right {
				float: right;
			}
		</style>

		<ul id="topbar">
			<div id="topbar-left">
				<li><img src="https://avatars3.githubusercontent.com/u/38215111?s=42&v=4"></li>
				<li><a>SebaUbuntu</a></li>
			</div>
			<div id="topbar-right">
				${Object.keys(PAGES).map(page => `
					<li><a href="${PAGES[page]}" class="${window.location.pathname === PAGES[page] ? "active" : ""}">${page}</a></li>
				`).join("")}
			</div>
		</ul>
	`;
}

main();
