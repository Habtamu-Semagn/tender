"use client";

const TABS = [
  { id: "overview", label: "Overview", am: "አጠቃላይ", icon: "article" },
  { id: "requirements", label: "Eligibility & Criteria", am: "መስፈርቶች", icon: "rule" },
  { id: "documents", label: "Documents & BoQ", am: "ሰነዶች", icon: "folder_open", badge: "6" },
  { id: "timeline", label: "Timeline", am: "የጊዜ ሰሌዳ", icon: "schedule" },
  { id: "clarifications", label: "Q&A", am: "ማብራሪያዎች", icon: "live_help", badge: "3", badgeClass: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "addenda", label: "Addenda", am: "ተጨማሪ", icon: "notification_important", badge: "1", badgeClass: "bg-error-container text-on-error-container" },
];

export function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xs overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`tab-trigger px-space-lg py-2.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>
                {tab.label} <span className="opacity-80 font-normal">({tab.am})</span>
              </span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full font-mono-data text-[10px] ${
                    tab.badgeClass ?? "bg-surface-container-high text-on-surface"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}