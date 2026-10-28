"use client";

import { useEffect, useState } from "react";

export function StandstillBanner() {
  const [days, setDays] = useState("06");
  const [hours, setHours] = useState("14");
  const [mins, setMins] = useState("22");

  useEffect(() => {
    let secondsRemaining = 6 * 86400 + 14 * 3600 + 22 * 60;
    const interval = setInterval(() => {
      if (secondsRemaining <= 0) { clearInterval(interval); return; }
      secondsRemaining--;
      const d = Math.floor(secondsRemaining / 86400);
      const h = Math.floor((secondsRemaining % 86400) / 3600);
      const m = Math.floor((secondsRemaining % 3600) / 60);
      setDays(String(d).padStart(2, "0"));
      setHours(String(h).padStart(2, "0"));
      setMins(String(m).padStart(2, "0"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mb-space-xl">
      <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary shrink-0"><span className="material-symbols-outlined text-[28px]">timer</span></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs"><span className="font-label-lg text-label-lg font-bold text-on-surface">FDRE Proclamation No. 649/2009 Directive Standstill Window</span><span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">Article 43.2</span></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Mandatory 7-day standstill observation period for grievance submission prior to binding bilateral contract signing.</p>
            <div className="flex items-center gap-space-md mt-space-sm font-mono-data text-mono-data text-on-surface-variant"><span>Started: <strong className="text-on-surface">Nov 24, 2024 (15 Hidar)</strong></span><span>•</span><span>Expiry: <strong className="text-on-surface">Dec 01, 2024, 17:00 EAT</strong></span></div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-lg py-space-sm rounded-xl shrink-0 self-stretch md:self-auto justify-center">
          <div className="flex flex-col items-center"><span className="font-headline-md text-headline-md font-bold text-primary font-mono-data">{days}</span><span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days</span></div>
          <span className="font-headline-md text-headline-md text-on-surface-variant -mt-3 font-mono-data">:</span>
          <div className="flex flex-col items-center"><span className="font-headline-md text-headline-md font-bold text-primary font-mono-data">{hours}</span><span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hours</span></div>
          <span className="font-headline-md text-headline-md text-on-surface-variant -mt-3 font-mono-data">:</span>
          <div className="flex flex-col items-center"><span className="font-headline-md text-headline-md font-bold text-primary font-mono-data">{mins}</span><span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Mins</span></div>
        </div>
      </div>
      <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between"><span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">FPPA Grievance Gateway</span><span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary bg-primary-fixed/40 px-2 py-0.5 rounded font-semibold"><span className="material-symbols-outlined text-[14px]">gavel</span> PPA Synced</span></div>
        <div className="flex items-center gap-space-md my-space-sm"><div className="w-10 h-10 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">check_circle</span></div><div><div className="font-headline-sm text-headline-sm font-bold text-on-surface">0 Formal Complaints Filed</div><div className="font-body-sm text-body-sm text-on-surface-variant">ምንም አይነት ቅሬታ አልቀረበም • Status Clear</div></div></div>
        <a className="inline-flex items-center justify-between text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold transition-colors pt-space-xs" href="#"><span>View Public Procurement Grievance Board Log</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></a>
      </div>
    </section>
  );
}
