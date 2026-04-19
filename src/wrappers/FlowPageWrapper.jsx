import { Outlet } from "react-router";
import TopBar from "../components/FlowPageComponents/TopBar";
import Sidebar from "../components/FlowPageComponents/Sidebar";
import MobileNav from "../components/FlowPageComponents/MobileNav";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../components/Loader";
import { Navigate } from "react-router";


const FlowPageWrapper = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    if (isLoading) return <Loader />;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
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