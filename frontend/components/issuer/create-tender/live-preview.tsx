export function LivePreview() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm">
      <span className="font-label-md text-label-md text-on-surface font-bold">Public Listing Visual Preview</span>
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Civil Works • NCB</span>
          <span className="font-mono-data text-mono-data text-xs text-secondary font-bold">35 Days Left</span>
        </div>
        <p className="font-label-lg text-label-lg text-on-surface font-bold line-clamp-2">Semera-Afdera Asphalt Road Rehabilitation (Lot 3)</p>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Ethiopian Roads Administration</span>
      </div>
    </div>
  );
}
