import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: {
  				main: '#FAF4EC',
  				card: '#F1E6D8',
  				DEFAULT: '#FAF4EC'
  			},
  			blue: {
  				primary: '#1E355E',
  				secondary: '#2E4A7C',
  				DEFAULT: '#1E355E'
  			},
  			text: {
  				primary: '#1E355E',
  				secondary: '#324C7A'
  			},
  			border: '#E5D5C0',
  			input: '#E5D5C0',
  			ring: '#1E355E',
  			foreground: '#1E355E',
  			primary: {
  				DEFAULT: '#1E355E',
  				foreground: '#FAF4EC'
  			},
  			secondary: {
  				DEFAULT: '#F1E6D8',
  				foreground: '#1E355E'
  			},
  			destructive: {
  				DEFAULT: '#DC2626',
  				foreground: '#FAF4EC'
  			},
  			muted: {
  				DEFAULT: '#F1E6D8',
  				foreground: '#324C7A'
  			},
  			accent: {
  				DEFAULT: '#2E4A7C',
  				foreground: '#FAF4EC'
  			},
  			popover: {
  				DEFAULT: '#FAF4EC',
  				foreground: '#1E355E'
  			},
  			card: {
  				DEFAULT: '#F1E6D8',
  				foreground: '#1E355E'
  			}
  		},
  		fontFamily: {
  			fraunces: [
  				'var(--font-fraunces)',
  				'serif'
  			],
  			manrope: [
  				'var(--font-manrope)',
  				'sans-serif'
  			],
  			sans: [
  				'var(--font-manrope)',
  				'sans-serif'
  			],
  			serif: [
  				'var(--font-fraunces)',
  				'serif'
  			]
  		},
  		borderRadius: {
  			lg: '12px',
  			md: '8px',
  			sm: '6px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

