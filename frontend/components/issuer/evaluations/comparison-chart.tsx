import Image from "next/image";

export function ComparisonChart() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span><span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Technical vs Financial Spread Comparison</span></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Normalized 100-Point Vector</span>
      </div>
      <div className="w-full bg-surface-container-low rounded-xl p-space-md">
        <svg className="w-full h-44" preserveAspectRatio="none" viewBox="0 0 600 160">
          <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="2,2" x1="120" x2="580" y1="20" y2="20" />
          <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="2,2" x1="120" x2="580" y1="55" y2="55" />
          <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="2,2" x1="120" x2="580" y1="90" y2="90" />
          <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="2,2" x1="120" x2="580" y1="125" y2="125" />
          <text className="fill-current text-on-surface font-mono-data text-[11px] font-semibold" x="10" y="32">#03 Afro-Tsion</text>
          <rect className="fill-current text-primary" height="18" rx="3" width="310" x="120" y="20" />
          <rect className="fill-current text-secondary" height="18" rx="3" width="147" x="432" y="20" />
          <text className="fill-current text-primary font-mono-data text-[11px] font-bold" x="585" y="33">91.35</text>
          <text className="fill-current text-on-surface font-mono-data text-[11px] font-semibold" x="10" y="67">#01 Sunshine</text>
          <rect className="fill-current text-primary/80" height="18" rx="3" width="288" x="120" y="55" />
          <rect className="fill-current text-secondary" height="18" rx="3" width="150" x="410" y="55" />
          <text className="fill-current text-on-surface font-mono-data text-[11px]" x="565" y="68">87.75</text>
          <text className="fill-current text-on-surface font-mono-data text-[11px] font-semibold" x="10" y="102">#04 Sur Const.</text>
          <rect className="fill-current text-primary/70" height="18" rx="3" width="288" x="120" y="90" />
          <rect className="fill-current text-secondary" height="18" rx="3" width="145" x="410" y="90" />
          <text className="fill-current text-on-surface font-mono-data text-[11px]" x="560" y="103">86.71</text>
          <text className="fill-current text-on-surface font-mono-data text-[11px] font-semibold" x="10" y="137">#02 Rama Ltd</text>
          <rect className="fill-current text-primary/60" height="18" rx="3" width="262" x="120" y="125" />
          <rect className="fill-current text-secondary" height="18" rx="3" width="143" x="384" y="125" />
          <text className="fill-current text-on-surface font-mono-data text-[11px]" x="532" y="138">81.14</text>
        </svg>
        <div className="flex items-center justify-center gap-space-lg mt-space-sm pt-space-xs">
          <div className="flex items-center gap-space-xs"><span className="w-3 h-3 rounded bg-primary" /><span className="font-label-sm text-label-sm text-on-surface-variant">Technical Score Weight (70%)</span></div>
          <div className="flex items-center gap-space-xs"><span className="w-3 h-3 rounded bg-secondary" /><span className="font-label-sm text-label-sm text-on-surface-variant">Financial Score Weight (30%)</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-lg">
        <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-xs">
          <div className="h-36 relative">
            <Image className="w-full h-full object-cover" alt="Technical evaluation field audit site on the Semera-Afdera highway in the Afar Depression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC42H1CjooHschDVMgSOjvJFFyiHwQFaP7_Xd1WDhUvXxQpknbEC_AoIuFgYqpYZeje7eUkLwsa7cmO0So2sFh5_GfhcRRBxLKJDvw_6NAzw46mPVG4BeW1DiM7_j2mMurh3H0mFvelJceArjN0lZQrbZvGG0Dbv5HsFBEt96QW6yDRvFCbBEOILTNqpH4ay4JnAl_eZP9v18UIflv_KScQm5C73J9fxCO0ymxcsOaSHy8MiBfGNEeJ-w" fill sizes="50vw" />
            <span className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold text-on-surface">Lot 3 Site Km 24+000 (Semera)</span>
          </div>
          <div className="p-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold block">Site Baseline Survey</span><span className="font-body-sm text-body-sm text-on-surface-variant">Initial civil condition audit logged on 08 Hidar 2016 E.C. by ERA Engineering Inspection Bureau.</span></div>
        </div>
        <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-xs">
          <div className="h-36 relative">
            <Image className="w-full h-full object-cover" alt="Heavy industrial asphalt batching plant facility owned by Afro-Tsion construction" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgD5GOZ3XaN5Bx_tz2ZAbTiltQ2jnEZhKbwPpCDb2Irv1bAgVRYqWAEqbNGLftVoWNEEOcJUOi3I_Js5t4G-9Ieg7eFWn0IGSztbIw1El0yFve4HrhWuVnEMFnNNmhQqFaCiBKzy84RkpkQP1vA3rx_GWmccjX7KwIF9a7JGq1SdCRRrj61r1R3UwiYQR37jWynfZs6QlXeD0UeBfy9QLGibZ_8QqavreGkZ00uGy2tfdq2O01s1VMtg" fill sizes="50vw" />
            <span className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold text-on-surface">Verified Plant Asset: Mile Depot</span>
          </div>
          <div className="p-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold block">Equipment Physical Verification</span><span className="font-body-sm text-body-sm text-on-surface-variant">120 t/h mobile batching plant inspected by Evaluation Member Eng. Firew Tadesse.</span></div>
        </div>
      </div>
    </div>
  );
}
