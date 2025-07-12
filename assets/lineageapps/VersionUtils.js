//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

export class VersionUtils {
	/**
	 * Regular expression to match LineageOS version strings.
	 */
	static VERSION_REGEX = /^\d+\.\d+$/;

	/**
	 * Compare two LineageOS version strings.
	 * 
	 * This function compares two version strings in the following formats:
	 * - `lineage-22.2`
	 * - `lineage-22`
	 * - `22.2`
	 * - `22`
	 * 
	 * All of these formats will be treated as the same, so `lineage-22.2` will be considered equal
	 * to `22.2`, and so on.
	 *
	 * @param {string} a First version string to compare
	 * @param {string} b Second version string to compare
	 * @returns {number} Returns:
	 * - `0` if both versions are equal
	 * - `-1` if version `a` is less than version `b`
	 * - `1` if version `a` is greater than version `b`
	 */
	static lineageVersionComparator(a, b) {
		// Normalize the versions
		a = VersionUtils.normalizeVersion(a);
		b = VersionUtils.normalizeVersion(b);

		// Check if either version is null, valid one should be considered greater
		if (a === null && b === null) {
			return 0; // Both versions are invalid
		} else if (a === null) {
			return -1; // Invalid version a is less than valid version b
		} else if (b === null) {
			return 1; // Valid version a is greater than invalid version b
		}

		// We're guaranteed that both a and b matches the regex, but 1.12 > 1.2
		const aParts = a.split('.').map(Number);
		const bParts = b.split('.').map(Number);

		// Compare major version
		if (aParts[0] - bParts[0] !== 0) {
			return aParts[0] - bParts[0]; // Major version difference
		}

		// Compare minor version
		if (aParts[1] - bParts[1] !== 0) {
			return aParts[1] - bParts[1]; // Minor version difference
		}

		return 0; // Versions are equal
	}

	/**
	 * Normalize a LineageOS version string.
	 *
	 * @param {string?} version
	 * @returns {string?} The normalized version string, or null if the version is invalid
	 */
	static normalizeVersion(version) {
		if (version === null) {
			return null; // Return null for invalid input
		}

		// Trim the version string to remove any leading or trailing whitespace
		version = version.trim();

		// Remove "lineage-" prefix if present
		version = version.replace(/^lineage-/, '');

		// If the version doesn't have a minor version, append ".0"
		if (!version.includes('.')) {
			version += '.0';
		}

		// Validate the version format using the regex
		if (!VersionUtils.VERSION_REGEX.test(version)) {
			console.error(`Invalid version format: ${version}`);
			return null;
		}

		return version;
	}
}
