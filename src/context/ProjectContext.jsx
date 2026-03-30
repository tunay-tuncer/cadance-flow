import { createContext, useState, useEffect } from "react";
import tr from "../language/tr.json";
import en from "../language/en.json";

export const ProjectContext = createContext({})

const languages = { tr, en };

export const ProjectContextProvider = ({ children }) => {
    const [selectedNavItem, setSelectedNavItem] = useState("");

    const [langCode, setLangCode] = useState(() => {
        return localStorage.getItem('appLanguage') || 'tr';
    });
    const currentLang = languages[langCode];

    useEffect(() => {
        localStorage.setItem('appLanguage', langCode);
    }, [langCode]);

    const navbarItems = [
        { name: "CADANCE FLOW", id: "home", path: "/" },
        { name: currentLang.navbar.studioText, id: "backToStudio", path: "https://www.cadancestudio.com" },
        { name: currentLang.navbar.helpText, id: "support", path: "/support" },
        { name: currentLang.navbar.loginText, id: "login", path: "/login" }
    ]

    // const flowPageNavbarItems = [
    //     { name: currentLang.flowPageNavbarItems.topNavItems.dashboard, id: "backToStudio", path: "https://www.cadancestudio.com" },
    //     { name: currentLang.flowPageNavbarItems.topNavItems.ongoingProjects, id: "support", path: "/support" },
    //     { name: currentLang.flowPageNavbarItems.topNavItems.completedProjects, id: "login", path: "/login" }
    // ]


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, currentLang, langCode, setLangCode, navbarItems }}>
            {children}
        </ProjectContext.Provider>
    )
}