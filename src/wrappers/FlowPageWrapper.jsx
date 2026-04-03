import { Outlet } from "react-router";
import Navbar from "../components/FlowPageComponents/Navbar";;

const FlowPageWrapper = () => {
    return (
        <div className="pageWrapperContainer">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default FlowPageWrapper