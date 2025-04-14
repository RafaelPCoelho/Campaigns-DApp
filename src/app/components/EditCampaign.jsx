// src/app/components/EditCampaign.jsx
"use client";

import { useState } from 'react';
import { editCampaign } from '@/services/web3service';
import { useRouter } from 'next/navigation';

export default function EditCampaign({ campaign }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: campaign.title,
    description: campaign.description,
    videoUrl: campaign.videoUrl,
    imageUrl: campaign.imageUrl
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await editCampaign(
        campaign.id,
        form.title,
        form.description,
        form.videoUrl,
        form.imageUrl
      );
      alert("Campaign updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5>Edit Campaign</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="videoUrl" className="form-label">Video URL</label>
            <input
              type="text"
              className="form-control"
              id="videoUrl"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}