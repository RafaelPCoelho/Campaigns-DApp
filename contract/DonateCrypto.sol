// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Campaign Structure
 * @notice Defines the data structure for a crowdfunding campaign
 */
struct Campaign {
    address author;      // Creator's wallet address
    string title;        // Campaign title
    string description;  // Detailed description
    string videoUrl;     // URL for promotional video
    string imageUrl;     // URL for cover image
    uint256 balance;     // Total donated amount (in wei)
    bool active;        // Whether campaign is still active
}

/**
 * @title DonateCrypto
 * @notice A smart contract for creating and managing crypto donation campaigns
 * @dev Implements basic crowdfunding functionality with fee collection
 */
contract DonateCrypto {
    uint256 public fee = 100; // wei - platform fee per withdrawal
    uint256 public nextId = 0; // Next campaign ID counter
    uint256 public totalFees; // Accumulated platform fees
    address public owner; // Contract owner/admin

    // Storage mappings
    mapping(uint256 => Campaign) public campaigns; // ID => Campaign
    mapping(uint256 => mapping(address => bool)) public hasDonated; // ID => (Donor => Donation status)
    mapping(uint256 => uint256) public supportersCount; // ID => Unique supporters count

    /**
     * @dev Sets the contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Allows campaign author to update campaign details
     * @dev Only updates fields that receive non-empty values
     * @param id Campaign ID to update
     * @param newTitle Updated title (empty to keep current)
     * @param newDescription Updated description (empty to keep current)
     * @param newVideoUrl Updated video URL (empty to keep current)
     * @param newImageUrl Updated image URL (empty to keep current)
     */
    function editCampaign(
        uint256 id,
        string calldata newTitle,
        string calldata newDescription,
        string calldata newVideoUrl,
        string calldata newImageUrl
    ) public {
        require(campaigns[id].author == msg.sender, "Only author can edit.");
        require(campaigns[id].active, "Campaign is already closed.");

        // Update only non-empty fields
        if (bytes(newTitle).length > 0) {
            campaigns[id].title = newTitle;
        }
        if (bytes(newDescription).length > 0) {
            campaigns[id].description = newDescription;
        }
        if (bytes(newVideoUrl).length > 0) {
            campaigns[id].videoUrl = newVideoUrl;
        }
        if (bytes(newImageUrl).length > 0) {
            campaigns[id].imageUrl = newImageUrl;
        }
    }
    
    /**
     * @notice Creates a new donation campaign
     * @param title Campaign title
     * @param description Detailed description
     * @param videoUrl URL for promotional video
     * @param imageUrl URL for cover image
     */
    function addCampaign(
        string calldata title,
        string calldata description,
        string calldata videoUrl,
        string calldata imageUrl
    ) public {
        Campaign memory newCampaign = Campaign({
            title: title,
            description: description,
            videoUrl: videoUrl,
            imageUrl: imageUrl,
            balance: 0,
            active: true,
            author: msg.sender
        });

        campaigns[nextId] = newCampaign;
        nextId++;
    }

    /**
     * @notice Donate to a campaign
     * @param id Campaign ID to donate to
     * @dev Records first-time donors and updates supporter count
     */
    function donate(uint256 id) public payable {
        require(msg.value > 0, "Amount must be greater than 0.");
        require(campaigns[id].active, "Campaign is not active.");
        
        campaigns[id].balance += msg.value;

        // Track unique supporters
        if (!hasDonated[id][msg.sender]) {
            hasDonated[id][msg.sender] = true;
            supportersCount[id]++;
        }
    }

    /**
     * @notice Withdraw funds from a campaign
     * @param id Campaign ID to withdraw from
     * @dev Deducts platform fee and closes campaign after withdrawal
     */
    function withdraw(uint256 id) public {
        Campaign storage campaign = campaigns[id];
        require(campaign.author == msg.sender, "Only author can withdraw.");
        require(campaign.active, "Campaign is already closed.");
        require(campaign.balance >= fee, "Amount must cover the fee.");
        
        uint256 amount = campaign.balance - fee;
        totalFees += fee; // Collect platform fee
        campaign.balance = 0;
        campaign.active = false;

        // Secure ETH transfer
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed.");
    }

    /**
     * @notice Gets titles of most recent campaigns
     * @return Array of campaign titles (max 5)
     */
    function recentCampaigns() public view returns (string[] memory) {
        uint256 count = nextId >= 5 ? 5 : nextId;
        string[] memory recentTitles = new string[](count);
        
        for(uint256 i = 0; i < count; i++) {
            recentTitles[i] = campaigns[nextId - count + i].title;
        }
        
        return recentTitles;
    }

    /**
     * @notice Allows owner to withdraw accumulated platform fees
     * @dev Prevents reentrancy by resetting balance before transfer
     */
    function withdrawFees() public {
        require(msg.sender == owner, "Only owner can withdraw fees.");
        require(totalFees > 0, "No fees accumulated.");

        uint256 amount = totalFees;
        totalFees = 0; // Prevent reentrancy

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Fee withdrawal failed.");
    }

}