import { Link } from "react-router";
import styles from "../styles/LoginBackButton.module.css"
import { IoMdArrowBack } from "react-icons/io";

const LoginPageBackButton = () => {
    return (
        <Link className={styles.backButtonDiv} to={"/"}>
            <IoMdArrowBack className={styles.backButton} />
        </Link>
    )
}

export default LoginPageBackButton