"use client";

import { useEffect, useState } from "react";

export function TenderHeaderBanner() {
  const [clock, setClock] = useState("18h 24m 12s");

  useEffect(() => {
    let secondsRemaining = 18 * 3600 + 24 * 60 + 12;
    const interval = setInterval(() => {
      if (secondsRemaining > 0) {
        secondsRemaining -= 1;
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;
        setClock(`${hours}h ${minutes < 10 ? "0" : ""}${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
      } else {
        setClock("EXPIRED");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-surface-container-lowest shadow-sm mt-space-sm">
      <div className="max-w-[1440px] mx-auto px-gutter py-margin">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-gutter">
          <div className="space-y-space-md max-w-4xl">
            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container rounded-lg font-mono-data text-mono-data text-on-surface">
                <span className="material-symbols-outlined text-primary text-[16px]">tag</span>
                <span>Ref: ERA/NCB/58/2024</span>
              </div>
              <span className="inline-flex items-center px-space-sm py-1 bg-surface-container rounded-lg font-label-sm text-label-sm text-on-surface-variant">Civil Works • ኮንስትራክሽን</span>
              <span className="inline-flex items-center px-space-sm py-1 bg-surface-container rounded-lg font-label-sm text-label-sm text-on-surface-variant">National Competitive Bidding (NCB)</span>
              <div className="inline-flex items-center gap-1 px-space-sm py-1 bg-surface-container rounded-lg font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>FDRE PPA Directive 2016/2024 Compliant</span>
              </div>
            </div>
            <div className="space-y-space-xs">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Periodic Maintenance and Asphalt Concrete Overlay of Modjo-Adama Expressway Link (Package II)
              </h1>
              <p className="font-headline-sm text-headline-sm text-on-surface-variant">
                የሞጆ-አዳማ የፍጥነት መንገድ ማያያዣ ወቅታዊ ጥገና እና የአስፋልት ኮንክሪት ስራ (ምድብ 2)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-lg pt-space-xs">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[24px]">account_balance</span>
                </div>
                <div>
                  <div className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <span>Ethiopian Roads Administration (ERA)</span>
                    <span className="text-secondary inline-flex items-center" title="Verified Federal Procurement Entity">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">የኢትዮጵያ መንገዶች አስተዳደር • Federal Ministerial Agency</div>
                </div>
              </div>
              <div className="hidden sm:block w-[1px] h-9 bg-surface-dim" />
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                <span>Oromia Region, East Shewa Zone (48.5 KM Corridor)</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-auto min-w-[300px] bg-error-container/40 p-space-lg rounded-xl flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between pb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
                </span>
                Bid Closing Countdown / የቀረው ጊዜ
              </span>
              <span className="material-symbols-outlined text-error text-[18px]">alarm</span>
            </div>
            <div className="py-space-xs">
              <div className="font-mono-data text-[28px] leading-8 font-bold text-on-error-container tracking-wider">{clock}</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Submission Closes: <strong className="font-semibold text-on-surface">Tomorrow, Nov 15, 2024 • 2:00 PM EAT</strong>
              </div>
            </div>
            <div className="pt-space-sm mt-space-xs bg-surface-container-lowest/60 rounded p-space-xs flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Addis Ababa Local Time</span>
              <span className="font-mono-data text-mono-data text-primary font-semibold">UTC +3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}