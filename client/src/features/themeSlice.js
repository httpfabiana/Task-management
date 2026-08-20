import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const themeSlice = createSlice({
  name: "theme",

  initialState,

  reducers: {
    toggleTheme: (state) => {
      const theme = state.theme === "light" ? "dark" : "light";

      localStorage.setItem("theme", theme);

      state.theme = theme;

      applyTheme(theme);
    },

    setTheme: (state, action) => {
      state.theme = action.payload;

      applyTheme(action.payload);
    },

    loadTheme: (state) => {
      const theme = localStorage.getItem("theme");

      if (theme) {
        state.theme = theme;

        applyTheme(theme);
      }
    },
  },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;

export default themeSlice.reducer;