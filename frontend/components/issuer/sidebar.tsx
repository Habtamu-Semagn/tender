import Link from "next/link";

const NAV1 = [
  { icon: "space_dashboard", label: "Dashboard", path: "dashboard", active: true },
  { icon: "add_circle", label: "Create Tender", path: "create-tender" },
  { icon: "gavel", label: "My Tenders", path: "my-tenders" },
  { icon: "fact_check", label: "Evaluations", path: "evaluations" },
  { icon: "history_edu", label: "Contracts", path: "contracts" },
  { icon: "mark_email_unread", label: "Messages", path: "messages", badge: "4" },
];
const NAV2 = [
  { icon: "account_balance", label: "Organization Profile", path: "organization-profile" },
  { icon: "tune", label: "Settings", path: "settings" },
];

export function IssuerSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-low">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline-sm text-headline-sm shadow-sm">ጨ</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Chereta</span>
              <span className="font-label-sm text-label-sm text-secondary px-space-xs bg-secondary-fixed/40 rounded">e-GP</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">የጨረታ ፖርታል • Issuer</span>
          </div>
        </div>
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs mb-space-xs"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Procurement Desk / የጨረታ ክፍል</span></div>
          <nav className="flex flex-col gap-space-xs">
            {NAV1.map((n) => (
              <Link key={n.path} href="#" className={`flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-xl ${n.active ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                <span className="font-label-lg text-label-lg">{n.label}</span>
                {n.badge && <span className="ml-auto w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-bold">{n.badge}</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-space-md pt-space-md px-space-sm pb-space-xs"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Governance &amp; Config</span></div>
          <nav className="flex flex-col gap-space-xs">
            {NAV2.map((n) => (
              <Link key={n.path} href="#" className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                <span className="font-label-lg text-label-lg">{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="p-space-md bg-surface-container/60">
        <div className="p-space-sm rounded-xl bg-surface-container-lowest mb-space-sm shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-space-xs mb-space-xs"><span className="material-symbols-outlined text-primary text-[18px]">verified</span><span className="font-label-sm text-label-sm text-primary font-bold">FPPA Accredited Entity</span></div>
          <div className="font-body-sm text-body-sm text-on-surface-variant leading-tight">FDRE Public Procurement &amp; Property Authority Tier-1 Licensed</div>
        </div>
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant">Active Role</span><span className="font-label-md text-label-md text-on-surface font-semibold">Approving Officer</span></div>
          <button className="flex items-center justify-center p-space-xs rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">swap_horiz</span></button>
        </div>
      </div>
    </aside>
  );
}
