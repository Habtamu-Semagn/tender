import Link from "next/link";

const NAV = [
  { icon: "grid_view", label: "Dashboard", am: "", path: "dashboard", active: true },
  { icon: "travel_explore", label: "Browse Tenders", am: "የጨረታ ዝርዝር", path: "browse-tenders" },
  { icon: "assignment", label: "My Bids", am: "የእኔ ጨረታዎች", path: "my-bids", badge: "4" },
  { icon: "bookmark", label: "Saved Tenders", am: "የተቀመጡ", path: "saved-tenders" },
  { icon: "chat", label: "Messages", am: "መልዕክቶች", path: "messages", dot: true },
  { icon: "account_balance", label: "Payments & CPO", am: "ክፍያዎች እና ሲፒኦ", path: "payments-and-cpo" },
  { icon: "domain", label: "Company Profile", am: "የድርጅት መረጃ", path: "company-profile" },
  { icon: "settings", label: "Settings", am: "ቅንብሮች", path: "settings" },
];

export function BidderSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="h-16 px-space-xl flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[24px]">gavel</span>
            </div>
            <div>
              <span className="font-label-lg text-label-lg text-primary tracking-wide block uppercase leading-none">Chereta</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight block">Bidder Portal</span>
            </div>
          </div>
          <div className="px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface font-mono-data text-label-sm">v2.4</div>
        </div>
        <nav className="px-space-md py-space-sm space-y-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href="#"
              className={`flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all ${
                item.active
                  ? "bg-primary text-on-primary font-label-lg shadow-sm"
                  : "text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="leading-snug">{item.label}</span>
                  {item.am && <span className="font-label-sm text-label-sm opacity-80 font-normal">{item.am}</span>}
                </div>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-mono-data text-label-sm font-semibold">{item.badge}</span>
              )}
              {item.dot && <span className="w-2 h-2 rounded-full bg-tertiary-container" />}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-space-md bg-surface-container-low space-y-space-sm">
        <div className="p-space-sm rounded-xl bg-surface-container flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">GC-1 Contractor</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
            <span className="truncate">MOTRI Verified Tier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          </div>
        </div>
        <div className="flex items-center justify-between px-space-xs pt-1">
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1" href="#">
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Switch Role</span>
          </Link>
          <Link className="font-label-sm text-label-sm text-error hover:text-error flex items-center gap-1" href="#">
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Log out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
