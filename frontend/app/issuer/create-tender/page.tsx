import { IssuerSidebar } from "@/components/issuer/sidebar";
import { IssuerTopbar } from "@/components/issuer/topbar";
import { WizardHeader } from "@/components/issuer/create-tender/wizard-header";
import { BasicInfoForm } from "@/components/issuer/create-tender/basic-info-form";
import { RegulatoryGuidance } from "@/components/issuer/create-tender/regulatory-guidance";
import { DossierChecklist } from "@/components/issuer/create-tender/dossier-checklist";
import { LivePreview } from "@/components/issuer/create-tender/live-preview";
import { FormFooter } from "@/components/issuer/create-tender/form-footer";

export default function CreateTenderPage() {
  return (
    <div className="bg-background font-body-md text-on-surface">
      <IssuerSidebar />
      <div className="pl-64">
        <IssuerTopbar />
        <main className="relative w-full pt-16 bg-background px-space-xl py-space-lg min-h-screen">
          <div className="flex flex-col w-full">
            <WizardHeader />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <BasicInfoForm />
                <RegulatoryGuidance />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <DossierChecklist />
                <LivePreview />
              </div>
            </div>
            <FormFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
