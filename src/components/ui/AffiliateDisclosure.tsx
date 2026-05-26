interface AffiliateLink {
  name: string;
  description: string;
  cta: string;
  url: string;
  badge?: string;
}

const affiliateLinks: AffiliateLink[] = [
  {
    name: "Ro Health",
    description: "Online GLP-1 prescriptions. Board-certified providers, delivered to your door.",
    cta: "Get started with Ro →",
    url: "https://ro.co/weight-loss/",
    badge: "Most popular",
  },
  {
    name: "Hims / Hers",
    description: "GLP-1 weight loss program with ongoing provider support.",
    cta: "See Hims/Hers plans →",
    url: "https://www.hims.com/glp1",
  },
];

export default function AffiliateDisclosure() {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-start gap-2 p-4 rounded-xl bg-[#1E293B] border border-[#334155]">
        <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="#94A3B8" strokeWidth="1.5"/>
          <path d="M7 6.5v4M7 4.5v.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className="text-xs text-[#94A3B8]">
          <strong className="text-[#F8FAFC]">Affiliate disclosure:</strong> GLPDash earns a commission if you sign up through the links below. This does not influence our calculator data or recommendations.
        </p>
      </div>

      <p className="text-sm font-semibold text-[#F8FAFC]">Get a GLP-1 prescription online</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {affiliateLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group block p-5 rounded-2xl border border-[#334155] bg-[#1E293B] hover:border-[#10B981]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#F8FAFC]">{link.name}</span>
              {link.badge && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                  {link.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-[#94A3B8] mb-3">{link.description}</p>
            <span className="text-sm font-medium text-[#10B981] group-hover:underline">{link.cta}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
