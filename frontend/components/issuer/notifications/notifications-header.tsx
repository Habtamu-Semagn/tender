"use client";

export function NotificationsHeader({ allRead, onMarkAllRead }: { allRead: boolean; onMarkAllRead: () => void }) {
  return (
    <section className="flex flex-col gap-space-md mb-space-lg">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Notifications &amp; Inquiries</h1>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">| ማሳወቂያዎች እና የጨረታ ጥያቄዎች</span>
            <span className="px-space-sm py-space-xs rounded-xl bg-primary/10 text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />Real-time FPPA Feed</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Statutory deadline countdowns, formal pre-bid clarifications, digital escrow confirmations, and procurement committee circulars.</p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <button className={`h-10 px-space-md rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors font-label-lg text-label-lg shadow-sm flex items-center gap-space-xs ${allRead ? "opacity-60 cursor-default" : ""}`} onClick={onMarkAllRead} type="button"><span className="material-symbols-outlined text-[18px]">done_all</span><span>{allRead ? "All Read" : "Mark all as read"}</span><span className="text-on-surface-variant font-normal font-body-sm">(ሁሉንም አንብብ)</span></button>
          <button className="h-10 px-space-md rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg shadow-sm flex items-center gap-space-xs" type="button"><span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span><span>Preferences</span></button>
          <div className="relative w-64"><span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">filter_list</span><input className="w-full h-10 pl-9 pr-space-md bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-xl focus:outline-none shadow-sm" placeholder="Search notices, ref #... / ፈልግ..." type="text" /></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between"><div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Unread Alerts</span><span className="font-headline-lg text-headline-lg text-on-surface mt-0.5">{allRead ? 0 : 4} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/ 12 total</span></span><span className="font-label-sm text-label-sm text-primary font-medium mt-1">2 high priority</span></div><div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[24px]">notifications_active</span></div></div>
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between"><div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Clarification Replies</span><span className="font-headline-lg text-headline-lg text-on-surface mt-0.5">2 New</span><span className="font-label-sm text-label-sm text-primary font-medium mt-1">Addendum published</span></div><div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[24px]">forum</span></div></div>
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between"><div className="flex flex-col"><span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Urgent Closing</span><div className="flex items-baseline gap-1 mt-0.5"><span className="font-headline-lg text-headline-lg text-secondary">18h 12m</span></div><span className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[150px]">ERA/NCB/58/2024</span></div><div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[24px]">hourglass_top</span></div></div>
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between"><div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Escrow / CPO Status</span><span className="font-headline-lg text-headline-lg text-on-surface mt-0.5">Verified</span><span className="font-mono-data text-mono-data text-primary font-semibold mt-1">ETB 500,000.00 CBE</span></div><div className="w-12 h-12 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[24px]">verified_user</span></div></div>
      </div>
    </section>
  );
}
