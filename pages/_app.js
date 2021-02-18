import { ConsentGate, MetomicProvider } from "@metomic/react";
import * as Sentry from "@sentry/node";
import tawkTo from "tawkto-react";

import { ThemeProvider, theme } from "@chakra-ui/core";
import "../styles/index.scss";
import { useEffect } from "react";

const customIcons = {
	secureLogo: {
		path: (
			<svg
				width="18"
				height="22"
				viewBox="0 0 18 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="18" height="22" fill="#E5E5E5" />
				<rect
					x="-3557"
					y="-1457"
					width="19820"
					height="11679"
					rx="538"
					stroke="black"
					strokeWidth="30"
				/>
				<g clipPath="url(#clip0)">
					<rect
						width="1440"
						height="900"
						transform="translate(-797 -527)"
						fill="white"
					/>
					<rect x="-586" y="-463" width="1229" height="836" fill="white" />
					<g filter="url(#filter0_f)">
						<rect
							x="-0.305176"
							y="-273.838"
							width="420.61"
							height="210.838"
							rx="20"
							fill="#2BCACA"
							fillOpacity="0.2"
						/>
					</g>
					<path
						d="M9 21C9 21 17 17 17 11V4L9 1L1 4V11C1 17 9 21 9 21Z"
						fill="#798594"
						stroke="#798594"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M14 7L7.125 14L4 10.8182"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect
						x="-22.5"
						y="-26.5"
						width="465"
						height="75"
						rx="7.5"
						stroke="#E2ECF9"
					/>
				</g>
				<defs>
					<filter
						id="filter0_f"
						x="-75.3052"
						y="-348.838"
						width="570.61"
						height="360.838"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="BackgroundImageFix"
							result="shape"
						/>
						<feGaussianBlur
							stdDeviation="37.5"
							result="effect1_foregroundBlur"
						/>
					</filter>
					<clipPath id="clip0">
						<rect
							width="1440"
							height="900"
							fill="white"
							transform="translate(-797 -527)"
						/>
					</clipPath>
				</defs>
			</svg>
		),
	},
};

const customTheme = {
	...theme,
	icons: {
		...theme.icons,
		...customIcons,
	},
	colors: {
		...theme.colors,
		teal: {
			...theme.colors.teal,
			300: "#45E2E2",
			500: "#2BCACA",
			700: "#20B1B1",
		},
		pink: {
			...theme.colors.pink,
			300: "#FF9DC0",
			500: "#FF7CAB",
			700: "#EF6093",
		},
		orange: {
			...theme.colors.orange,
			500: "#F5B100",
		},
	},
	opacity: {
		...theme.opacity,
		10: ".1",
		20: ".2",
		30: ".3",
		40: ".4",
		50: ".5",
		60: ".6",
		70: ".7",
		80: ".8",
		90: ".9",
	},
};

export default function YieldScanApp({ Component, pageProps, err }) {
	return (
		<ThemeProvider theme={customTheme}>
			<MetomicProvider projectId={process.env.NEXT_PUBLIC_METOMIC_PROJECT_ID}>
				<Component {...pageProps} err={err} />
			</MetomicProvider>
		</ThemeProvider>
	);
}
