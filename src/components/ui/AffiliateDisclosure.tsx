export default function AffiliateDisclosure() {
  return (
    <div className="mt-10">
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-[#1E293B] border border-[#334155]">
        <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="#94A3B8" strokeWidth="1.5"/>
          <path d="M8 7v5M8 5v.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC]">Looking to get a GLP-1 prescription?</p>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Several telehealth providers offer online GLP-1 prescriptions. Search for licensed providers in your area and consult your doctor to find the right option for you.
          </p>
        </div>
      </div>
    </div>
  );
}
