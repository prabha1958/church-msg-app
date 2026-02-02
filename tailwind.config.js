/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      safelist: [
        "bg-amber-300",
        "bg-amber-500",
        "text-amber-900",
        "text-amber-800",
        "text-black",
      ],
    },
  },
  plugins: [],
}