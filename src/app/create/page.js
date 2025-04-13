'use client';

import { useState } from "react";
import { addCampaign, getLestCampaignID } from "@/services/web3service";


export default function Home() {

    const [message, setMessage] = useState();
    const [campaign, setCampaign] = useState({
        title: "",
        description: "",
        imageUrl: "",
        videoUrl: ""
    });

    function onInputChange(event) {
        setCampaign(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function btnSaveClick() {
        setMessage(" Saving campaign...");
        addCampaign(campaign)
        .then(tx => getLestCampaignID())
        .then( id => setMessage( `Campaign created with ID: ${id} Link: localhost:3000/donate/${id}`))
        .catch((error) => {
            console.error(error);
            setMessage("Error saving campaign: " + error.message);
        })
    }

    return (
        <>
            <div className="container">
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3 nt-5">Create a new donation page</h1>
                <p className="lead">Create a new donation page for your non-profit organization.</p>
                <p>Fill the forms to including your campaign</p>
                <hr className="my-4" />
                <div className="col-6">
                    <div className="form-floating mb-3">
                        <input type="text" id="title" className="form-control" onChange={onInputChange} value={campaign.title || ""} />
                        <label htmlFor="title">Title</label>
                    </div>
                    <div className="form-floating mb-3">
                        <textarea id="description" className="form-control" onChange={onInputChange} value={campaign.description || ""} />
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" id="imageUrl" className="form-control" onChange={onInputChange} value={campaign.imageUrl || ""} />
                        <label htmlFor="imageUrl">Image URL</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" id="videoUrl" className="form-control" onChange={onInputChange} value={campaign.videoUrl || ""} />
                        <label htmlFor="videoUrl">Video URL</label>
                    </div>
                    <div className="col-6 mb-3">
                        <button type="button" className="btn btn-primary col-6 p-3" onClick={btnSaveClick}>Save</button>
                    </div>
                    {
                        message ? <div className="alert alert-success p-3" role="alert">{message}</div>
                            : <> </>
                    }

                </div>
            </div>
        </>
    );
}
