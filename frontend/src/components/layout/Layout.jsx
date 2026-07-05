import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, NotebookPen, MessageCircle, CalendarDays, Menu, X } from 'lucide-react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-base flex flex-col md:flex-row relative">

      {/* Mobile Topbar */}
      <div className="md:hidden bg-sidebar border-b border-border p-4 flex items-center justify-between z-20">
        <h1 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          💚 HealthLog
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-text-primary p-2 bg-white rounded-lg border border-border shadow-sm"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-[100dvh] w-64 bg-sidebar border-r border-border p-6 flex flex-col
        transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
            💚 HealthLog AI
          </h1>
        </div>

        <nav className="flex-1 space-y-2 mt-4 md:mt-0">
          <NavLink
            to="/"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-base font-medium ${
                isActive
                  ? 'bg-[#F5CBCB] text-text-primary border-l-[3px] border-accent'
                  : 'text-text-secondary hover:bg-[#FFE2E2] hover:text-text-primary'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            Dashboard
          </NavLink>

          <NavLink
            to="/log"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-base font-medium ${
                isActive
                  ? 'bg-[#F5CBCB] text-text-primary border-l-[3px] border-accent'
                  : 'text-text-secondary hover:bg-[#FFE2E2] hover:text-text-primary'
              }`
            }
          >
            <NotebookPen className="w-5 h-5 flex-shrink-0" />
            Catat Hari Ini
          </NavLink>

          <NavLink
            to="/history"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-base font-medium ${
                isActive
                  ? 'bg-[#F5CBCB] text-text-primary border-l-[3px] border-accent'
                  : 'text-text-secondary hover:bg-[#FFE2E2] hover:text-text-primary'
              }`
            }
          >
            <CalendarDays className="w-5 h-5 flex-shrink-0" />
            Riwayat
          </NavLink>

          <NavLink
            to="/chat"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-base font-medium ${
                isActive
                  ? 'bg-[#F5CBCB] text-text-primary border-l-[3px] border-accent'
                  : 'text-text-secondary hover:bg-[#FFE2E2] hover:text-text-primary'
              }`
            }
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            Tanya AI
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <p className="text-sm text-text-muted text-center">
            Yesi Puspita
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100dvh-73px)] md:h-[100dvh]">
        <Outlet />
      </main>
    </div>
  );
}
