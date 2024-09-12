/* global io */

/* MagicMirror²
 * TODO add description
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
const MMSocket = function (moduleName) {
	if (typeof moduleName !== "string") {
		throw new Error("Please set the module name for the MMSocket.");
	}

	this.moduleName = moduleName;

	// Private Methods
	let base = "/";
	if (typeof config !== "undefined" && typeof config.basePath !== "undefined") {
		base = config.basePath;
	}
	this.socket = io(`/${this.moduleName}`, {
		path: `${base}socket.io`
	});

	let notificationCallback = function () {};

	const onevent = this.socket.onevent;
	this.socket.onevent = (packet) => {
		const args = packet.data || [];
		onevent.call(this.socket, packet); // original call
		packet.data = ["*"].concat(args);
		onevent.call(this.socket, packet); // additional call to catch-all
	};

	// register catch all.
	this.socket.on("*", (notification, payload) => {
		if (notification !== "*") {
			notificationCallback(notification, payload);
		}
	});

	this.socket.on("connect_error", (err) => {
		console.warn("[MMSocket] Connection Error, the MM Server might be gone.", err);
	});

	// Public Methods
	this.setNotificationCallback = (callback) => {
		notificationCallback = callback;
	};

	/**
	 * Send a notification to the node helper.
	 * @param {string} notification The identifier of the notification.
	 * @param {object} payload The payload of the notification.
	 * @param {string | null} client The client id to send the notification to.
	 */
	this.sendNotification = (notification, payload = {}, client) => {
		this.socket.emit(notification, payload, client);
	};
};
