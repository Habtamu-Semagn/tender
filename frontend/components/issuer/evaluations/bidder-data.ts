export type Bidder = {
  id: string;
  rank: string;
  name: string;
  grade: string;
  price: string;
  variance: string;
  c1: number; c2: number; c3: number; c4: number; c5: number;
  totalTech: string;
  weightedTech: string;
  weightedFin: string;
  finalScore: string;
  notes: string;
  awardEligible: boolean;
  rowClass: string;
  envNo: string;
  financial: string;
  techDisplay: string;
  finDisplay: string;
  totalDisplay: string;
  statutory: string;
  actionBadge: string;
  actionBadgeClass: string;
};

export const BIDDERS: Bidder[] = [
  { id: "bidder-3", rank: "Rank 1 • Envelope #03", name: "Afro-Tsion Construction Plc", grade: "GC-1 / RC-1 (License #AA-CON-48291)", price: "ETB 466,750,000.00", variance: "-3.8% below ceiling", c1: 18.5, c2: 22.0, c3: 23.0, c4: 17.5, c5: 7.5, totalTech: "88.5 / 100", weightedTech: "61.95 pts", weightedFin: "29.40 pts", finalScore: "91.35 pts", notes: "Bidder demonstrated superior asphalt plant proximity (Mile/Semera corridor) and verified 4 high-grade road supervisory engineers. Financial offer is 3.8% below engineer ceiling with zero mathematical BoQ deviations.", awardEligible: true, rowClass: "bg-surface-container-high/80", envNo: "#03", financial: "466,750,000.00", techDisplay: "61.95", finDisplay: "29.40", totalDisplay: "91.35", statutory: "100%", actionBadge: "Recommended", actionBadgeClass: "bg-primary-fixed/80 text-on-primary-fixed" },
  { id: "bidder-1", rank: "Rank 2 • Envelope #01", name: "Sunshine Construction Plc", grade: "GC-1 (License #AA-CON-10928)", price: "ETB 457,400,000.00", variance: "-5.7% below ceiling", c1: 17.0, c2: 21.0, c3: 20.5, c4: 16.0, c5: 8.0, totalTech: "82.5 / 100", weightedTech: "57.75 pts", weightedFin: "30.00 pts", finalScore: "87.75 pts", notes: "Lowest responsive financial quote. Strong equipment base, but site mobilization timeline slightly exceeds standard delivery window by 14 days.", awardEligible: true, rowClass: "bg-surface-container-lowest", envNo: "#01", financial: "457,400,000.00", techDisplay: "57.75", finDisplay: "30.00", totalDisplay: "87.75", statutory: "100%", actionBadge: "Responsive", actionBadgeClass: "bg-surface-container text-on-surface" },
  { id: "bidder-4", rank: "Rank 3 • Envelope #04", name: "Sur Construction Plc", grade: "GC-1 / RC-1 (License #MK-CON-99312)", price: "ETB 473,890,000.00", variance: "-2.3% below ceiling", c1: 17.5, c2: 20.5, c3: 21.0, c4: 16.5, c5: 7.0, totalTech: "82.5 / 100", weightedTech: "57.75 pts", weightedFin: "28.96 pts", finalScore: "86.71 pts", notes: "Fully responsive proposal with verified ongoing projects with ERA. All BoQ lines verified without computational discrepancy.", awardEligible: true, rowClass: "bg-surface-container-low/40", envNo: "#04", financial: "473,890,000.00", techDisplay: "57.75", finDisplay: "28.96", totalDisplay: "86.71", statutory: "100%", actionBadge: "Responsive", actionBadgeClass: "bg-surface-container text-on-surface" },
  { id: "bidder-2", rank: "Rank 4 • Envelope #02", name: "Rama Construction Ltd", grade: "GC-1 (License #AA-CON-33219)", price: "ETB 479,150,000.00", variance: "-1.2% below ceiling", c1: 15.0, c2: 19.0, c3: 18.5, c4: 15.0, c5: 7.5, totalTech: "75.0 / 100", weightedTech: "52.50 pts", weightedFin: "28.64 pts", finalScore: "81.14 pts", notes: "Meets minimum statutory threshold marginally. Personnel commitment verified with Regional Roads Authority clearances.", awardEligible: true, rowClass: "bg-surface-container-lowest", envNo: "#02", financial: "479,150,000.00", techDisplay: "52.50", finDisplay: "28.64", totalDisplay: "81.14", statutory: "100%", actionBadge: "Borderline Pass", actionBadgeClass: "bg-secondary-fixed/50 text-on-secondary-fixed" },
  { id: "bidder-5", rank: "Non-Responsive • Envelope #05", name: "Midroc Construction Ethiopia", grade: "GC-1 (License #AA-CON-00412)", price: "ETB 491,300,000.00", variance: "+1.3% above ceiling", c1: 14.0, c2: 16.0, c3: 17.0, c4: 12.0, c5: 6.0, totalTech: "65.0 / 100", weightedTech: "Disqualified", weightedFin: "0.00 pts", finalScore: "Disqualified", notes: "Failed mandatory technical pass mark (Scored 65.0 vs 75.0 minimum required). Bid price also exceeds maximum sanctioned budget ceiling.", awardEligible: false, rowClass: "bg-error-container/20", envNo: "#05", financial: "491,300,000.00", techDisplay: "Failed", finDisplay: "—", totalDisplay: "N/A", statutory: "Deficient", actionBadge: "Disqualified", actionBadgeClass: "bg-error-container text-on-error-container" },
];

export const DEFAULT_BIDDER = "bidder-3";
