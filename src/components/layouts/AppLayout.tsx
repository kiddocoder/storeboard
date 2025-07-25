import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideNavar from "./SideNav";
import { useState } from "react";


function AppLayout() {
    const [isOpen, setIsOpen] = useState(true);
    const [activeView, setActiveView] = useState("");
    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="flex flex-col h-screen">
            <Header onMenuToggle={handleMenuToggle} />
            <div className="flex flex-1">
                <SideNavar isOpen={isOpen} onClose={handleMenuToggle} activeView={activeView} setActiveView={() => { }} />
                <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout;
