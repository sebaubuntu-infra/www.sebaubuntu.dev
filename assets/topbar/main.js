//
// SPDX-FileCopyrightText: 2023-2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

let topbarContainerElement = document.getElementById("topbar-container");

const PAGES = {
	"Home": ["/", "/index.html"],
	"Blog": ["/blog.html"],
	"Downloads": ["/downloads.html"],
	"LineageOS apps": ["/lineageapps.html"],
	"Athena": ["/athena.html", "/athena/privacy_policy.html"],
	"Status": ["/status.html"],
	"Files": ["https://files.sebaubuntu.dev"],
	"Contact": ["https://t.me/SebaUbuntu"],
}

function main() {
	topbarContainerElement.innerHTML = `
		<style>
			#topbar {
				align-items: center;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 12px;
			}

			#topbar > .info {
				align-items: center;
				display: flex;
				flex-direction: row;
			}

			#topbar > .info > .logo {
				border-radius: 8px;
				margin: 4px;
				width: 48px;
			}

			#topbar > .info > .title {
				color: white;
				font-size: 20px;
				padding: 12px;
			}

			#topbar > .pages {
				display: flex;
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
			<div class="info">
				<img class="logo" src="/assets/logo.svg">
				<a class="title">SebaUbuntu</a>
			</div>

			<div class="pages">
				${Object.keys(PAGES).map(page => `
					<a
						class="button ${PAGES[page].includes(window.location.pathname) ? "active" : ""}"
						href="${PAGES[page][0]}"
					>
						${page}
					</a>
				`).join("")}
			</div>
		</div>
	`;
}

main();
