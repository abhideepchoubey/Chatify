/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Epilogue", "Segoe UI", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
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
        glow: "0 28px 80px -42px rgba(34, 53, 38, 0.52)",
      },
    },
  },
  plugins: [],
};
