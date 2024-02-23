//
// SPDX-FileCopyrightText: 2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import { BuildInfo } from "./BuildInfo.js";
import { Constants } from "./Constants.js";

export class App {
	/**
	 * The base URL for the app icons.
	 */
	static ICON_BASE_URL = "assets/lineageapps/icons";

	/**
	 * Constructor for AppInfo.
	 * @param {string} name The name of the app
	 * @param {string} description A short description of the app
	 * @param {string} repository The app's repository
	 * @param {string} branch The app's default branch
	 */
	constructor(
		name,
		description,
		repository,
		branch,
	) {
		this.name = name;
		this.description = description;
		this.repository = repository;
		this.branch = branch;
	}

	static fromJson(json) {
		return new App(
			json.name,
			json.description,
			json.repository,
			json.branch,
		);
	}

	/**
	 * Get the URL to the app's icon (SVG).
	 * @returns {string} The URL to the app's icon (SVG).
	 */
	getIconUrl() {
		return `${App.ICON_BASE_URL}/${this.name}.svg`;
	}

	/**
	 * Get the URL to the app's repo.
	 * @returns {string} The URL to the app's repo
	 */
	getRepoUrl() {
		return `${Constants.REPO_BASE_URL}/${Constants.ORGANIZATION}/${this.repository}`;
	}

	/**
	 * Get the base URL for the app repo's API.
	 * @returns {string} The base URL for the app repo's API
	 */
	getAppRepoApiUrl() {
		return `${Constants.REPO_API_BASE_URL}/${Constants.ORGANIZATION}/${this.repository}`;
	}

	/**
	 * Get the workflows for the app.
	 * @returns {Promise<object?>} The workflow object or null if not found
	 */
	async getBuildWorkflow() {
		let url = `${this.getAppRepoApiUrl()}/actions/workflows`;

		let response = await fetch(url);
		if (!response.ok) {
			return null;
		}

		let data = await response.json();

		let workflow = data.workflows.find(
			(workflow) => workflow.name === Constants.GITHUB_WORKFLOW
		);

		return workflow;
	}

	/**
	 * Get the app's workflow runs.
	 * @returns {Promise<object[]?>} The workflow runs or null if not found
	 */
	async getWorkflowRuns() {
		let workflow = await this.getBuildWorkflow();
		if (!workflow) {
			return null;
		}

		let url = `${this.getAppRepoApiUrl()}/actions/workflows/${workflow.id}/runs`;
		let response = await fetch(url);
		if (!response.ok) {
			return null;
		}

		let data = await response.json();
		return data.workflow_runs;
	}

	/**
	 * Get the builds for the app.
	 * @returns {Promise<BuildInfo[]?>} The builds for the app or null if not found
	 */
	async getBuilds() {
		let runs = await this.getWorkflowRuns();
		if (!runs) {
			return null;
		}

		return runs
			.filter((run) => run.event === "push" && run.status === "completed")
			.map((run) => BuildInfo.fromRun(run, this));
	}

	/**
	 * Get the default branch builds for the app.
	 * @returns {Promise<BuildInfo[]?>} The default branch builds or null if not found
	 */
	async getDefaultBranchBuilds() {
		let builds = await this.getBuilds();
		if (!builds) {
			return null;
		}

		return builds.filter(
			(build) => build.branch === this.branch
		);
	}
}
