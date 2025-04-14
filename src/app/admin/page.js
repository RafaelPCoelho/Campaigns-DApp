// src/app/admin/page.jsx
"use client";

import { useEffect, useState } from 'react';
import { 
  isSuperAdmin, 
  getCurrentAccount, 
  getCampaigns, 
  getLestCampaignID,
  getTotalFees,
  withdrawFees
} from '@/services/web3service';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';

export default function AdminPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [totalFees, setTotalFees] = useState('0');
  const [loading, setLoading] = useState(true);
  const [feeLoading, setFeeLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      try {
        const account = await getCurrentAccount();
        if (!account || !(await isSuperAdmin())) {
          router.push('/');
        } else {
          loadData();
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push('/');
      }
    }

    checkAccess();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      await Promise.all([loadCampaigns(), loadTotalFees()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCampaigns() {
    const nextId = await getLestCampaignID();
    const allCampaigns = [];
    
    for (let i = 0; i < nextId; i++) {
      const campaign = await getCampaigns(i);
      allCampaigns.push({
        id: i,
        title: campaign.title,
        description: campaign.description,
        balance: campaign.balance,
        active: campaign.active,
        author: campaign.author
      });
    }
    
    setCampaigns(allCampaigns);
  }

  async function loadTotalFees() {
    const fees = await getTotalFees();
    setTotalFees(fees);
  }

  async function handleWithdrawFees() {
    if (!window.confirm("Are you sure you want to withdraw all accumulated fees?")) return;
    
    try {
      setFeeLoading(true);
      await withdrawFees();
      alert("Fees withdrawn successfully!");
      loadTotalFees();
    } catch (error) {
      console.error("Error withdrawing fees:", error);
      alert("Failed to withdraw fees: " + error.message);
    } finally {
      setFeeLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {/* Fees Section */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Platform Fees</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title">Accumulated Fees</h6>
              <p className="card-text fs-4">
                {Web3.utils.fromWei(totalFees, "ether")} ETH
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleWithdrawFees}
              disabled={feeLoading || totalFees === '0'}
            >
              {feeLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Withdrawing...
                </>
              ) : (
                'Withdraw Fees'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Campaigns Section (view only) */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">All Campaigns</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Creator</th>
                  <th>Balance (ETH)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{campaign.id}</td>
                    <td>{campaign.title}</td>
                    <td>{campaign.author}</td>
                    <td>{Web3.utils.fromWei(campaign.balance, "ether")}</td>
                    <td>{campaign.active ? "Active" : "Close"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}