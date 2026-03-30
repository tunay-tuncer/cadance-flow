import { Link } from "react-router";
import { useContext } from "react"
import { ProjectContext } from "../../context/ProjectContext";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return (
        <nav>Navbar</nav>
    )
}

export default Navbar