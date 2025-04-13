import Web3 from "web3";
import ABI from "./ABI.json"; // Replace with your actual ABI file path

const CONTRACT_ADDRESS = "0xa72546C800C854B88F3053330beb5C7F1371fcA1"; // Replace with your actual contract address

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