// about/page.js (para Next.js 13+ com App Router)
// ou
// pages/about.js (para o pages router tradicional)

import Link from 'next/link';

export default function About() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4 fw-bold mb-4">About Donate Crypto</h1>
          
          <div className="mb-5">
            <h2 className="h3 mb-3">Our Mission</h2>
            <p className="lead">
              At Donate Crypto, we believe in the power of blockchain technology to transform philanthropy. 
              Our mission is to make cryptocurrency donations simple, transparent, and accessible to everyone.
            </p>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">How It Works</h2>
            <p>
              Our platform connects donors with verified non-profit organizations that accept cryptocurrency donations. 
              We support multiple cryptocurrencies and ensure that your donations reach their intended recipients securely.
            </p>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item">1. Connect your crypto wallet</li>
              <li className="list-group-item">2. Browse vetted non-profit organizations</li>
              <li className="list-group-item">3. Donate with just a few clicks</li>
              <li className="list-group-item">4. Receive a transparent transaction record</li>
            </ul>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">The Team</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Rafael Coelho</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Founder & CEO</h6>
                    <p className="card-text">Blockchain Engineer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="h3 mb-3">Our Technology</h2>
            <p>
              We leverage Ethereum smart contracts to ensure transparency in all transactions. 
              Our platform is built with Next.js for performance and React for a seamless user experience.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <span className="badge bg-primary">Next.js</span>
              <span className="badge bg-secondary">React</span>
              <span className="badge bg-success">Solidity</span>
              <span className="badge bg-danger">Ethereum</span>
              <span className="badge bg-warning text-dark">Web3.js</span>
              <span className="badge bg-info">IPFS</span>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="btn btn-primary btn-lg px-4">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}