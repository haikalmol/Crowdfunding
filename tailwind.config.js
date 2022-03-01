const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        "Moderate-cyan": "hsl(176, 50%, 47%)",
        "Dark-cyan": "hsl(176, 72%, 28%)",
        "Dark-gray": "hsl(0, 0%, 48%)",
      },
      fontFamily: {
        sans: ["'Commissioner'", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        hero: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%), url('./images/image-hero-mobile.jpg')",
        "hero-d": "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%), url('./images/image-hero-desktop.jpg')",
      },
    },
  },
  plugins: [],
};
