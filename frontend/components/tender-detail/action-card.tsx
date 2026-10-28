"use client";

import { useState } from "react";

export function ActionCard() {
  const [bookmarked, setBookmarked] = useState(false);

  const shareTender = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Tender link copied to clipboard! (የጨረታው ሊንክ ተቀድቷል)");
    } else {
      alert("Share tender reference: ERA/NCB/58/2024");
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-lg sticky top-20">
      <div className="space-y-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Direct Electronic Bid</span>
          <div className="inline-flex items-center gap-1 text-primary font-mono-data text-[12px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Encrypted Vault</span>
          </div>
        </div>
        <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Submit Your Proposal</div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Submit two-envelope technical &amp; financial proposals securely before deadline.</p>
      </div>
      <div className="space-y-space-xs">
        <button className="w-full bg-primary-container hover:bg-primary text-on-primary py-3 px-space-lg rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99]">
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <span>Place E-Bid / ጨረታ አስገባ</span>
        </button>
        <div className="flex items-center justify-center gap-1 font-body-sm text-body-sm text-on-surface-variant text-center">
          <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
          <span>Instant CBE &amp; Telebirr CPO Verification</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
        <button
          type="button"
          onClick={() => setBookmarked((b) => !b)}
          className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all gap-1 group ${bookmarked ? "bg-surface-container" : ""}`}
        >
          <span className={`material-symbols-outlined text-[18px] group-hover:text-primary ${bookmarked ? "text-primary" : ""}`}>{bookmarked ? "bookmark" : "bookmark_border"}</span>
          <span className="font-label-sm text-[11px] leading-tight">{bookmarked ? "Saved" : "Save Tender"}</span>
        </button>
        <button type="button" onClick={shareTender} className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all gap-1 group">
          <span className="material-symbols-outlined text-[18px] group-hover:text-primary">share</span>
          <span className="font-label-sm text-[11px] leading-tight">Share Link</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all gap-1 group">
          <span className="material-symbols-outlined text-[18px] group-hover:text-primary">download</span>
          <span className="font-label-sm text-[11px] leading-tight">Dossier (ZIP)</span>
        </button>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
            <span>Bid Security (CPO / ዋስትና)</span>
          </span>
          <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[10px] font-bold">MANDATORY</span>
        </div>
        <div className="font-mono-data text-headline-sm text-on-surface font-bold">ETB 500,000.00</div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Certified Bank Guarantee (CPO) or Electronic Bid Bond via Commercial Bank of Ethiopia (CBE) API hold or Telebirr SuperApp verified hold.</p>
      </div>
      <div className="bg-surface-container p-space-sm rounded-lg flex items-start gap-space-xs">
        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">security</span>
        <div className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          <strong className="font-semibold text-on-surface">SHA-256 Encrypted Bid Box:</strong> Tamper-evident vault locks until the official public bid opening on Nov 15, 2024 • 2:30 PM.
        </div>
      </div>
    </div>
  );
}
