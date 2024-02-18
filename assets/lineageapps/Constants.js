//
// SPDX-FileCopyrightText: 2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

export class Constants {
	/**
	 * The base URL for GitHub repos.
	 */
	static REPO_BASE_URL = "https://github.com";

	/**
	 * The base URL for GitHub repos REST APIs.
	 */
	static REPO_API_BASE_URL = "https://api.github.com/repos";

	/**
	 * The organization which owns the app repos.
	 */
	static ORGANIZATION = "LineageOS";

	/**
	 * The prefix for the app repos.
	 */
	static REPO_PREFIX = "android_packages_apps_";

	/**
	 * The name of the workflow which is used on push events.
	 */
	static GITHUB_WORKFLOW = "build";

	/**
	 * The default branch for the app repos.
	 */
	static DEFAULT_BRANCH = "lineage-21.0";

	/**
	 * The name of the artifact which contains the APK.
	 */
	static ARTIFACT_NAME = "app-debug.apk";
}
