export function TimelinePanel() {
  const milestones = [
    { title: "Tender Notice Published / ጨረታው ይፋ ሆነ", date: "Oct 25, 2024 • 09:00 AM", desc: "Published on Addis Zemen, The Ethiopian Herald, and Chereta National Portal.", status: "done" },
    { title: "Mandatory Pre-Bid Site Meeting", date: "Nov 02, 2024 • 10:30 AM", desc: "Held at ERA Modjo Project Branch Office. Minutes circulated to all attendees.", status: "done" },
    { title: "Clarification Question Window Closed", date: "Nov 08, 2024 • 05:00 PM", desc: "3 inquiries received and processed by technical evaluation committee.", status: "done" },
    { title: "Clarification Responses & Addendum 1 Issued", date: "Nov 10, 2024 • 02:00 PM", desc: "Published digitally to all registered bidders.", status: "done" },
    { title: "Electronic Bid Submission Closes / የጨረታ ማስረከቢያ የመጨረሻ ቀን", date: "Tomorrow, Nov 15, 2024 • 2:00 PM EAT", desc: "Digital Bid Vault locks automatically at 14:00:00 EAT. Late submissions are cryptographically rejected by the platform.", status: "urgent" },
    { title: "Public Electronic Bid Opening & Livestream", date: "Nov 15, 2024 • 2:30 PM EAT", desc: "Bids decrypted in presence of bidders and public livestreamed via Chereta Open Bid Portal.", status: "pending" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Procurement Milestone Schedule</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Formal timeline established under Federal Procurement Guidelines</p>
      </div>
      <div className="relative pl-6 space-y-space-xl before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-surface-container-high">
        {milestones.map((m, i) => {
          const isUrgent = m.status === "urgent";
          const isDone = m.status === "done";
          return (
            <div key={i} className="relative flex items-start gap-space-lg">
              <div
                className={`absolute -left-6 mt-1 w-6 h-6 rounded-full flex items-center justify-center text-on-primary shadow-xs ${
                  isUrgent ? "bg-error ring-4 ring-error-container text-on-error" : isDone ? "bg-primary" : "bg-surface-container-high text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{isUrgent ? "priority_high" : isDone ? "check" : "lock_open"}</span>
              </div>
              <div className={`${isUrgent ? "bg-error-container/30" : "bg-surface-container-low"} p-space-md rounded-xl w-full`}>
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className={`font-label-lg text-label-lg font-semibold ${isUrgent ? "text-error" : "text-on-surface"}`}>{m.title}</div>
                  <span className={`font-mono-data text-label-sm ${isUrgent ? "font-bold text-error" : "text-on-surface-variant"}`}>{m.date}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
