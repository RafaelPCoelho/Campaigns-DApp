"use client"

import { useRouter } from "next/navigation";

export default function Home() {

  const {push} = useRouter();

  function btnLoginClick() {
    push("/create");
  }
  
  return (
    <>
      <div className="container px-4 py-5 mx-auto">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-6">
            <img src="/HomeImage.png" className="d-block mx-lg-auto img-fluid" width="700" height="700" />
          </div>
          <div className="col-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Donate Crypto</h1>
            <p className="lead">Donate crypto to your favorite non-profit organizations. We make it easy to give back using the latest technology.</p>
            <p className="lead">We support a wide range of cryptocurrencies, including Bitcoin, Ethereum, and many others. Our platform is secure and user-friendly, making it easy for you to donate.</p>
            <p className="lead">Join us in making a difference in the world. Your donations can help fund important projects and initiatives that make a positive impact.</p>
            <p className="lead">Sign up today and start donating crypto to your favorite causes. Together, we can make a difference!</p>
            <p className="lead">Thank you for your support!</p>
            <div className="d-flex justify-content-start mt-5">
              <button type="button" className="btn btn-primary btn-lg px-4 md-2 col-6" onClick={btnLoginClick}>
                <img src="/metamask-icon.svg" alt="MetaMask" width="64" className="me-2"/>
                Connect
              </button>
            </div>
            <div className="alert alert-success p-3 col-6 mt-3" role="alert">User authenticated successfully</div>
          </div>
        </div>
      </div>
    </>
  );
}
