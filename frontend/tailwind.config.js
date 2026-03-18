/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "sans-serif"],
        display: ["Sora", "Space Grotesk", "Segoe UI", "sans-serif"],
      },
      animation: {
        "message-in": "messageIn 260ms ease-out both",
        "float-slow": "floatSlow 10s ease-in-out infinite",
      },
      keyframes: {
        messageIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(12px) scale(0.985)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        floatSlow: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      boxShadow: {
        glow: "0 30px 120px -48px rgba(14, 165, 233, 0.5)",
      },
    },
  },
  plugins: [],
};
