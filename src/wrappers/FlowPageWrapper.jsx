import { Outlet } from "react-router";
import Navbar from "../components/FlowPageComponents/Navbar";
// import styles from "../styles/FlowLayout.module.css";

const FlowPageWrapper = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* This is where subpages render */}
            </main>
        </div>
    );
}

export default FlowPageWrapper