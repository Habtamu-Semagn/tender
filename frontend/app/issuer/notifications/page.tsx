"use client";

import { useState } from "react";
import { IssuerSidebar } from "@/components/issuer/sidebar";
import { IssuerTopbar } from "@/components/issuer/topbar";
import { NotificationsHeader } from "@/components/issuer/notifications/notifications-header";
import { NotificationsHub } from "@/components/issuer/notifications/notifications-hub";
import { ClarificationDesk } from "@/components/issuer/notifications/clarification-desk";
import { ComplianceFootnote } from "@/components/issuer/notifications/compliance-footnote";

export default function NotificationsPage() {
  const [allRead, setAllRead] = useState(false);
  return (
    <div className="bg-background font-body-md text-on-surface">
      <IssuerSidebar />
      <div className="pl-64">
        <IssuerTopbar />
        <main className="relative w-full pt-16 bg-background px-space-xl py-space-lg min-h-screen">
          <div className="flex flex-col w-full">
            <NotificationsHeader allRead={allRead} onMarkAllRead={() => setAllRead(true)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <NotificationsHub allRead={allRead} />
              <ClarificationDesk />
            </div>
            <ComplianceFootnote />
          </div>
        </main>
      </div>
    </div>
  );
}
