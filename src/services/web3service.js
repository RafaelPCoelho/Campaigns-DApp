import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0xb7E853ECE61905be884f227e54412D3103D5cB0a";

export async function doLogin() {
  if(!window.ethereum) throw new Error("MetaMask is not installed. Please install it to use this app.");

  console.log(window.ethereum); // Should show MetaMask object
  console.log(await window.ethereum.request({ method: 'eth_chainId' })); // Current chain ID

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();

  if(!accounts || !accounts.length) throw new Error("No account found. Please connect to MetaMask.");

  localStorage.setItem("walllet", accounts[0]);
  return accounts[0];
}

function getContract() {
  const web3 = new Web3(window.ethereum);
  const from = localStorage.getItem("walllet");
  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function addCampaign(campaign) {
  const contract = getContract();
  return contract.methods.addCampaign(campaign.title, campaign.description, campaign.videoUrl, campaign.imageUrl).send();
}

export async function getLestCampaignID(){
  const contract = getContract();
  return contract.methods.nextId().call();
}

export async function getCampaigns(id) { 
  const contract = getContract();
  return contract.methods.campaigns(id).call();
}

export async function donate(id, donation){
  await doLogin();
  const contract = getContract();
  return contract.methods.donate(id).send({ 
    value: Web3.utils.toWei(donation, "ether") 
  });
}

export async function getCurrentAccount() {
  if(!window.ethereum) throw new Error("MetaMask not installed");
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0] || null;
}

export async function withdrawFunds(id) {
  const contract = getContract();
  return contract.methods.withdraw(id).send();
}

export async function getRecentCampaigns() {
  const contract = getContract();
  const nextId = await contract.methods.nextId().call();
  const numberOfCampaigns = parseInt(nextId, 10);
  if (numberOfCampaigns === 0) return []; // No campaigns available
  const count = Math.min(5, numberOfCampaigns); // Get the last 5 campaigns
  
  const campaigns = [];
  for (let i = 0; i < count; i++) {
    const id = numberOfCampaigns - 1 - i;
    const campaignData = await contract.methods.campaigns(id).call();
    campaigns.push({
      id,
      author: campaignData.author,
      title: campaignData.title,
      imageUrl: campaignData.imageUrl,
      balance: Web3.utils.fromWei(campaignData.balance, "ether"),
      active: campaignData.active,
      description: campaignData.description,
      videoUrl: campaignData.videoUrl
    });
  }
  
  return campaigns;
}

export async function getContractOwner() {
  const contract = getContract();
  return contract.methods.owner().call();
}

export async function isSuperAdmin() {
  try {
    const account = await getCurrentAccount();
    if (!account) return false;
    
    const owner = await getContractOwner();
    return account.toLowerCase() === owner.toLowerCase();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getTotalFees() {
  const contract = getContract();
  return contract.methods.totalFees().call();
}

export async function withdrawFees() {
  const contract = getContract();
  return contract.methods.withdrawFees().send();
}

export async function editCampaign(
  id,
  newTitle,
  newDescription,
  newVideoUrl,
  newImageUrl
) {
  const contract = getContract();
  return contract.methods.editCampaign(
    id,
    newTitle || "",
    newDescription || "",
    newVideoUrl || "",
    newImageUrl || ""
  ).send();
}