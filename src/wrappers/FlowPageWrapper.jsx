import { Outlet } from "react-router";
import TopBar from "../components/FlowPageComponents/TopBar";
import Sidebar from "../components/FlowPageComponents/Sidebar";
import MobileNav from "../components/FlowPageComponents/MobileNav";

const FlowPageWrapper = () => {
    return (
        <div className="pageWrapperContainer">
            <TopBar />
            <Sidebar />
            <main>
                <Outlet />
            </main>
            <MobileNav />

        </div>
    );
}

export default FlowPageWrapper