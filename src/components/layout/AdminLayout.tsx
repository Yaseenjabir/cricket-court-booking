import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";
import AdminHeader from "./AdminHeader";
import { useState } from "react";

const AdminLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-background overflow-hidden h-screen">
      <div className="hidden lg:block ">
        <AdminSidebar />
      </div>

      <AdminMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 w-full flex flex-col ">
        <AdminHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
