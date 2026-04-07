'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Variant {
  node: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string };
    selectedOptions: { name: string; value: string }[];
  };
}

interface ProductTabsProps {
  descriptionHtml: string;
  variants?: { edges: Variant[] };
}

function deriveOptions(variants?: { edges: Variant[] }): { name: string; values: string[] }[] {
  if (!variants) return [];
  const map = new Map<string, Set<string>>();
  for (const { node } of variants.edges) {
    for (const { name, value } of node.selectedOptions) {
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)!.add(value);
    }
  }
  return Array.from(map.entries()).map(([name, valSet]) => ({ name, values: Array.from(valSet) }));
}

const TABS = ['Description', 'Additional Info', 'Reviews (23)', 'Questions'] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ descriptionHtml, variants }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [openAccordion, setOpenAccordion] = useState<Tab | null>(null);

  const options = deriveOptions(variants);

  const tabContent = (tab: Tab) => {
    if (tab === 'Description') {
      return (
        <div
          className="text-[#6C7275] leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-[#141718] [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#141718]"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      );
    }
    if (tab === 'Additional Info' && options.length > 0) {
      return (
        <div className="space-y-4">
          {options.map((opt) => (
            <div key={opt.name}>
              <p className="text-xs font-bold text-[#343839] uppercase tracking-wider mb-2">
                {opt.name}
              </p>
              <p className="text-[#6C7275]">{opt.values.join(', ')}</p>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-[#6C7275]">Coming soon.</p>;
  };

  return (
    <>
      {/* Mobile: Accordion */}
      <div className="lg:hidden border-t border-[#E8ECEF]">
        {TABS.map((tab) => (
          <div key={tab} className="border-b border-[#E8ECEF]">
            <button
              onClick={() => setOpenAccordion(openAccordion === tab ? null : tab)}
              className="flex items-center justify-between w-full py-5 text-left"
            >
              <span className="text-lg font-semibold text-[#141718]">{tab}</span>
              {openAccordion === tab ? (
                <ChevronUp className="w-5 h-5 text-[#141718]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#141718]" />
              )}
            </button>
            {openAccordion === tab && (
              <div className="pb-6">{tabContent(tab)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden lg:block border-t border-[#E8ECEF]">
        <div className="flex gap-8 border-b border-[#E8ECEF]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'py-4 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab
                  ? 'text-[#141718] border-b-2 border-[#141718] -mb-px'
                  : 'text-[#6C7275]',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-8">{tabContent(activeTab)}</div>
      </div>
    </>
  );
}
