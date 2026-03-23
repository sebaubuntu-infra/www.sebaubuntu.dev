//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

const topbarContainerElement = document.getElementById("topbar-container");

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
        <div class="topbar">
            <mdui-icon class="logo" src="/assets/common/favicon.svg"></mdui-icon>
            <a class="title">SebaUbuntu</a>

            <div style="flex-grow: 1"></div>

            ${Object.keys(PAGES).map(page => `
                <mdui-button
                    variant="${PAGES[page].includes(window.location.pathname) ? "filled" : "text"}"
                    ${PAGES[page][0].startsWith("/")
                        ? ''
                        : 'end-icon="open_in_new" target="_blank"'}
                    href="${PAGES[page][0]}">
                    ${page}
                </mdui-button>
            `).join("")}
        </div>
    `;
}

main();
