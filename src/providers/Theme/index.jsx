import React, { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use';

const ThemeContext = createContext({
    theme: "light",
    switchTheme: () => null
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
    const switchTheme = () => {
        if (theme === 'light') {
            document.documentElement.classList.add('dark')
            setTheme('dark')
        }
        else {
            document.documentElement.classList.remove('dark')
            setTheme('light')
        }
    }
    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ switchTheme, theme }}>{children}</ThemeContext.Provider>
    )
}

export default ThemeProvider