//
// SPDX-FileCopyrightText: 2023-2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

let topbarContainerElement = document.getElementById("topbar-container");

const PAGES = {
	"Home": "/index.html",
	"Blog": "/blog.html",
	"Downloads": "/downloads.html",
	"LineageOS apps": "/lineageapps.html",
	"Files": "https://files.sebaubuntu.dev",
	"Contact": "https://t.me/SebaUbuntu",
}

function main() {
	topbarContainerElement.innerHTML = `
		<style>
			#topbar {
				align-items: center;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 12px;
			}

			#topbar > .logo {
				border-radius: 8px;
				margin: 4px;
			}

			#topbar > .title {
				color: white;
				font-size: 20px;
				padding: 12px;
			}

			#topbar > .pages {
				/* Align to right */
				align-self: flex-end;
				display: flex;
				margin-left: auto;
				flex-direction: row;
				flex-wrap: wrap;
			}

			#topbar > .pages > .button {
				border-radius: 8px;
				color: white;
				margin: 4px;
				padding: 14px 16px;
			}

			#topbar > .pages > .button:hover {
				background-color: #111;
			}

			#topbar > .pages > .button.active {
				background-color: #333;
			}
		</style>

		<div id="topbar">
			<img class="logo" src="https://avatars3.githubusercontent.com/u/38215111?s=42&v=4">
			<a class="title">SebaUbuntu</a>
			<div class="pages">
				${Object.keys(PAGES).map(page => `
					<a
						class="button ${window.location.pathname === PAGES[page] ? "active" : ""}"
						href="${PAGES[page]}"
					>
						${page}
					</a>
				`).join("")}
			</div>
		</div>
	`;
}

main();
