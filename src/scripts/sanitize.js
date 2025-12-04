import sanitizeHtml from "sanitize-html";

export function sanitize(html) {
	return sanitizeHtml(html, {
		allowedTags: [
			"b",
			"i",
			"em",
			"u",
			"strong",
			"a",
			"img",
			"p",
			"sup",
			"sub",
			"div",
		],
		allowedAttributes: {
			a: ["href"],
			img: ["src", "srcset"],
		},
		allowedSchemes: ["data", "http"],
		allowedClasses: {
			div: ["ql-code-block-container", "ql-code-block"],
		},
	}).replaceAll("<img ", '<img style="max-width: 15cm;" ');
}
