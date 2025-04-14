"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import CampaignActions from '../components/CampaignActions';
import { getRecentCampaigns } from "@/services/web3service";

export default function RecentCampaigns() {
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const campaigns = await getRecentCampaigns();
        setRecentCampaigns(campaigns);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load recent campaigns. Please try again later.");
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading recent campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold">Recent Campaigns</h1>
            <Link href="/create" className="btn btn-primary">
              Create New Campaign
            </Link>
          </div>
          
          {recentCampaigns.length === 0 ? (
            <div className="alert alert-info">
              No campaigns found. Be the first to create one!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Campaign</th>
                    <th scope="col">Author</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Status</th>
                    <th scope="col">More</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCampaigns.map((campaign, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {campaign.imageUrl && (
                            <div className="me-3" style={{ width: '60px', height: '60px' }}>
                              <img
                                src={campaign.imageUrl || "../../../public/placeholder.jpg"}
                                alt={campaign.title}
                                className="rounded object-fit-cover"
                                style={{ width: '100%', height: '100%' }}
                                onError={(e) => {
                                  e.target.src = "/placeholder.jpg";
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <strong>{campaign.title}</strong>
                            <p className="small text-muted mb-0">
                              {campaign.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted font-monospace">
                          {`${campaign.author?.slice(0, 6)}...${campaign.author?.slice(-4)}`}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-success rounded-pill">
                          {campaign.balance} AVAX
                        </span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${campaign.active ? 'bg-success' : 'bg-secondary'}`}>
                          {campaign.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <CampaignActions campaignId={campaign.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}