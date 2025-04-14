"use client";

import { useState, useEffect } from "react";
import { getCampaigns, donate, getCurrentAccount, withdrawFunds, editCampaign } from "@/services/web3service";
import { useParams } from "next/navigation";
import Web3 from "web3";

export default function CampaignPage() {
    const params = useParams();
    const [campaign, setCampaign] = useState({});
    const [message, setMessage] = useState("");
    const [donation, setDonation] = useState(0);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isCheckingAuthor, setIsCheckingAuthor] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        videoUrl: "",
        imageUrl: ""
    });

    // Load campaign and check account connection
    useEffect(() => {
        loadCampaign();
        checkAccountConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    // Update author verification when campaign or account changes
    useEffect(() => {
        if (campaign.author && currentAccount !== undefined) {
            checkIfAuthor();
        }
    }, [campaign.author, currentAccount]);

    // Initialize edit form when campaign data is available
    useEffect(() => {
        if (campaign.title) {
            setEditForm({
                title: campaign.title,
                description: campaign.description,
                videoUrl: campaign.videoUrl,
                imageUrl: campaign.imageUrl
            });
        }
    }, [campaign]);

    async function loadCampaign() {
        setMessage("Loading campaign...");
        try {
            const result = await getCampaigns(params.id);
            setMessage("");
            result.id = params.id;
            setCampaign(result);
        } catch (error) {
            console.error(error);
            setMessage("Error loading campaign: " + error.message);
        }
    }

    async function checkAccountConnection() {
        try {
            const account = await getCurrentAccount();
            setCurrentAccount(account);
        } catch (error) {
            console.error("Error checking account:", error);
            setCurrentAccount(null);
        } finally {
            setIsCheckingAuthor(false);
        }
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            setCurrentAccount(null);
        } else {
            setCurrentAccount(accounts[0]);
        }
    }

    function checkIfAuthor() {
        if (currentAccount && campaign.author) {
            const authorMatch = currentAccount.toLowerCase() === campaign.author.toLowerCase();
            setIsAuthor(authorMatch);
        } else {
            setIsAuthor(false);
        }
        setIsCheckingAuthor(false);
    }

    function onDonationChange(event) {
        setDonation(event.target.value);
    }

    function onEditChange(event) {
        setEditForm({
            ...editForm,
            [event.target.name]: event.target.value
        });
    }

    async function btnDonateClick() {
        if (!donation || donation <= 0) {
            setMessage("Please enter a valid donation amount");
            return;
        }

        setMessage("Processing donation...");
        try {
            const tx = await donate(campaign.id, donation);
            setMessage(`Donation successful! Transaction ID: ${tx.transactionHash}`);
            setDonation(0);
            await loadCampaign();
        } catch (error) {
            console.error(error);
            setMessage(`Error donating: ${error.message}`);
        }
    }

    async function btnWithdrawClick() {
        if (!isAuthor) {
            setMessage("Only the campaign author can withdraw funds");
            return;
        }

        if (!campaign.active) {
            setMessage("Campaign is already closed");
            return;
        }

        if (campaign.balance <= 100) {
            setMessage("Insufficient balance to withdraw (must cover 100 wei fee)");
            return;
        }

        setMessage("Processing withdrawal...");
        try {
            const tx = await withdrawFunds(campaign.id);
            setMessage(`Withdrawal successful! Campaign closed. Transaction ID: ${tx.transactionHash}`);
            await loadCampaign();
        } catch (error) {
            console.error(error);
            setMessage(`Error withdrawing funds: ${error.message}`);
        }
    }

    async function btnEditClick() {
        setMessage("Updating campaign...");
        try {
            const tx = await editCampaign(
                campaign.id,
                editForm.title,
                editForm.description,
                editForm.videoUrl,
                editForm.imageUrl
            );
            setMessage(`Campaign updated successfully! Transaction ID: ${tx.transactionHash}`);
            setIsEditing(false);
            await loadCampaign();
        } catch (error) {
            console.error(error);
            setMessage(`Error updating campaign: ${error.message}`);
        }
    }

    return (
        <div className="container">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                {isEditing ? "Edit Campaign" : campaign.title || "Campaign"}
            </h1>
            <hr />
            
            {isEditing ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={editForm.title}
                                onChange={onEditChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                rows="3"
                                value={editForm.description}
                                onChange={onEditChange}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="videoUrl" className="form-label">Video URL</label>
                            <input
                                type="text"
                                className="form-control"
                                id="videoUrl"
                                name="videoUrl"
                                value={editForm.videoUrl}
                                onChange={onEditChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imageUrl" className="form-label">Image URL</label>
                            <input
                                type="text"
                                className="form-control"
                                id="imageUrl"
                                name="imageUrl"
                                value={editForm.imageUrl}
                                onChange={onEditChange}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={btnEditClick}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row flex-lg-row-reverse align-items-center g-5">
                    <div className="col-7">
                        {campaign.videoUrl ? (
                            <iframe 
                                width="100%" 
                                height="480" 
                                src={`https://www.youtube.com/embed/${campaign.videoUrl}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <img 
                                src={campaign.imageUrl || "../../../../public/placeholder.jpg"} 
                                className="d-block mx-lg-auto img-fluid" 
                                width="640" 
                                height="480" 
                                alt={campaign.title}
                            />
                        )}
                    </div>

                    <div className="col-5 mb-5">
                        <h2>{campaign.title}</h2>
                        <p><strong>Author:</strong> {campaign.author}</p>
                        <p><strong>Status:</strong> {campaign.active ? "Active" : "Closed"}</p>
                        <p className="mb-3">{campaign.description}</p>
                        
                        <p className="mb-3 fst-italic mt-5">
                            Total raised: {Web3.utils.fromWei(campaign.balance || "0", "ether")} ETH
                        </p>

                        {campaign.active && (
                            <div className="mb-3">
                                <div className="input-group">
                                    <input
                                        type="number"
                                        id="donation"
                                        className="form-control p-3 w-50"
                                        value={donation}
                                        onChange={onDonationChange}
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    <span className="input-group-text">ETH</span>
                                    <button
                                        type="button"
                                        className="btn btn-primary p-3 w-25"
                                        onClick={btnDonateClick}
                                        disabled={!donation || donation <= 0}
                                    >
                                        Donate
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Author actions */}
                        {!isCheckingAuthor && isAuthor && (
                            <div className="d-flex gap-2 mb-3">
                                {campaign.active && campaign.balance > 100 && (
                                    <button
                                        type="button"
                                        className="btn btn-success p-3"
                                        onClick={btnWithdrawClick}
                                        disabled={!campaign.active || campaign.balance <= 100}
                                    >
                                        Withdraw Funds
                                    </button>
                                )}
                                {campaign.active && (
                                    <button
                                        type="button"
                                        className="btn btn-warning p-3"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Campaign
                                    </button>
                                )}
                            </div>
                        )}

                        {message && (
                            <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"} p-3 mt-3`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}