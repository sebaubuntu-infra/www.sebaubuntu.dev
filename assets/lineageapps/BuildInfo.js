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
	 * @param {number} runId The GitHUb run ID of the build
	 * @param {number} suiteId The GitHub check suite ID of the build
	 * @param {string} branch The branch of the build
	 * @param {string} headCommit The commit hash of the build
	 * @param {string} commitAuthorName The name of the commit author
	 * @param {string} commitAuthorEmail The email of the commit author
	 * @param {string} description The description of the build (usually commit name)
	 * @param {Date} date The date when the build was completed
	 */
	constructor(
		app,
		runId,
		suiteId,
		branch,
		headCommit,
		commitAuthorName,
		commitAuthorEmail,
		description,
		date,
	) {
		this.app = app;
		this.runId = runId;
		this.suiteId = suiteId;
		this.branch = branch;
		this.headCommit = headCommit;
		this.commitAuthorName = commitAuthorName;
		this.commitAuthorEmail = commitAuthorEmail;
		this.description = description;
		this.date = date;
	}

	/**
	 * Create a BuildInfo object from a GitHub run object.
	 * @param {object} run The GitHub run object
	 * @param {App} app The app for which the build was made
	 * @returns {BuildInfo} The build info
	 */
	static fromRun(run, app) {
		return new BuildInfo(
			app,
			run.id,
			run.check_suite_id,
			run.head_branch,
			run.head_sha,
			run.head_commit.author.name,
			run.head_commit.author.email,
			run.display_title,
			new Date(run.updated_at),
		);
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

	/**
	 * Get the URL to the artifacts of the build.
	 * @returns {string} The URL to the artifacts of the build
	 */
	getArtifactsUrl() {
		return `${this.app.getAppRepoApiUrl()}/actions/runs/${this.runId}/artifacts`;
	}

	/**
	 * Get the APK artifact of the build.
	 * @returns {Promise<Object>} The APK artifact info
	 */
	async getApkArtifact() {
		let artifactsUrl = this.getArtifactsUrl();
		let response = await fetch(artifactsUrl);
		if (!response.ok) {
			return null;
		}

		let artifacts = await response.json();
		let apkArtifact = artifacts.artifacts.find(
			artifact => artifact.name === Constants.ARTIFACT_NAME
		);

		return apkArtifact;
	}

	async getApkDownloadUrl() {
		let apkArtifact = await this.getApkArtifact();

		return `https://nightly.link/${Constants.ORGANIZATION}/${this.app.repository}/suites/${this.suiteId}/artifacts/${apkArtifact.id}`
	}
}
