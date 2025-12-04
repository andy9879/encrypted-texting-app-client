import sanitizeHtml from "sanitize-html";

export function sanitize(html) {
	return sanitizeHtml(html, {
		allowedTags: ["b", "i", "em", "u", "strong", "a", "img", "p"],
		allowedAttributes: {
			a: ["href"],
			img: ["src", "srcset"],
		},
		allowedSchemes: ["data", "http"],
	}).replaceAll("<img ", '<img style="max-width: 15cm;" ');
}
