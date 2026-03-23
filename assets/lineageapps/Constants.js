//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

export class Constants {
    /**
     * The path to the JSON file containing the apps data.
     */
    static APPS_JSON_PATH = "/assets/lineageapps/apps.json";

    /**
     * The base URL for the app icons.
     */
    static ICON_BASE_URL = "/assets/lineageapps/icons";

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
     * The name of the workflow which is used on push events.
     */
    static GITHUB_WORKFLOW = "build";

    /**
     * The suffix of the APK artifact files.
     */
    static ARTIFACT_SUFFIX = ".apk";
}
