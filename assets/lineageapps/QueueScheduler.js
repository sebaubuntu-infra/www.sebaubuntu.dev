//
// SPDX-FileCopyrightText: Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

/**
 * Helper class to let us execute a task serially with the latest arguments.
 * One example is a user selecting items in a list, where we want to
 * process the latest selection without worrying about previous selections, which will be discarded.
 */
export class QueueScheduler {
	/**
	 * Callback definition for the async task to execute.
	 * 
	 * @callback QueueSchedulerCallback
	 * @param {...any} args The arguments to pass to the callback
	 * @returns {Promise<void>} The promise returned by the callback
	 */

	/**
	 * Constructor for QueueScheduler.
	 *
	 * @param {QueueSchedulerCallback} callback The async callback to execute with the latest
	 *   arguments
	 */
	constructor(callback) {
		this.callback = callback;

		/**
		 * The latest arguments to pass to the callback.
		 *
		 * @type {any[]|null}
		 */
		this.args = null;

		/**
		 * Whether the scheduler is currently running a task.
		 */
		this.running = false;
	}

	/**
	 * Schedule a new task with the latest arguments.
	 *
	 * @param {...any} args The arguments to pass to the callback
	 */
	schedule(...args) {
		this.args = args;

		if (this.running) {
			return;
		}

		this.executeCallback();
	}

	/**
	 * Execute the callback with the latest arguments.
	 */
	async executeCallback() {
		this.running = true;

		while (true) {
			let args = this.args;
			if (args === null) {
				return null;
			}

			await this.callback(...args);

			if (this.args === args) {
				this.running = false;
				break;
			}
		}
	}
}
