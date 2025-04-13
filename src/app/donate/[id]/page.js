"use client";

import { useState, useEffect } from "react";
import { getCampaigns, donate } from "@/services/web3service";
import { useParams } from "next/navigation";
import Web3 from "web3";

export default function Donate() {

    const params = useParams();

    const [campaign, setCampaign] = useState({});
    const [message, setMessage] = useState("");
    const [donation, setDonation] = useState(0);

    useEffect(() => {
        setMessage("Loading campaign...");
        getCampaigns(params.id)
            .then(result => {
                setMessage("");
                result.id = params.id;
                setCampaign(result)
            })
            .catch(error => {
                console.error(error)
                setMessage("Error loading campaign: " + error.message);
            });
    }, []);

    function onDonationChange(event) {
        setDonation(event.target.value);
    }
    function btnDonateClick() { 
        setMessage(" Processing donation...");
        donate(campaign.id, donation)
            .then(tx => {
                setMessage("Donation successful! Transaction ID: " + tx.transactionHash);
                setDonation(0);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Error donating: " + error.message);
            });
    }

    return (
        <>
            <div className="container">
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3 nt-5">Donate</h1>
                <p className="lead">Donate to your favorite non-profit organization.</p>
                <hr />
                <div className="row flex-lg-row-reverse align-items-center g-5">
                    <div className="col-7">
                        {
                            campaign.videoUrl ? <iframe width="100%" height="480" src={`https://www.youtube.com./embed/${campaign.videoUrl}`}></iframe> :
                                <img src={campaign.imageUrl} className="d-block mx-lg-auto img-fluid" width="640" height="480" />
                        }
                    </div>
                    <div className="col-5 mb-5 " style={{ height: 480, scrollbars: true }}>
                        <h2>{campaign.title}</h2>
                        <p><strong>Author:</strong>{campaign.author}</p>
                        <p className="mb-3">{campaign.description}</p>
                        <p className="mb-3 fst-italic mt-5">Has already been raised for the project: {Web3.utils.fromWei(campaign.balance || 0, "ether")} AVAX. How much do you want to donate?
                        </p>
                        <div className="mb-3">
                            <div className="input-group">
                                <input type="number" id="donation" className="form-control p-3 w-50" value={donation} onChange={onDonationChange}/>
                                <span className="input-group-text">AVAX</span>
                                <button type="button" className="btn btn-primary p-3 w-25" onClick={btnDonateClick}>Donate</button>
                            </div>
                            {
                        message ? <div className="alert alert-success p-3 mt-3" role="alert"> {message} </div>
                            : <> </>
                    }
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
