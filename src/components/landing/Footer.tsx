import { useState } from "react";

const footerCols = [
  {
    title: "Product",
    links: [
      { label: "Collections API", pill: "Core", pillColor: "blue" },
      { label: "Escrow API", pill: "Core", pillColor: "blue" },
      { label: "Disbursement API", pill: "Core", pillColor: "blue" },
      { label: "Documentation" },
      { label: "Changelog", pill: "New", pillColor: "green" },
      { label: "API Status", isLive: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us" },
      { label: "Careers", pill: "Hiring", pillColor: "amber" },
      { label: "Blog" },
      { label: "Press Kit" },
      { label: "Contact Us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center" },
      { label: "Case Studies" },
      { label: "Integration Guides" },
      { label: "Community" },
      { label: "Sandbox Testing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Security" },
      { label: "Compliance" },
      { label: "Cookie Policy" },
    ],
  },
];

const apiStatuses = [
  { name: "Collections API", uptime: "99.9%" },
  { name: "Escrow API", uptime: "100%" },
  { name: "Disbursement API", uptime: "99.8%" },
  { name: "Webhooks", uptime: "99.9%" },
];

const pillColorMap: Record<string, string> = {
  green: "bg-primary/15 text-primary",
  amber: "bg-[hsl(42_80%_50%/0.15)] text-[#D29922]",
  blue: "bg-[hsl(212_100%_67%/0.15)] text-[#58A6FF]",
};

const Footer = () => {
  const [lang, setLang] = useState("EN");

  return (
    <footer className="bg-[#080E18] text-white/50">
      {/* API Status Ticker */}
      <div className="bg-[#060B13] border-b border-white/[0.06] py-2.5">
        <div className="container mx-auto max-w-[1280px] px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-[livepulse_2s_infinite] flex-shrink-0" />
              <span className="text-white/80 text-[0.78rem] font-semibold">All systems operational</span>
              <a href="#" className="text-primary text-[0.75rem] font-semibold border border-primary/25 px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-all no-underline">
                View Status Page →
              </a>
            </div>
            <div className="hidden sm:flex gap-6 flex-wrap">
              {apiStatuses.map((api) => (
                <div key={api.name} className="flex items-center gap-1.5 text-[0.74rem] text-white/[0.38]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(155_100%_42%/0.5)]" />
                  {api.name} <strong className="text-white/65">{api.uptime}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-primary-dark/60 to-[#080E18]/80 border-b border-white/[0.06] py-8">
        <div className="container mx-auto max-w-[1280px] px-8">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-[1.8rem]">📬</div>
              <div>
                <div className="font-display text-[0.95rem] font-bold text-white mb-0.5">Stay in the loop</div>
                <div className="text-[0.8rem] text-white/45">API updates, changelog, and fintech insights for East African builders.</div>
              </div>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="bg-white/[0.06] border-[1.5px] border-white/[0.12] rounded-[9px] px-4 py-2.5 text-[0.85rem] text-white outline-none w-[230px] font-body placeholder:text-white/30 focus:border-primary focus:bg-primary/[0.04] transition-colors"
              />
              <button className="bg-gradient-to-br from-primary to-green-dark text-black font-bold text-[0.85rem] border-none rounded-[9px] px-5 py-2.5 cursor-pointer font-body whitespace-nowrap hover:-translate-y-px hover:shadow-[0_6px_18px_hsl(155_100%_42%/0.3)] transition-all">
                Subscribe →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Columns */}
      <div className="py-14 border-b border-white/[0.06]">
        <div className="container mx-auto max-w-[1280px] px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2.2fr_1fr_1fr_1fr_1fr] gap-12">
            {/* Brand */}
            <div className="md:col-span-3 lg:col-span-1">
              <a href="#" className="flex items-center gap-2 font-display text-xl font-extrabold text-white no-underline mb-4">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-green-dark text-white font-black text-lg shadow-[0_4px_12px_hsl(155_100%_42%/0.3)]">
                  P
                </div>
                PayLoom Instants
              </a>
              <p className="text-white/[0.42] leading-relaxed text-sm mb-5 max-w-[270px]">
                Enterprise escrow payment infrastructure for East African marketplaces.
                Collect. Hold. Split. Disburse. Built on M-Pesa, trusted by founders across Africa.
              </p>
              <div className="flex gap-1.5 flex-wrap mb-5">
                <span className="inline-flex items-center gap-1 bg-primary/[0.08] border border-primary/20 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold text-primary">🇰🇪 Kenya-first</span>
                <span className="inline-flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold text-white/50">🔒 CBK Compliant</span>
                <span className="inline-flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold text-white/50">⚡ 99.9% Uptime</span>
                <span className="inline-flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold text-white/50">📱 M-Pesa Native</span>
              </div>
              <div className="flex gap-2">
                {[
                  { title: "Twitter / X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" },
                  { title: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                  { title: "GitHub", path: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" },
                  { title: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                ].map((social) => (
                  <a
                    key={social.title}
                    href="#"
                    title={social.title}
                    className="w-9 h-9 bg-white/[0.06] border border-white/10 rounded-[9px] flex items-center justify-center text-white/50 no-underline transition-all hover:bg-primary hover:border-primary hover:text-black hover:-translate-y-0.5 hover:shadow-[0_6px_16px_hsl(155_100%_42%/0.25)]"
                  >
                    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <h5 className="font-display text-[0.75rem] font-bold text-white/90 uppercase tracking-wider mb-4">
                  {col.title}
                </h5>
                <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href="#" className="text-white/45 text-sm no-underline inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                        {link.isLive ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-[livepulse_2s_infinite]" />
                            {link.label}
                          </span>
                        ) : (
                          link.label
                        )}
                        {link.pill && (
                          <span className={`text-[0.6rem] font-bold px-1.5 py-px rounded uppercase tracking-wide ${pillColorMap[link.pillColor || "green"]}`}>
                            {link.pill}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5">
        <div className="container mx-auto max-w-[1280px] px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-[0.77rem] text-white/30 flex items-center gap-2 flex-wrap">
              <span>© 2026 PayLoom Instants Ltd.</span>
              <span className="text-white/[0.12]">·</span>
              <span>Registered in Kenya</span>
              <span className="text-white/[0.12]">·</span>
              <span>CBK Regulated</span>
              <span className="text-white/[0.12]">·</span>
              <span>All rights reserved.</span>
            </div>
            <div className="hidden sm:block text-[0.77rem] text-white/[0.28]">Built with conviction for East African commerce 🌍</div>
            <div className="flex items-center gap-2.5">
              <div className="flex border border-white/10 rounded-[7px] overflow-hidden">
                {["EN", "SW"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`bg-transparent border-none px-3 py-1 text-[0.72rem] font-semibold cursor-pointer font-body transition-all ${
                      lang === l ? "bg-primary text-black" : "text-white/40"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button className="w-[30px] h-[30px] bg-white/[0.05] border border-white/10 rounded-[7px] flex items-center justify-center cursor-pointer text-[0.88rem] hover:border-primary hover:bg-primary/[0.08] transition-all">
                🌙
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
