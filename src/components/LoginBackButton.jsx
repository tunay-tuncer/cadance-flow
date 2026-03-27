import { Link } from "react-router";
import styles from "../styles/LoginBackButton.module.css"
import { IoMdArrowBack } from "react-icons/io";

const LoginBackButton = () => {
    return (
        <Link className={styles.backButtonDiv} to={"/"}>
            <IoMdArrowBack className={styles.backButton} />
        </Link>
    )
}

export default LoginBackButton