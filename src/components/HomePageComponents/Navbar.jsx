import { Link } from "react-router";
import { useContext, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext"
import styles from "../../styles/Navbar.module.css"
import LanguageButton from "../LanguageButton"
//REACT ICONS
import { MdMenu, MdClose } from "react-icons/md";

const Navbar = () => {
    const { navbarItems } = useContext(ProjectContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
    };

    return (
        <nav className={styles.navContainer}>
            <Link className={styles.logo} to={navbarItems[0].path}>
                <span>CADANCE</span> FLOW
            </Link>

            {/* Hamburger Button */}
            <button className={styles.hamburger} onClick={toggleMenu}>
                {isMenuOpen ? <MdClose /> : <MdMenu />}
            </button>

            {/* Navigation Links */}
            <div className={`${styles.rightNavContainer} ${isMenuOpen ? styles.showMenu : ""}`}>
                {navbarItems.map((navItem) => (
                    navItem.id !== "home" && (
                        <Link
                            key={navItem.id}
                            to={navItem.path}
                            onClick={() => {
                                if (isMenuOpen) toggleMenu();
                            }}
                        >
                            {navItem.name}
                        </Link>
                    )
                ))}
                <LanguageButton />
            </div>
        </nav>
    );
};

export default Navbar;