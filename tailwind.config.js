/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('rippleui')],
	theme: {
		colors: {
			blue: '#1fb6ff'
		}
	}
}
