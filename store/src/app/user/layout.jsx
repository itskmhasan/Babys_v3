// internal import
import Sidebar from "@components/user-dashboard/Sidebar";
import { getUserServerSession } from "@lib/auth-server";

export async function generateMetadata() {
  // You can fetch user info or page data here to make metadata dynamic
  const user = await getUserServerSession(); // Your own function to fetch user details
  return {
    title: `${user?.name || "User"} - Dashboard | Kachabazar`,
    description: `Welcome back ${user?.name || "User"}!`,
  };
}

export default async function DashboardLayout({ children }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex-shrink-0 w-full lg:w-80 mr-7 lg:mr-10 xl:mr-10">
          <Sidebar />
        </div>
        <div className="w-full mt-4 lg:mt-0 p-4 sm:p-5 lg:p-8 overflow-hidden border-l border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
