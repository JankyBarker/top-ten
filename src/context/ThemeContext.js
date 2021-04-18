import React, { createContext } from "react";

const themes = {
  light: {
    MyName: "#000000",
  },
  dark: {
    MyName: "#ffffff",
  },
};

export const ThemeContext = createContext(themes.light);

const ThemeContextProvider = (props) => {
  //const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false);

  return (
    <ThemeContext.Provider value={themes.dark}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
