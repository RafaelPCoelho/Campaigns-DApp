// components/CampaignActions.jsx
"use client";

import Link from 'next/link';

export default function CampaignActions({ campaignId }) {
  return (
    <div className="d-flex gap-2">
      <Link 
        href={`/donate/${campaignId}`}
        className="btn btn-sm btn-outline-primary"
      >
        Details
      </Link>
    </div>
  );
}