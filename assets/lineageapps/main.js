//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import { App } from "./App.js";
import { BuildInfo } from "./BuildInfo.js";
import { Constants } from "./Constants.js";
import { QueueScheduler } from "./QueueScheduler.js";
import { setColorScheme } from '../common/mdui.js';

// Elements
const appsListElement = document.getElementById("apps-list");
const appBuildsElement = document.getElementById("app-builds");

const QUERY_KEY_APP = "app";

const selectAppQueueScheduler = new QueueScheduler(async (app) => await selectApp(app));

/**
 * Convert a build to an HTML entry.
 * @param {BuildInfo} build The build to convert to HTML
 * @returns {HTMLElement} The HTML representation of the build
 */
function buildToHtmlEntry(build) {
    const card = document.createElement("mdui-card");
    card.classList.add("build-entry");
    card.innerHTML = `
        <h2 class="description">
            <a href="${build.getCommitUrl()}">
                ${build.description} (${build.headCommit.substring(0, 7)})
            </a>
        </h2>
        <br>
        <a class="author">Author: ${build.commitAuthorName} &lt;${build.commitAuthorEmail}&gt;</a>
        <a class="branch" href="${build.getBranchUrl()}">Branch: ${build.branch}</a>
        <a class="date">Build date: ${build.date.toLocaleString()}</a>
        <br>
    `;

    const downloadButtonElement = document.createElement("mdui-button");
    downloadButtonElement.variant = "outlined";
    downloadButtonElement.fullWidth = true;
    downloadButtonElement.icon = "file_download--outlined";
    downloadButtonElement.innerHTML = "Download APK";
    downloadButtonElement.onclick = async (event) => {
        event.preventDefault();

        let downloadUrl = await build.getApkDownloadUrl();
        if (!downloadUrl) {
            alert("No APK available for this build.");
            return;
        }

        window.open(downloadUrl, "_blank");
    }
    card.appendChild(downloadButtonElement);

    return card;
}

/**
 * Get a header with app info and useful redirects.
 * @param {App} app The app
 * @returns {HTMLDivElement} The HTML representation of the app header
 */
function getAppHeaderElement(app) {
    const div = document.createElement("div");
    div.classList.add("app-header");

    div.innerHTML = `
        <div class="info">
            <img class="icon" src="${app.getIconUrl()}" alt="${app.name}">
            <h1 class="name">${app.name}</h1>
        </div>

        <div class="links">
            <mdui-button
                variant="text"
                end-icon="open_in_new"
                href="${app.getRepoUrl()}/actions"
                target="_blank">
                Actions
            </mdui-button>

            <mdui-button
                variant="text"
                end-icon="open_in_new"
                href="${app.getRepoUrl()}"
                target="_blank">
                Repository
            </mdui-button>
        </div>
    `;

    return div;
}

/**
 * Show the available builds for this app.
 * @param {App} app The app to show the builds of
 */
async function selectApp(app) {
    // Show the builds of the selected app
    let selectedButton = document.getElementById(`app-button-${app.name}`);
    if (!selectedButton || selectedButton.variant === "filled") {
        return;
    }

    // Remove the selection class from all app buttons
    let buttons = document.getElementsByClassName("app-button");
    for (let button of buttons) {
        button.variant = "";
    }

    // Mark the selected app button as selected
    selectedButton.variant = "filled";

    appBuildsElement.innerHTML = "";

    // Show the app header
    appBuildsElement.appendChild(getAppHeaderElement(app));

    let builds = await app.getBuilds();
    if (!builds || builds.length === 0) {
        appBuildsElement.innerHTML += `
            <p>No builds available, or an error occurred while fetching the builds.</p>

            <p>
                You've surely tripped GitHub rate limits, retry later or check the GitHub page
                through the link above.
            </p>
        `;
        return;
    }

    // Show the builds of the selected app
    for (let build of builds) {
        appBuildsElement.appendChild(buildToHtmlEntry(build));
    }
}

/**
 * Convert an app to an HTML button.
 * @param {App} app The app to convert to HTML
 * @returns {HTMLElement} The HTML representation of the app
 */
function appToHtmlButton(app) {
    const card = document.createElement("mdui-card");

    // Set the ID of the app button to the app name
    card.id = `app-button-${app.name}`;
    card.classList.add("app-button");
    card.variant = "";
    card.clickable = true;
    card.onclick = () => selectAppQueueScheduler.schedule(app);
    card.innerHTML = `
        <img class="image" src="${app.getIconUrl()}" alt="${app.name}">
        <div class="info">
            <h2 class="name">${app.name}</h2>
            <p class="description">${app.description}</p>
        </div>
    `;
    return card;
}

async function main() {
    // Set LineageOS Teal as accent color
    setColorScheme("#167C80");

    let response = await fetch(Constants.APPS_JSON_PATH);
    let data = await response.json();

    let apps = data.map((app) => App.fromJson(app));

    // Sort by name
    apps.sort((a, b) => a.name.localeCompare(b.name));

    appsListElement.innerHTML = "<h1>Apps</h1>";
    for (let app of apps) {
        appsListElement.appendChild(appToHtmlButton(app));
    }

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    if (urlParams.has(QUERY_KEY_APP)) {
        let appName = urlParams.get(QUERY_KEY_APP);
        let app = apps.find((app) => app.name === appName);
        if (app) {
            selectApp(app);
        }
    }
}

main();
