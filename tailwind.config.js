module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@headlessui/react/**/*.js", // ✅ include headlessui
  ],
  safelist: [
    "ring-1",
    "ring-black",
    "ring-opacity-5",
    "focus:outline-none",
    "bg-white",
    "dark:bg-gray-800",
    "text-gray-900",
    "dark:text-white",
    "shadow-lg",
    "transition",
    "duration-100",
    "ease-in-out",
    "transform",
    "scale-95",
    "scale-100",
    "opacity-0",
    "opacity-100",
    "translate-y-1",
    "translate-y-0",
    "z-10",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
