import { useEffect, useState } from 'react'
import styles from "../styles/ScrollToTopButton.module.css"

import { FaCaretUp } from "react-icons/fa";

const ScrollToTopButton = () => {
    const [buttonOpacity, setButtonOpacity] = useState(0);
    const [buttonDisplay, setButtonDisplay] = useState("none");

    useEffect(() => {
        const handleButtonOpacity = () => {
            window.pageYOffset > 0 ? (setButtonOpacity(1), setButtonDisplay("flex")) : (setButtonOpacity(0), setButtonDisplay("none"))
        }
        window.addEventListener("scroll", handleButtonOpacity);

        return () => {
            window.removeEventListener("scroll", handleButtonOpacity);
        };
    }, [])

    const handleScrollEvent = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <button className={styles.scrollButton} style={{ opacity: `${buttonOpacity}`, display: `${buttonDisplay}` }} onClick={handleScrollEvent}><FaCaretUp /></button>
    )
}

export default ScrollToTopButton