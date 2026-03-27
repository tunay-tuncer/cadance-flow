import { createContext, useState } from "react";
import turkishTexts from "../language/tr.json";

export const ProjectContext = createContext({})

export const ProjectContextProvider = ({ children }) => {
    const [selectedNavItem, setSelectedNavItem] = useState("");

    const [currentLang, setcurrentLang] = useState(turkishTexts);

    const navbarItems = [
        { name: "CADANCE FLOW", id: "home", path: "/" },
        { name: currentLang.navbar.studioText, id: "backToStudio", path: "https://www.cadancestudio.com" },
        { name: currentLang.navbar.helpText, id: "support", path: "/support" },
        { name: currentLang.navbar.loginText, id: "login", path: "/login" }
    ]


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, currentLang, setcurrentLang, navbarItems }}>
            {children}
        </ProjectContext.Provider>
    )
}