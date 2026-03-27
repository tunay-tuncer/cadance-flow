import styles from "../styles/Hero.module.css";
import HeroRightContainer from "./HeroRightContainer";
import { useContext } from "react";
import { Link } from "react-router"
import { ProjectContext } from "../context/ProjectContext";

const Hero = () => {
    const { currentLang } = useContext(ProjectContext);


    return (
        <div className={styles.heroMainContainer}>
            <div className={styles.leftContainer}>
                <h1>{currentLang.leftContainerText.header}</h1>
                <span className={styles.headerBlue}>{currentLang.leftContainerText.span}</span>
                <p className={styles.leftContainerParagraph}>{currentLang.leftContainerText.paragraph}</p>
                <Link to={"./login"} className={styles.leftContainerButton}>{currentLang.leftContainerText.button}</Link>
            </div>
            <HeroRightContainer />
        </div>
    )
}

export default Hero