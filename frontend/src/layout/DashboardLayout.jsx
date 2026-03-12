import SidebarMenu from "./SidebarMenu";
import Header from "./Header";

export default function DashboardLayout({ children }) {

    return (
        <div className="flex">

            <SidebarMenu />

            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header />

                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}