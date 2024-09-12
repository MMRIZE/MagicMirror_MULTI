/**
 * (MULTI) Loads the layout from template
 * and set global mmClient if specified in query string
 */

(function () {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const client = urlParams.get("client") || null;

	config = { ...config, ...(client ? (config?.clients || []).find((c) => c.client === client) : {}) };

	const body = document.getElementsByTagName("body")[0];
	if (client) {
		body.dataset.client = client;
		globalThis.mmClient = client;
	}
	const layoutURL = config?.layout || "layout/default.html";
	fetch(layoutURL)
		.then((response) => response.text())
		.then((data) => {
			const documentFragment = document.createRange().createContextualFragment(data);
			body.prepend(documentFragment);
			console.info(`Loaded layout: ${layoutURL}`);
		})
		.catch((err) => {
			console.error(err);
		}); // end fetch
})(); // end IIFE
