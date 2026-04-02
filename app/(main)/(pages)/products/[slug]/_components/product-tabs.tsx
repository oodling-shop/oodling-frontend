'use client';

import { useState } from 'react';

interface ProductTabsProps {
  descriptionHtml: string;
}

const TABS = ['Description', 'Additional Info', 'Reviews (23)', 'Questions'] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ descriptionHtml }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Description');

  return (
    <div className="border-t border-[#E8ECEF]">
      {/* Tab headers */}
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

      {/* Tab content */}
      <div className="py-8">
        {activeTab === 'Description' ? (
          <div
            className="text-[#6C7275] leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-[#141718] [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#141718]"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        ) : (
          <p className="text-[#6C7275]">Coming soon.</p>
        )}
      </div>
    </div>
  );
}
