// recent-campaigns/page.js
import Link from 'next/link';
import CampaignActions from '../components/CampaignActions';

export default function RecentCampaigns() {
  // Dados mockados - substitua pelas URLs reais que você vai usar
  const recentCampaigns = [
    {
      author: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Save the Rainforest",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_Rfe3Ws9WEv8DPnrbMw09Y5_pJrrQKhtsDHXVlu7sDY4SOJv3QBPjZ1vHW0sSHxPGDg&usqp=CAU", // Agora usando imagem local
      balance: "2.5 ETH",
      active: true
    },
    {
      author: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Save the Rainforest",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_Rfe3Ws9WEv8DPnrbMw09Y5_pJrrQKhtsDHXVlu7sDY4SOJv3QBPjZ1vHW0sSHxPGDg&usqp=CAU", // Agora usando imagem local
      balance: "2.5 ETH",
      active: true
    },
    {
      author: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Save the Rainforest",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_Rfe3Ws9WEv8DPnrbMw09Y5_pJrrQKhtsDHXVlu7sDY4SOJv3QBPjZ1vHW0sSHxPGDg&usqp=CAU", // Agora usando imagem local
      balance: "2.5 ETH",
      active: true
    },
    {
      author: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Save the Rainforest",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_Rfe3Ws9WEv8DPnrbMw09Y5_pJrrQKhtsDHXVlu7sDY4SOJv3QBPjZ1vHW0sSHxPGDg&usqp=CAU", // Agora usando imagem local
      balance: "2.5 ETH",
      active: true
    },
    

  ];

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
          
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Campaign</th>
                  <th scope="col">Author</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
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
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              className="rounded object-fit-cover"
                              style={{ width: '100%', height: '100%' }}
                            />
                          </div>
                        )}
                        <div>
                          <strong>{campaign.title}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted font-monospace">
                        {`${campaign.author.slice(0, 6)}...${campaign.author.slice(-4)}`}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-success rounded-pill">
                        {campaign.balance}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${campaign.active ? 'bg-success' : 'bg-secondary'}`}>
                        {campaign.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <CampaignActions campaignId={index} />
                    </td>
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