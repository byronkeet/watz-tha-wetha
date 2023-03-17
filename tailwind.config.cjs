/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
	extend: {},
	fontFamily: {
		display: ["Righteous", "Roboto"],
		'body': [
			'Inter', 
			'system-ui', 
			'-apple-system', 
			'system-ui', 
			'Segoe UI', 
			'Roboto',
		],
		'sans': [
			'Inter',
			'system-ui', 
			'-apple-system', 
			'system-ui', 
			'Segoe UI', 
			'Roboto', 
		]
	},
},
  plugins: [],
};

module.exports = config;
