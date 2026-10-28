export default function HomePage() {
  return (
    <>

<header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm group" data-path="landing-page" href="#"><div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-[24px]">gavel</span></div></a><div className="hidden lg:block w-[1px] h-6 bg-surface-dim"></div><div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span>FDRE PPA Compliant</span></div></div><nav className="hidden md:flex items-center gap-space-xl font-label-lg text-label-lg" data-active-classes="text-primary font-bold"><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="tenders" href="#">Tenders</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="how-it-works" href="#">How it Works</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="pricing" href="#">Pricing</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a></nav><div className="flex items-center gap-space-md"><div className="flex items-center bg-surface-container-low p-space-xs rounded-lg font-label-sm text-label-sm"><button className="px-space-sm py-1 rounded bg-surface-container-lowest text-primary shadow-xs font-semibold" type="button">EN</button><span className="text-outline-variant px-space-xs">|</span><button className="px-space-sm py-1 rounded text-on-surface-variant hover:text-on-surface" type="button">አማ</button></div><a className="hidden sm:inline-flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-space-md py-2 transition-colors" data-path="login" href="#">Login</a><a className="inline-flex items-center justify-center font-label-md text-label-md bg-primary-container hover:bg-primary text-on-primary px-space-lg py-2 h-10 rounded-lg transition-colors shadow-sm" data-path="register" href="#">Register</a><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface"><div className="flex flex-col w-full">
{/* Top National Procurement Authority Notice Bar */}
<div className="w-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm py-2 px-gutter">
<div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs">
<span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-medium text-on-surface">Federal E-Procurement Gateway</span>
<span className="text-outline-variant">|</span>
<span>የፌዴራል ዲጂታል የጨረታ ማዕከል</span>
<span className="text-outline-variant">|</span>
<span className="font-mono-data text-mono-data text-primary">Directive 2016/2024 Verified</span>
</div>
<div className="flex items-center gap-space-md text-label-sm">
<span className="hidden sm:inline text-on-surface-variant">Live CBE &amp; Telebirr CPO Gateway: <span className="font-semibold text-primary">Active</span></span>
<span className="text-outline-variant hidden sm:inline">|</span>
<span className="font-mono-data text-mono-data">Today: 1,482 Active Notices</span>
</div>
</div>
</div>
{/* Hero Section */}
<section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface-container-lowest px-gutter py-space-xl lg:py-margin overflow-hidden">
{/* Subtle Ethiopian crosshatch architectural background lines (SVG) */}
<div aria-hidden="true" className="absolute inset-0 opacity-[0.035] pointer-events-none">
<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="48" id="ethio-geom" patternUnits="userSpaceOnUse" width="48">
<path d="M 24,0 L 48,24 L 24,48 L 0,24 Z M 24,8 L 40,24 L 24,40 L 8,24 Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
</pattern>
</defs>
<rect fill="url(#ethio-geom)" height="100%" width="100%"></rect>
</svg>
</div>
<div className="relative max-w-[1440px] mx-auto flex flex-col items-center text-center">
{/* Institutional Authority Badge */}
<div className="inline-flex items-center gap-space-xs bg-surface-container-lowest shadow-sm rounded-full px-space-md py-1 mb-space-lg">
<span className="material-symbols-outlined text-[18px] text-primary" style={{"fontVariationSettings": "'FILL' 1"}}>verified</span>
<span className="font-label-sm text-label-sm font-semibold text-primary tracking-wide uppercase">Federal Democratic Republic of Ethiopia</span>
<span className="text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">የመንግሥትና የግል ግዢ ፖርታል</span>
</div>
{/* Main Headline (Bilingual scale) */}
<h1 className="font-display-lg text-display-lg lg:text-[44px] lg:leading-[52px] font-bold text-on-surface tracking-tight max-w-4xl">
        Find and Win Tenders Across Ethiopia
      </h1>
<p className="font-headline-sm text-headline-sm text-primary font-semibold mt-space-xs tracking-normal max-w-3xl">
        በኢትዮጵያ ውስጥ ያሉ የመንግሥትና የግል የጨረታ ማስታወቂያዎችን በአንድ ቦታ ያግኙ፣ በቀላሉ ይወዳደሩ
      </p>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-sm max-w-2xl leading-relaxed">
        The unified e-procurement platform operating under Federal Directive No. 2016/2024. Standardized submissions, bank-grade digital CPO guarantees, and transparent encrypted e-bidding.
      </p>
{/* Search Component (Large Elevated Filter Matrix) */}
<div className="w-full max-w-5xl mt-space-xl bg-surface-container-lowest shadow-md rounded-xl p-space-md lg:p-space-lg">
<form className="flex flex-col lg:flex-row items-stretch gap-space-sm" >
{/* Keyword input */}
<div className="flex-1 flex items-center bg-surface-container-low rounded-lg px-space-md h-12">
<span className="material-symbols-outlined text-outline text-[22px] mr-space-xs">search</span>
<input aria-label="Keywords or reference number" className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" placeholder="e.g. Road construction, Ethio Telecom, Medical equipment, IT consultancy..." type="text"/>
</div>
{/* Category dropdown */}
<div className="flex-initial lg:w-60 flex items-center bg-surface-container-low rounded-lg px-space-md h-12">
<span className="material-symbols-outlined text-outline text-[20px] mr-space-xs">category</span>
<select aria-label="Procurement Category" className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer">
<option value="">All Categories (ሁሉም ዘርፎች)</option>
<option value="construction">ኮንስትራክሽን / Construction</option>
<option value="ict">ቴክኖሎጂና አይሲቲ / ICT</option>
<option value="medical">የሕክምና መሣሪያዎች / Medical Supplies</option>
<option value="office">የቢሮ ዕቃዎች / Office Equipment</option>
<option value="consultancy">አማካሪ አገልግሎት / Consultancy</option>
<option value="agriculture">ግብርና / Agriculture</option>
<option value="energy">የኃይልና ማስተላለፊያ / Energy &amp; Power</option>
</select>
</div>
{/* Region dropdown */}
<div className="flex-initial lg:w-48 flex items-center bg-surface-container-low rounded-lg px-space-md h-12">
<span className="material-symbols-outlined text-outline text-[20px] mr-space-xs">location_on</span>
<select aria-label="Region in Ethiopia" className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer">
<option value="">All Regions (ሁሉም ክልሎች)</option>
<option value="addis-ababa">Addis Ababa (አዲስ አበባ)</option>
<option value="oromia">Oromia (ኦሮሚያ)</option>
<option value="amhara">Amhara (አማራ)</option>
<option value="sidama">Sidama (ሲዳማ)</option>
<option value="tigray">Tigray (ትግራይ)</option>
<option value="dire-dawa">Dire Dawa (ድሬዳዋ)</option>
<option value="somali">Somali (ሶማሌ)</option>
<option value="snnp">Central / South Ethiopia</option>
<option value="hawassa">Hawassa City</option>
<option value="bahir-dar">Bahir Dar City</option>
</select>
</div>
{/* Primary Search Button */}
<button className="flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-space-xl h-12 rounded-lg transition-colors shadow-sm" type="submit">
<span className="material-symbols-outlined text-[20px]">search</span>
<span>Search Tenders / ጨረታ ፈልግ</span>
</button>
</form>
{/* Quick filter chips beneath search */}
<div className="flex flex-wrap items-center gap-space-xs mt-space-md pt-space-sm font-label-sm text-label-sm text-on-surface-variant">
<span className="font-semibold text-on-surface">Trending:</span>
<a className="bg-surface-container-low hover:bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-primary transition-colors" href="#">ERA Roads</a>
<a className="bg-surface-container-low hover:bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-primary transition-colors" href="#">Ethio Telecom 5G</a>
<a className="bg-surface-container-low hover:bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-primary transition-colors" href="#">EEP Transformers</a>
<a className="bg-surface-container-low hover:bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-primary transition-colors" href="#">Pharmaceutical Supply (EPSS)</a>
<a className="bg-surface-container-low hover:bg-surface-container px-space-sm py-1 rounded text-on-surface-variant hover:text-primary transition-colors" href="#">CPO under 100K ETB</a>
</div>
</div>
{/* Quick Stats Ticker Strip */}
<div className="w-full max-w-5xl mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-space-md">
{/* Stat 1 */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm text-left flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-mono-data text-[22px] font-bold text-primary">1,482+</span>
<span className="material-symbols-outlined text-primary text-[20px]">folder_open</span>
</div>
<div>
<div className="font-label-md text-label-md font-semibold text-on-surface">Active Tenders</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">ንቁ ጨረታዎች በአገር አቀፍ ደረጃ</div>
</div>
</div>
{/* Stat 2 */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm text-left flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-mono-data text-[22px] font-bold text-primary">14,200+</span>
<span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
</div>
<div>
<div className="font-label-md text-label-md font-semibold text-on-surface">Registered Companies</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">የተመዘገቡና የተረጋገጡ ድርጅቶች</div>
</div>
</div>
{/* Stat 3 */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm text-left flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-mono-data text-[22px] font-bold text-secondary">ETB 48.6B</span>
<span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
</div>
<div>
<div className="font-label-md text-label-md font-semibold text-on-surface">Total Procurement Value</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">አጠቃላይ የጨረታ ካፒታል ዋጋ</div>
</div>
</div>
{/* Stat 4 */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm text-left flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-mono-data text-[22px] font-bold text-primary">99.8%</span>
<span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
</div>
<div>
<div className="font-label-md text-label-md font-semibold text-on-surface">On-time Verification</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">የተረጋገጠ ህጋዊ አሰራር</div>
</div>
</div>
</div>
</div>
</section>
{/* Featured Categories Grid */}
<section className="w-full max-w-[1440px] mx-auto px-gutter py-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
<div>
<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider mb-1">
<span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
<span>Procurement Sectors / ዘርፎች</span>
</div>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Featured Tender Categories</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Browse certified institutional solicitations by procurement domain</p>
</div>
<a className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:text-primary-container font-semibold transition-colors" href="#">
<span>Explore all 24 categories</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
{/* 8 Categories Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Category 1 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">construction</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">412 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Construction &amp; Infrastructure</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">ኮንስትራክሽንና ሲቪል ስራዎች</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 2 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">devices</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">284 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">ICT, Telecom &amp; Software</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">አይሲቲ እና ቴሌኮም ቴክኖሎጂ</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 3 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">local_hospital</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">195 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Medical &amp; Pharma Equipment</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">የሕክምና እና የመድኃኒት አቅርቦት</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 4 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">bolt</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">148 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Energy, Power &amp; Electrification</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">የኤሌክትሪክ እና የኃይል አቅርቦት</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 5 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">psychology</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">162 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Management Consultancy</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">የማማከርና የጥናት አገልግሎት</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 6 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">agriculture</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">110 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Agriculture &amp; Agro-Processing</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">ግብርና እና የምግብ አቅርቦት</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 7 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">local_shipping</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">96 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Transport &amp; Heavy Machinery</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">ተሽከርካሪዎች እና ማሽነሪ</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
{/* Category 8 */}
<a className="group bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-lg shadow-sm transition-all duration-200 flex flex-col justify-between" href="#">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[24px]">inventory_2</span>
</div>
<span className="font-mono-data text-mono-data bg-surface-container px-2 py-0.5 rounded text-primary font-semibold">75 Tenders</span>
</div>
<div className="mt-space-lg">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Office Supplies &amp; Printing</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">የቢሮ ዕቃዎች እና ህትመት</p>
<div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-medium">
<span>View Solicitations</span>
<span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</a>
</div>
</section>
{/* Latest Tenders Section */}
<section className="w-full bg-surface-container-low py-space-xl lg:py-margin">
<div className="max-w-[1440px] mx-auto px-gutter">
{/* Header with Filters & Link */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
<div>
<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider mb-1">
<span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
<span>Live Solicitations / የቅርብ ጊዜ ጨረታዎች</span>
</div>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Active Procurement Opportunities</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Verified public invitations under Federal Public Procurement Directive No. 2016/2024</p>
</div>
<div className="flex items-center gap-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">Showing priority tenders</span>
<a className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors shadow-sm" href="#">
<span>View All Tenders (1,482)</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
{/* Tender Cards Grid (2x2 Desktop) */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
{/* CARD 1 */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="bg-surface-container text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold uppercase">Construction • NCB</span>
<span className="font-mono-data text-mono-data text-on-surface-variant">Ref: ERA/NCB/58/2024</span>
</div>
{/* Urgent Badge */}
<div className="inline-flex items-center gap-space-xs bg-error-container text-on-error-container font-label-sm text-label-sm px-2.5 py-0.5 rounded font-semibold">
<span className="material-symbols-outlined text-[16px] text-error">alarm</span>
<span>Closing Soon: 18h 24m remaining</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
              Periodic Maintenance and Asphalt Concrete Overlay of Modjo-Adama Expressway (Package II)
            </h3>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-space-xs">
<span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
<span className="font-medium text-on-surface">Ethiopian Roads Administration (ERA)</span>
<span>•</span>
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>Addis Ababa / Oromia Regional Corridor</span>
</div>
{/* Key-value data row */}
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Estimated Value</div>
<div className="font-mono-data text-mono-data font-bold text-primary">~ETB 145,000,000</div>
</div>
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Required Bid Bond (CPO)</div>
<div className="font-mono-data text-mono-data font-bold text-on-surface">ETB 500,000</div>
</div>
<div className="col-span-2 sm:col-span-1">
<div className="font-label-sm text-label-sm text-on-surface-variant">Opening Date</div>
<div className="font-mono-data text-mono-data text-on-surface">Tomorrow, 10:00 AM</div>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-sm flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
<span>Digital CPO Accepted (CBE / Telebirr)</span>
</div>
<div className="flex items-center gap-space-xs">
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors">
                Quick View
              </button>
<button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors shadow-sm">
                Bid Details &amp; Docs
              </button>
</div>
</div>
</article>
{/* CARD 2 */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="bg-surface-container text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold uppercase">ICT &amp; Telecom • ICB</span>
<span className="font-mono-data text-mono-data text-on-surface-variant">Ref: ET/ICB/CORE-5G/24</span>
</div>
{/* Calm Badge */}
<div className="inline-flex items-center gap-space-xs bg-surface-container text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded font-semibold">
<span className="material-symbols-outlined text-[16px]">schedule</span>
<span>Closes in: 14 Days</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
              Turnkey Deployment of 5G Metro Core Optical Fiber &amp; Modular Edge Data Centers
            </h3>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-space-xs">
<span className="material-symbols-outlined text-[18px] text-primary">cell_tower</span>
<span className="font-medium text-on-surface">Ethio Telecom (ኢትዮ ቴሌኮም)</span>
<span>•</span>
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>Headquarters, Churchill Road, Addis Ababa</span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Contract Scope</div>
<div className="font-mono-data text-mono-data font-bold text-primary">Multi-Year ICB</div>
</div>
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Document Fee</div>
<div className="font-mono-data text-mono-data font-bold text-on-surface">Free (Electronic)</div>
</div>
<div className="col-span-2 sm:col-span-1">
<div className="font-label-sm text-label-sm text-on-surface-variant">Currency</div>
<div className="font-mono-data text-mono-data text-on-surface">USD / ETB Dual</div>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-sm flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-primary">language</span>
<span>International Competitive Bidding</span>
</div>
<div className="flex items-center gap-space-xs">
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors">
                Quick View
              </button>
<button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors shadow-sm">
                Bid Details &amp; Docs
              </button>
</div>
</div>
</article>
{/* CARD 3 */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="bg-surface-container text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold uppercase">Medical Supplies • EFDA</span>
<span className="font-mono-data text-mono-data text-on-surface-variant">Ref: TASH/MED/901/24</span>
</div>
<div className="inline-flex items-center gap-space-xs bg-surface-container text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded font-semibold">
<span className="material-symbols-outlined text-[16px]">schedule</span>
<span>Closes in: 8 Days</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
              Procurement of Specialized Hemodialysis Machines and Multi-Parameter Patient Monitors
            </h3>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-space-xs">
<span className="material-symbols-outlined text-[18px] text-primary">local_hospital</span>
<span className="font-medium text-on-surface">Tikur Anbessa Specialized Hospital (Black Lion)</span>
<span>•</span>
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>Addis Ababa</span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Estimated Value</div>
<div className="font-mono-data text-mono-data font-bold text-primary">~ETB 28,400,000</div>
</div>
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Required Bid Bond</div>
<div className="font-mono-data text-mono-data font-bold text-on-surface">ETB 150,000</div>
</div>
<div className="col-span-2 sm:col-span-1">
<div className="font-label-sm text-label-sm text-on-surface-variant">Compliance</div>
<div className="font-mono-data text-mono-data text-on-surface">EFDA Certified</div>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-sm flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
<span>Drug Administration Pre-Qualified</span>
</div>
<div className="flex items-center gap-space-xs">
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors">
                Quick View
              </button>
<button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors shadow-sm">
                Bid Details &amp; Docs
              </button>
</div>
</div>
</article>
{/* CARD 4 */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="bg-surface-container text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold uppercase">Energy &amp; Power • Class-A</span>
<span className="font-mono-data text-mono-data text-on-surface-variant">Ref: EEP/TRANS/HW-04</span>
</div>
<div className="inline-flex items-center gap-space-xs bg-surface-container text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded font-semibold">
<span className="material-symbols-outlined text-[16px]">schedule</span>
<span>Closes in: 21 Days</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
              Supply of 132kV Substation Transmission Line Insulators &amp; Switchgear Replacement
            </h3>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-space-xs">
<span className="material-symbols-outlined text-[18px] text-primary">electric_bolt</span>
<span className="font-medium text-on-surface">Ethiopian Electric Power (EEP)</span>
<span>•</span>
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>Hawassa Substation, Sidama Region</span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Estimated Value</div>
<div className="font-mono-data text-mono-data font-bold text-primary">~ETB 45,000,000</div>
</div>
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Required Bid Bond</div>
<div className="font-mono-data text-mono-data font-bold text-on-surface">ETB 300,000</div>
</div>
<div className="col-span-2 sm:col-span-1">
<div className="font-label-sm text-label-sm text-on-surface-variant">Contract Type</div>
<div className="font-mono-data text-mono-data text-on-surface">Goods &amp; Installation</div>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-sm flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">security</span>
<span>Automated CPO Hold Available</span>
</div>
<div className="flex items-center gap-space-xs">
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors">
                Quick View
              </button>
<button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-colors shadow-sm">
                Bid Details &amp; Docs
              </button>
</div>
</div>
</article>
</div>
</div>
</section>
{/* How It Works Section (Two Distinct Parallel Tracks) */}
<section className="w-full max-w-[1440px] mx-auto px-gutter py-space-xl lg:py-margin">
<div className="text-center max-w-3xl mx-auto mb-space-xl">
<div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider mb-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span>Standard Operating Procedure / የአሰራር ሂደት</span>
</div>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">How Chereta Operates</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
        Compliant end-to-end workflow designed according to Federal Public Procurement Directive No. 2016/2024
      </p>
</div>
{/* Track Grid: Side-by-Side tracks */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
{/* Track A: For Bidders / Suppliers */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-sm flex flex-col justify-between">
<div>
{/* Header Track Badge */}
<div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low rounded-lg p-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[22px]">badge</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Track A: For Bidders &amp; Suppliers</h3>
<span className="font-body-sm text-body-sm text-primary font-medium">ለተጫራቾችና አቅራቢዎች የተዘጋጀ</span>
</div>
</div>
<span className="bg-surface-container text-primary font-mono-data text-mono-data px-2.5 py-1 rounded font-semibold">SUPPLIER</span>
</div>
{/* Step 1 */}
<div className="flex items-start gap-space-md mb-space-lg">
<div className="w-8 h-8 rounded-full bg-surface-container text-primary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              01
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Create Verified Account (TIN &amp; License)</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Register with your Tax Identification Number (TIN) and valid Trade License. Instant automated KYC verification runs directly against the Ethiopian Ministry of Trade &amp; Regional Integration registry.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-primary">
<span className="material-symbols-outlined text-[16px]">check_circle</span>
<span>Takes less than 3 minutes with valid TIN</span>
</div>
</div>
</div>
{/* Step 2 */}
<div className="flex items-start gap-space-md mb-space-lg">
<div className="w-8 h-8 rounded-full bg-surface-container text-primary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              02
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Explore &amp; Secure Documents</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Filter tenders by sector and region. Instantly pay non-refundable tender document fees via Telebirr or Commercial Bank of Ethiopia (CBE), and generate a verified digital CPO bid security without bank branch queues.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-primary">
<span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
<span>Supported: CBE Birr, Telebirr &amp; Bank CPO API</span>
</div>
</div>
</div>
{/* Step 3 */}
<div className="flex items-start gap-space-md">
<div className="w-8 h-8 rounded-full bg-surface-container text-primary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              03
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Submit Encrypted E-Bid Envelope</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Upload separate technical and financial envelopes locked under military-grade SHA-256 encryption. Receives an immutable digital timestamp before the deadline closes.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-primary">
<span className="material-symbols-outlined text-[16px]">lock</span>
<span>Tamper-proof until public virtual opening</span>
</div>
</div>
</div>
</div>
<div className="mt-space-xl pt-space-md">
<a className="w-full inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg py-3 rounded-lg transition-colors shadow-sm" href="#">
<span>Register as Supplier (ተመዝገቡ)</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
{/* Track B: For Issuers / Procuring Entities */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-sm flex flex-col justify-between">
<div>
{/* Header Track Badge */}
<div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low rounded-lg p-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary">
<span className="material-symbols-outlined text-[22px]">gavel</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Track B: For Procuring Entities</h3>
<span className="font-body-sm text-body-sm text-secondary font-medium">ለጨረታ አውጪ ተቋማትና ድርጅቶች</span>
</div>
</div>
<span className="bg-surface-container text-secondary font-mono-data text-mono-data px-2.5 py-1 rounded font-semibold">PROCURER</span>
</div>
{/* Step 1 */}
<div className="flex items-start gap-space-md mb-space-lg">
<div className="w-8 h-8 rounded-full bg-surface-container text-secondary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              01
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Draft &amp; Publish Tender Notice</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Configure procurement methods (NCB, ICB, Request for Quotation), required supplier grade certification, and mandatory CPO bond rules fully conforming to PPPA regulatory directives.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
<span className="material-symbols-outlined text-[16px]">rule</span>
<span>Pre-built PPPA compliant standard templates</span>
</div>
</div>
</div>
{/* Step 2 */}
<div className="flex items-start gap-space-md mb-space-lg">
<div className="w-8 h-8 rounded-full bg-surface-container text-secondary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              02
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Manage Addenda &amp; Inquiries</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Respond to supplier clarification questions publicly, issue official addenda, and broadcast automated SMS/Email alerts to all registered document holders concurrently.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
<span className="material-symbols-outlined text-[16px]">campaign</span>
<span>Automated multi-channel bidder notification</span>
</div>
</div>
</div>
{/* Step 3 */}
<div className="flex items-start gap-space-md">
<div className="w-8 h-8 rounded-full bg-surface-container text-secondary font-mono-data text-mono-data font-bold flex items-center justify-center shrink-0">
              03
            </div>
<div>
<h4 className="font-label-lg text-label-lg font-bold text-on-surface">Automated Bid Opening &amp; Evaluation</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Execute virtual public envelope opening ceremonies streamed directly to bidders. Generate preliminary evaluation matrices, verify CPO statuses with CBE, and publish award notices under statutory standstill guidelines.
              </p>
<div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
<span className="material-symbols-outlined text-[16px]">visibility</span>
<span>100% transparent audit log and public readout</span>
</div>
</div>
</div>
</div>
<div className="mt-space-xl pt-space-md">
<a className="w-full inline-flex items-center justify-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg py-3 rounded-lg transition-colors" href="#">
<span>Publish Institutional Tender (ጨረታ ይለጥፉ)</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</div>
</section>
{/* Trust & Security Pillars Section */}
<section className="w-full bg-surface-container-low py-space-xl lg:py-margin">
<div className="max-w-[1440px] mx-auto px-gutter">
<div className="text-center max-w-3xl mx-auto mb-space-xl">
<div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider mb-1">
<span className="material-symbols-outlined text-[16px]">shield</span>
<span>Security &amp; Fiscal Integrity / የታማኝነት ማረጋገጫ</span>
</div>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Institutional Trust Pillars</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
          Engineered to eliminate bid rigging, eliminate fraudulent paper CPOs, and guarantee procedural fairness.
        </p>
</div>
{/* 3 Pillars Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Pillar 1 */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md">
<span className="material-symbols-outlined text-[30px]">domain_verification</span>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
              Verified Companies &amp; Compliance
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Every participating supplier undergoes systematic TIN verification, active trade license validation, and tax clearance reconciliation directly with the Ministry of Trade &amp; Regional Integration and Ministry of Revenues.
            </p>
</div>
<div className="mt-space-lg pt-space-md bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-primary">policy</span>
<span>Zero forged trade licenses accepted</span>
</div>
</div>
{/* Pillar 2 */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-space-md">
<span className="material-symbols-outlined text-[30px]">account_balance</span>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
              Secure Documents &amp; Digital CPO
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Real-time API integration with the Commercial Bank of Ethiopia (CBE) and connected financial institutions. Digital Bid Bonds (CPO) are verified instantly at bank clearance level, eliminating paper counterfoil forgery entirely.
            </p>
</div>
<div className="mt-space-lg pt-space-md bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-secondary">lock_clock</span>
<span>Automated bank hold &amp; timely release</span>
</div>
</div>
{/* Pillar 3 */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md">
<span className="material-symbols-outlined text-[30px]">enhanced_encryption</span>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
              Transparent &amp; Tamper-Proof
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              E-lock envelope technology ensures bid submissions cannot be viewed by any procurement official prior to official opening. Public opening logs and grievance tracking are enforced under Federal Directive No. 2016/2024.
            </p>
</div>
<div className="mt-space-lg pt-space-md bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
<span>Full statutory audit compliance</span>
</div>
</div>
</div>
</div>
</section>
{/* Partners & Institutional Logo Strip */}
<section className="w-full bg-surface-container-lowest py-space-xl">
<div className="max-w-[1440px] mx-auto px-gutter">
<div className="text-center mb-space-lg">
<span className="font-label-sm text-label-sm uppercase font-bold tracking-widest text-outline">
          Partner Government Authorities &amp; Financial Gateways • አጋር ተቋማት
        </span>
</div>
{/* Subtle grayscale badge container */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md items-center">
{/* Partner 1 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">account_balance</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">PPPA</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Procurement Authority</span>
</div>
{/* Partner 2 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">hub</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">MInT</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Ministry of Innovation</span>
</div>
{/* Partner 3 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">store</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">MOTRI</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Trade &amp; Integration</span>
</div>
{/* Partner 4 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">savings</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">CBE</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Commercial Bank</span>
</div>
{/* Partner 5 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">phone_iphone</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">Telebirr</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Ethio Telecom Payment</span>
</div>
{/* Partner 6 */}
<div className="flex flex-col items-center justify-center p-space-md rounded-lg bg-surface-container-low text-center group hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary transition-colors">receipt_long</span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface mt-1">MOR</span>
<span className="font-body-sm text-[10px] text-on-surface-variant">Ministry of Revenues</span>
</div>
</div>
</div>
</section>
{/* High-Impact Call-to-Action Banner */}
<section className="w-full px-gutter py-space-xl">
<div className="max-w-[1440px] mx-auto relative rounded-xl bg-primary text-on-primary overflow-hidden shadow-xl p-space-xl lg:p-margin">
{/* Decorative Ethiopian Traditional Pattern SVG Watermark */}
<div aria-hidden="true" className="absolute -right-12 -bottom-12 w-96 h-96 opacity-10 pointer-events-none">
<svg className="w-full h-full text-on-primary fill-none stroke-current" strokeWidth="2" viewBox="0 0 200 200">
<circle cx="100" cy="100" r="90"></circle>
<circle cx="100" cy="100" r="70"></circle>
<path d="M 100,10 L 100,190 M 10,100 L 190,100"></path>
<path d="M 36,36 L 164,164 M 36,164 L 164,36"></path>
<rect height="100" transform="rotate(45 100 100)" width="100" x="50" y="50"></rect>
</svg>
</div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
<div className="max-w-2xl">
<div className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary font-label-sm text-label-sm px-space-md py-1 rounded-full mb-space-md">
<span className="material-symbols-outlined text-[18px] text-secondary-container">campaign</span>
<span>የጨረታ ጥሪ • Open Procurement Modernization</span>
</div>
<h2 className="font-headline-lg text-headline-lg lg:text-[34px] lg:leading-[42px] font-bold tracking-tight text-on-primary">
            Ready to modernize your procurement process?
          </h2>
<p className="font-headline-sm text-headline-sm text-primary-fixed mt-space-xs font-medium">
            የጨረታ ሂደቶትን ዛሬውኑ ወደ ዘመናዊ ዲጂታል ስርዓት ያሸጋግሩ
          </p>
<p className="font-body-md text-body-md text-on-primary/90 mt-space-sm max-w-xl">
            Join over 14,000 verified Ethiopian enterprises and government institutions today. Streamlined bidding, instant electronic CPO, and complete transparency.
          </p>
</div>
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md shrink-0">
{/* Gold Action Button (Post Tender) */}
<a className="inline-flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-label-lg text-label-lg px-space-xl py-3.5 rounded-lg transition-colors shadow-sm" href="#">
<span className="material-symbols-outlined text-[20px]">add_circle</span>
<span>Post Your Tender (ጨረታ ይለጥፉ)</span>
</a>
{/* Filled White Button (Start Bidding) */}
<a className="inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-lg text-label-lg px-space-xl py-3.5 rounded-lg transition-colors shadow-sm" href="#">
<span className="material-symbols-outlined text-[20px]">how_to_reg</span>
<span>Start Bidding (ጨረታ ይሳተፉ)</span>
</a>
</div>
</div>
</div>
</section>
</div></main><footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-margin"><div className="w-full max-w-[1440px] mx-auto px-gutter pt-margin pb-space-xl"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter pb-margin"><div className="lg:col-span-2 space-y-space-md pr-0 lg:pr-margin"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary"><span className="material-symbols-outlined text-[20px]">gavel</span></div><div className="font-headline-sm text-headline-sm text-primary tracking-tight">Chereta <span className="text-on-surface font-normal text-body-md">| ጨረታ</span></div></div><p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">The national open digital procurement portal of the Federal Democratic Republic of Ethiopia. Empowering institutional transparency, standardized bidding, and verified supplier certification.</p><div className="flex items-center gap-space-sm text-on-surface-variant"><span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span><span className="font-label-sm text-label-sm">Federal Public Procurement Directive No. 2016/2024 Verified</span></div></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Procurement</div><ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant"><li className="hover:text-primary transition-colors"><a data-path="tenders" href="#">Active Tenders</a></li><li className="hover:text-primary transition-colors"><a data-path="post-tender" href="#">Post Tender Notice</a></li><li className="hover:text-primary transition-colors"><a data-path="directive-reference" href="#">Directive 2016/2024</a></li><li className="hover:text-primary transition-colors"><a data-path="cpo-verification" href="#">CPO Verification Hub</a></li><li className="hover:text-primary transition-colors"><a data-path="categories" href="#">Regional Procurement</a></li></ul></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Financial Systems</div><ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant"><li className="flex items-center gap-space-xs hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] text-primary">account_balance</span><a data-path="financial-gateways" href="#">Telebirr Gateway</a></li><li className="flex items-center gap-space-xs hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] text-primary">account_balance</span><a data-path="financial-gateways" href="#">Commercial Bank of Ethiopia</a></li><li className="hover:text-primary transition-colors"><a data-path="financial-gateways" href="#">Electronic Bid Bond (CPO)</a></li><li className="hover:text-primary transition-colors"><a data-path="pricing" href="#">Fee Schedule</a></li><li className="hover:text-primary transition-colors"><a data-path="terms-of-service" href="#">Audit Compliance</a></li></ul></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Contact &amp; Support</div><div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant"><div className="flex items-start gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span><span>Arada Sub-city, Woreda 01, Commercial Nomads Tower, Addis Ababa, Ethiopia</span></div><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary">call</span><span>National Hotline: <strong className="font-mono-data text-mono-data text-on-surface font-semibold">8989</strong></span></div><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary">mail</span><span>desk@chereta.gov.et</span></div><div className="pt-space-xs flex items-center gap-space-sm text-on-surface-variant"><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">public</span></a><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">forum</span></a><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">share</span></a></div></div></div></div><div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-label-sm text-label-sm text-on-surface-variant"><div className="flex items-center gap-space-xs"><span>© 2025 Chereta (ጨረታ) e-Procurement Authority. All rights reserved.</span></div><div className="flex items-center gap-space-lg"><a className="hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms of Service</a><a className="hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Data Privacy &amp; Protection</a><a className="hover:text-on-surface transition-colors" data-path="directive-reference" href="#">Public Procurement Directives</a></div></div></div></footer>

    </>
  );
}
