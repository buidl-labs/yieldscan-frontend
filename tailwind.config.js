// tailwind.config.js
const {
	colors,
	borderRadius,
	maxWidth,
	scale,
} = require("tailwindcss/defaultTheme");

module.exports = {
	theme: {
		extend: {
			colors: {
				teal: {
					...colors.teal,
					"300": "#45E2E2",
					"500": "#2BCACA",
					"700": "#20B1B1",
				},
				pink: {
					...colors.pink,
					"300": "#FF9DC0",
					"500": "#FF7CAB",
					"700": "#EF6093",
				},
				orange: {
					...colors.orange,
					"500": "#F5B100",
				},
				bgGray: {
					"100": "#F1F8FF",
					"200": "#E2ECF9",
					"300": "#D1DDEA",
					"400": "#C7D3E0",
					"500": "#BEC7D2",
					"900": "#B3BECC",
				},
				textGray: {
					"100": "#94A4B7",
					"200": "#798594",
					"300": "#626D7B",
					"400": "#48607C",
					"500": "#35475C",
					"700": "#212D3B",
				},
			},
			borderRadius: {
				...borderRadius,
				xl: "1rem",
			},
			maxWidth: {
				...maxWidth,
				xs: "16rem",
				xxs: "12rem",
			},
			cursor: {
				help: "help",
			},
			opacity: {
				"10": "0.1",
				"22": "0.22",
			},
			scale: {
				...scale,
				"102": "1.02",
			},
		},
	},
	variants: {},
	plugins: [],
};
