import Link from "next/link";

const NAV = [
  { icon: "grid_view", label: "Overview", am: "ዳሽቦርድ", path: "overview", active: true },
  { icon: "verified_user", label: "Verification Queue", am: "የማረጋገጫ ተራ", path: "verification-queue", badge: "8" },
  { icon: "gavel", label: "Tenders", am: "ጨረታዎች", path: "tenders" },
  { icon: "badge", label: "Users", am: "ተጠቃሚዎች", path: "users" },
  { icon: "account_balance", label: "Payments & Escrow", am: "ክፍያዎች እና ሲፒኦ", path: "payments-and-escrow" },
  { icon: "policy", label: "Reports & Compliance", am: "ሪፖርቶች", path: "reports-and-compliance" },
  { icon: "settings_suggest", label: "System Settings", am: "ቅንብሮች", path: "system-settings" },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        <div className="h-16 px-space-lg flex items-center gap-space-md bg-surface-container-lowest">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-primary text-[22px]">shield</span></div>
          <div className="flex flex-col min-w-0"><span className="font-label-lg text-label-lg text-primary truncate leading-tight tracking-tight">FPPA CHERETA</span><span className="font-label-sm text-label-sm text-on-surface-variant truncate">የግዥና ንብረት ባለስልጣን</span></div>
        </div>
        <div className="px-space-lg pt-space-md pb-space-xs"><div className="px-space-sm py-space-xs bg-surface-container-low rounded-lg flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Root Administration</span><span className="w-2 h-2 rounded-full bg-primary" /></div></div>
        <nav className="flex flex-col gap-space-xs px-space-md mt-space-sm">
          {NAV.map((n) => (
            <Link key={n.path} href="#" className={`flex items-center ${n.badge ? "justify-between" : "gap-space-md"} px-space-md py-space-sm rounded-xl font-label-md text-label-md transition-colors ${n.active ? "bg-primary-container text-on-primary shadow-[0_1px_4px_rgba(11,107,58,0.25)]" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
              <div className="flex items-center gap-space-md"><span className="material-symbols-outlined text-[20px]">{n.icon}</span><div className="flex flex-col"><span className="leading-tight">{n.label}</span><span className="font-label-sm text-label-sm opacity-80 font-normal">{n.am}</span></div></div>
              {n.badge && <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono-data text-mono-data font-bold">{n.badge}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-space-md m-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs">
        <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Cluster 01 • Addis Central</span><span className="inline-flex items-center gap-1 font-mono-data text-label-sm text-primary font-semibold"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />Online</span></div>
        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm"><span>FPPA Root CA Auth</span><span className="font-mono-data text-mono-data text-on-surface">v4.2.1-SEC</span></div>
        <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-space-xs"><div className="bg-primary h-full w-full rounded-full" /></div>
      </div>
    </aside>
  );
}
