import { useState, useCallback } from "react";
import { createContainer } from "unstated-next";

const defaultStates = {
  theme: localStorage.getItem("theme") || "",
  globalLoading: false,
};

function useUtils(customInitialStates = {}) {
  const initialStates = {
    ...defaultStates,
    ...customInitialStates,
  };
  const [theme, setThemeProp] = useState(initialStates.theme);
  const [globalLoading, setGlobalLoading] = useState(
    initialStates.globalLoading
  );

  // Init
  window.document.documentElement.setAttribute("data-theme", theme);

  const setTheme = useCallback(
    (t) => {
      let localStorageTheme = localStorage.getItem("theme");
      t = t || localStorageTheme;
      window.document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
      setThemeProp(t);
    },
    [setThemeProp]
  );

  return {
    theme,
    setTheme,
    globalLoading,
    setGlobalLoading,
  };
}

const Utils = createContainer(useUtils);

export default Utils;
