// src/app/components/Navbar.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Donate Crypto
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${pathname === '/' ? 'active' : ''}`} 
                href="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${pathname === '/about' ? 'active' : ''}`} 
                href="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${pathname === '/recentCampaigns' ? 'active' : ''}`} 
                href="/recentCampaigns"
              >
                Campaigns
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${pathname === '/create' ? 'active' : ''}`} 
                href="/create"
              >
                Create
              </Link>
            </li>
          </ul>
          
          <div className="d-flex">
            <button className="btn btn-outline-primary">
              <img src="/metamask-icon.svg" alt="MetaMask" width="24" className="me-2"/>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}