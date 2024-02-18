//
// SPDX-FileCopyrightText: 2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import { App } from "./App.js";
import { Constants } from "./Constants.js";

export class BuildInfo {
	/**
	 * Constructor for BuildInfo.
	 * @param {App} app The app for which the build was made
	 * @param {string} branch The branch of the build
	 * @param {string} headCommit The commit hash of the build
	 * @param {string} description The description of the build (usually commit name)
	 * @param {string} htmlUrl The HTML URL to the workflow run
	 */
	constructor(
		app,
		branch,
		headCommit,
		description,
		htmlUrl,
	) {
		this.app = app;
		this.branch = branch;
		this.headCommit = headCommit;
		this.description = description;
		this.htmlUrl = htmlUrl;
	}

	/**
	 * Get the URL to the branch of the build.
	 * @returns {string} The URL to the branch of the build
	 */
	getBranchUrl() {
		return `${this.app.getRepoUrl()}/tree/${this.branch}`;
	}

	/**
	 * Get the URL to the commit of the build.
	 * @returns {string} The URL to the commit of the build
	 */
	getCommitUrl() {
		return `${this.app.getRepoUrl()}/commit/${this.headCommit}`;
	}
}
