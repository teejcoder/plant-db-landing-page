import {
  Leaf,
  ShieldCheck,
  Search,
  Bookmark,
  Database,
  Lock,
} from "lucide-react";
import searchView from "../../public/search-view.webp";
import savedPlantsView from "../../public/saved-plants-view.webp";
import plantDetail from "../../public/plant-detail.webp";
import trefleExtended from "../../public/trefle-extended.webp";
import { ScreenshotsSection } from "./screenshots-section";

// ── Data ──────────────────────────────────────────────────────────────────────

const techCards = [
  {
    name: "TypeScript",
    role: "Type-safe boundary across all layers",
    accent: "#3178C6",
  },
  {
    name: "React 18",
    role: "Client rendering · state · context API",
    accent: "#61DAFB",
  },
  {
    name: "Next.js 14",
    role: "App Router · API proxy · Vercel runtime",
    accent: "#e2e8f0",
  },
  {
    name: "Supabase",
    role: "Postgres · RLS · Auth · browser client",
    accent: "#3ECF8E",
  },
  {
    name: "Trefle API",
    role: "Global botanical catalogue (proxied)",
    accent: "#86efac",
  },
  {
    name: "Tailwind CSS v4",
    role: "Utility-first styles · zero runtime cost",
    accent: "#38bdf8",
  },
  {
    name: "Dexie / IndexedDB",
    role: "Offline-first local persistence + sync FSM",
    accent: "#c4b5fd",
  },
  {
    name: "Cloudinary",
    role: "Async image hosting (fully optional layer)",
    accent: "#93c5fd",
  },
];

const archLayers = [
  {
    label: "Client",
    sublabel: "Browser-rendered · offline-capable",
    accent: "#61DAFB",
    items: [
      { name: "React 18", detail: "UI + Context state" },
      { name: "Tailwind CSS v4", detail: "Utility-first styles" },
      { name: "Dexie / IndexedDB", detail: "Local PENDING → SYNCED FSM" },
      { name: "Lucide React", detail: "Tree-shakeable icons" },
    ],
    snippet: {
      path: "src/lib/db.ts",
      code: `const db = new Dexie('PlantDB') as Dexie & {
  plants: EntityTable<Plant, 'id'>
  pendingImages: EntityTable<PendingImage, 'id'>
  pendingDeletions: EntityTable<PendingDeletion, 'plantId'>
}
db.version(2).stores({
  plants: 'id, syncStatus, createdAt',
  pendingImages: 'id, plantId',
  pendingDeletions: 'plantId',
})`,
    },
  },
  {
    label: "Server",
    sublabel: "Vercel Edge · key isolation",
    accent: "#3ECF8E",
    items: [
      { name: "Next.js 14 App Router", detail: "Routing + SSR" },
      { name: "/api/plants", detail: "Trefle proxy + cache headers" },
      { name: "Input validation", detail: "Query length · ID parsing" },
      { name: "TypeScript", detail: "Strict typing throughout" },
    ],
    snippet: {
      path: "src/app/api/plants/route.ts",
      code: `export async function GET(request: NextRequest) {
  const cid = crypto.randomUUID()
  const response = await fetch(
    \`\${BASE_URL}/plants/search\${buildQueryString(params)}\`,
    { next: { revalidate: 3600 } }
  )
  return NextResponse.json(await response.json())
}`,
    },
  },
  {
    label: "External",
    sublabel: "Third-party data + storage",
    accent: "#c4b5fd",
    items: [
      { name: "Trefle API", detail: "Botanical catalogue" },
      { name: "Supabase Postgres", detail: "Persistent user data + RLS" },
      { name: "Cloudinary CDN", detail: "Optional image hosting" },
      { name: "POWO · GBIF · EPPO", detail: "Enrichment data sources" },
    ],
    snippet: {
      path: "src/lib/supabase/client.ts",
      code: `browserClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: AUTH_COOKIE_KEY,
    },
  }
)`,
    },
  },
];

const techDecisions = [
  {
    decision: "Next.js App Router with server-side API proxy",
    reason:
      "The Trefle API key must never reach the client. /api/plants proxies all requests server-side, adds HTTP cache headers, and validates query params — impossible with a pure client-side SPA.",
  },
  {
    decision: "Supabase browser client only — no SSR adapter",
    reason:
      "@supabase/ssr was intentionally removed. The app uses RLS for per-user row isolation. Plain createClient from @supabase/supabase-js does the same job with one fewer dependency.",
  },
  {
    decision: "Offline-first persistence with Dexie / IndexedDB",
    reason:
      "Every plant write is staged locally first with a PENDING | SYNCED | ERROR sync status state machine. Reconnection triggers automatic background sync — no user action required, no data loss.",
  },
  {
    decision: "React Context only — no external state library",
    reason:
      "usePlants is the single source of truth. FilterContext holds shared filter state across pages. Zustand or Redux would add indirection without removing meaningful complexity at this scale.",
  },
  {
    decision: "Strict type boundary: Trefle shapes vs. app domain",
    reason:
      "TrefleSpecies (snake_case API shapes) and Plant (camelCase app interface) are kept entirely separate. Mapping happens in exactly two files — never a third location — preventing API shapes from leaking into the domain model.",
  },
  {
    decision: "Cloudinary image hosting as an optional layer",
    reason:
      "Plant images queue in a pendingImages IndexedDB table and upload asynchronously to Cloudinary. The app runs fully without Cloudinary configured — falls back to base64 data URLs stored locally.",
  },
  {
    decision: "Server-side response caching via revalidate headers",
    reason:
      "Trefle API responses cached for 3600 seconds. Next.js fetch cache applies automatically — repeated calls from different users hit the cache layer, reducing upstream API calls and latency. Plant + species fetches combined into one round trip.",
  },
  {
    decision: "Input validation at the API boundary",
    reason:
      "Query length capped at 200 characters, positive integer validation for plant_id and species_id. Returns 400 Bad Request with descriptive messages, preventing malformed requests from reaching Trefle. Validators are pure and reusable.",
  },
  {
    decision: "Structured logging with correlation IDs",
    reason:
      "Every log entry requires a typed `event` key enforced at call site. `level` and `timestamp` added automatically. Production emits JSON strings (grep-friendly for aggregators), development pretty-prints objects. Correlation IDs on all API requests enable tracing across distributed calls.",
  },
  {
    decision: "Recent searches persisted to localStorage with validation",
    reason:
      "Search queries stored as a max-5 JSON array. Runtime validation ensures stored values are valid strings — silently discards corrupted or cross-origin writes. Queries trimmed and deduplicated on each add. No external state library needed for this UX pattern.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "User Authentication",
    subtitle: "Supabase Auth",
    description:
      "Secure login and session management with Supabase Auth. Row-level security enforced at the database layer — each user can only read and write their own plant collection.",
  },
  {
    icon: Search,
    title: "Plant Search",
    subtitle: "Trefle Botanical API",
    description:
      "Search the global Trefle catalogue by common name, scientific name, family, or genus. Results include growth habits, native regions, flower colour, soil requirements, and harvest timelines.",
  },
  {
    icon: Bookmark,
    title: "Save to Collection",
    subtitle: "One-action import",
    description:
      "Pull any searched plant into your personal collection with Trefle data pre-filled. Supplemental enrichment from POWO, GBIF, and EPPO adds missing fields before you save.",
  },
  {
    icon: Database,
    title: "Persistent Data",
    subtitle: "Offline-first sync",
    description:
      "All plant data persists to Supabase per user. Works fully offline via IndexedDB with automatic reconnect sync — no manual steps, no data loss between sessions.",
  },
];

const screenshots = [
  {
    label: "App Screenshot — Search View",
    sublabel: "Browse and filter the global Trefle catalogue",
    image: searchView,
  },
  {
    label: "App Screenshot — Saved Plants View",
    sublabel: "Personal collection with filter and sort options",
    image: savedPlantsView,
  },
  {
    label: "App Screenshot — Plant Detail",
    sublabel: "Enriched data from Trefle, POWO, GBIF, and EPPO",
    image: plantDetail,
  },
  {
    label: "App Screenshot — Trefle Data Extended",
    sublabel: "Extended data from Trefle, POWO, GBIF, and EPPO",
    image: trefleExtended,
  },
];

// ── Shared UI primitives ───────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 mb-4">
      <span className="w-1 h-1 rounded-full bg-green-600 inline-block" />
      <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
        {children}
      </p>
    </div>
  );
}

// ── Section components ─────────────────────────────────────────────────────────

function TopAccent() {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-px z-60 pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.5) 30%, rgba(52,211,153,0.7) 50%, rgba(74,222,128,0.5) 70%, transparent 100%)",
      }}
    />
  );
}

function Nav() {
  return (
    <nav className="fixed top-px left-0 right-0 z-50 border-b border-[#1a2e1a]/50 bg-[#050d05]/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2.5">
        <div className="p-1 rounded-md bg-green-500/10 border border-green-500/20">
          <Leaf className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold text-green-50 tracking-tight">
          Plant Database
        </span>

        <div className="ml-auto hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800/60 bg-slate-200">
          <span className="w-1 h-1 rounded-full bg-slate-600 inline-block" />
          <span className="text-xs text-slate-600">Portfolio Case Study</span>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-14 pb-24 overflow-hidden">
      {/* Radial green glow from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Bottom fade to body */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#050d05] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Private project badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/30 text-slate-500 text-xs font-medium mb-10 tracking-wide">
          <Lock className="w-3 h-3" />
          Private Client Project
        </div>

        {/* Floating leaf icon with pulse ring */}
        <div className="flex justify-center mb-8">
          <div
            className="p-5 rounded-2xl bg-green-500/[0.07] border border-green-500/20"
            style={{ animation: "pulse-ring 3s ease-out infinite" }}
          >
            <Leaf
              className="w-14 h-14 text-green-400"
              strokeWidth={1.25}
              style={{ animation: "float 4s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          <span className="text-white">Plant</span>
          <br />
          <span className="bg-linear-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Database
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          A persistent plant database built for a client, integrating the Trefle
          botanical API with user authentication and saved plant collections.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="w-px h-8 bg-linear-to-b from-transparent to-[#2a3e2a]" />
        <div className="w-px h-3 bg-linear-to-b from-[#2a3e2a] to-transparent" />
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="py-24 px-4 border-t border-green-200/60 bg-[#f5fdf5]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <SectionLabel>Technical</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Tech Stack
          </h2>
        </div>

        {/* ── Mini-card grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {techCards.map((card) => (
            <div
              key={card.name}
              className="p-4 rounded-lg bg-white border border-green-200 hover:border-green-300 transition-colors duration-150"
              style={{ borderLeftColor: card.accent, borderLeftWidth: "2px" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: card.accent }}
                />
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  {card.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.role}
              </p>
            </div>
          ))}
        </div>

        {/* ── Architecture flow diagram ───────────────────────────────── */}
        <div className="mb-16">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">
            Architecture
          </p>

          <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-stretch">
            {archLayers.map((layer, i) => (
              <div
                key={layer.label}
                className="flex flex-col md:flex-row items-stretch flex-1 min-w-0"
              >
                {/* Layer box */}
                <div
                  className="flex-1 rounded-xl border border-green-200 bg-white overflow-hidden"
                  style={{
                    borderTopColor: layer.accent,
                    borderTopWidth: "1.5px",
                  }}
                >
                  {/* Layer header */}
                  <div className="px-4 pt-4 pb-3 border-b border-green-200/60">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-0.5"
                      style={{ color: layer.accent }}
                    >
                      {layer.label}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {layer.sublabel}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="p-4 space-y-3">
                    {layer.items.map((item) => (
                      <li key={item.name} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 opacity-70"
                          style={{ backgroundColor: layer.accent }}
                        />
                        <div>
                          <p className="text-xs font-medium text-slate-700 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Code snippet */}
                  <div className="mx-3 mb-3 rounded-md overflow-hidden border border-green-200/70">
                    {/* Mini editor chrome */}
                    <div className="px-3 py-1.5 bg-[#eef3ee] border-b border-green-200/60 flex items-center gap-2">
                      <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]/30" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]/30" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/30" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 truncate">
                        {layer.snippet.path}
                      </span>
                    </div>
                    {/* Code body */}
                    <pre className="p-3 bg-[#f3f8f3] overflow-x-auto scrollbar-none">
                      <code className="text-[10.5px] font-mono text-slate-500 leading-[1.65] whitespace-pre">
                        {layer.snippet.code}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Arrow connector */}
                {i < archLayers.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-10 shrink-0 text-green-300">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 10h12M12 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Technical decisions ─────────────────────────────────────── */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">
            Decisions &amp; rationale
          </p>

          <div className="divide-y divide-green-200/50">
            {techDecisions.map((item, i) => (
              <div
                key={item.decision}
                className="py-5 grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-2 sm:gap-10"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold text-green-700 leading-snug">
                    {item.decision}
                  </p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed sm:pl-0 pl-6">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-24 px-4 bg-[#070f07] border-t border-[#1a2e1a]/40">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <SectionLabel>Capabilities</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Key Features
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative p-6 rounded-xl border border-[#1a2e1a] bg-[#090f09] hover:border-[#2a4a2a] hover:bg-[#0b160b] hover:shadow-[0_0_32px_rgba(74,222,128,0.06)] transition-all duration-200"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex p-2.5 rounded-lg bg-green-500/6 border border-green-500/15">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>

                {/* Heading row */}
                <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <span className="text-xs text-slate-600 font-medium">
                    {feature.subtitle}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Corner bracket accent */}
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-green-500/20 rounded-tr-xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Screenshots() {
  return (
    <section className="py-24 px-4 border-t border-green-200/60 bg-[#f5fdf5]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <SectionLabel>Preview</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Screenshots
          </h2>
        </div>
        <ScreenshotsSection screenshots={screenshots} />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[#1a2e1a]/40 bg-[#050d05]">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Leaf className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Plant Database</span>
        </div>
        <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
          Private client project.
        </p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050d05] text-green-50">
      <TopAccent />
      <Nav />
      <Hero />
      <TechStack />
      <Features />
      <Screenshots />
      <Footer />
    </main>
  );
}
