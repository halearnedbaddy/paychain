import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  Lock,
  Settings2,
  Banknote,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Menu,
} from "lucide-react";
import { useAccount } from "@/hooks/useAccount";

const overviewItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const apiItems = [
  { title: "Collections", url: "/dashboard/collections", icon: CreditCard, badge: "LIVE", badgeColor: "bg-primary text-white" },
  { title: "Escrow / Hold", url: "/dashboard/escrow", icon: Lock },
  { title: "Conditions", url: "/dashboard/conditions", icon: Settings2 },
  { title: "Disbursement", url: "/dashboard/disbursement", icon: Banknote },
];

const accountItems = [
  { title: "Compliance", url: "/dashboard/compliance", icon: FileText, badge: "!", badgeColor: "bg-destructive text-white" },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Support", url: "/dashboard/support", icon: MessageSquare },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { data: account } = useAccount();
  const businessName = account?.business_name || "Dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#0a0a14]">
        <Sidebar className="border-r border-white/[0.06] bg-[#0d0d1a]">
          <SidebarContent className="bg-[#0d0d1a]">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/[0.06] mb-4">
              <span className="font-display font-extrabold text-lg text-white">
                Pay<span className="text-primary">Chain</span>
              </span>
            </div>

            {/* Overview */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[9px] font-bold tracking-[2px] uppercase text-white/25 px-5">
                Overview
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {overviewItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 mx-3 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-[rgba(108,71,255,0.2)] text-[#a78bfa]"
                                : "text-white/50 hover:text-white/70 hover:bg-white/[0.04]"
                            }`
                          }
                        >
                          <item.icon className="w-[14px] h-[14px]" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* APIs */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[9px] font-bold tracking-[2px] uppercase text-white/25 px-5">
                APIs
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {apiItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 mx-3 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-[rgba(108,71,255,0.2)] text-[#a78bfa]"
                                : "text-white/50 hover:text-white/70 hover:bg-white/[0.04]"
                            }`
                          }
                        >
                          <item.icon className="w-[14px] h-[14px]" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[9px] font-bold tracking-[2px] uppercase text-white/25 px-5">
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 mx-3 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-[rgba(108,71,255,0.2)] text-[#a78bfa]"
                                : "text-white/50 hover:text-white/70 hover:bg-white/[0.04]"
                            }`
                          }
                        >
                          <item.icon className="w-[14px] h-[14px]" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white/50 hover:text-white">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <span className="font-display font-bold text-[15px] text-white">
                Good morning, {businessName} 👋
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
                ● LIVE
              </span>
              <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                + New API Key
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
