
let address= {
    tresure: "0x7f9DC432e1B4e5D0C5994ee3439bADDb922dc061",  
    vetbankAddr: "0x27e8F277826AE9aD67178978d2c89a52f7a5177A"
     }
  let abi = {
  
    tresure: [
        "function openbox(uint _id) public",
        "function gamestart(uint _id) public",
        "function  total( ) public view returns(uint)",
        "function myinfo(address user) public view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,)",
        "function getpower(address user) public view returns(uint)",
        "function getcollect(address _address) external view returns (uint256[] memory)",
        "function cllect(address _address,uint num) external view returns (uint)",  //수집
        "event reward(uint amount);"
      ],
  
      vetbank: [
       
        "function myinfo(address user) public view returns (uint256,uint256,uint256,uint256,uint256,uint256,address,address)",
        ],
  
  };
  
  async function Gamestart(treasureId) {
    // Connect to the user's Web3 provider
    let userProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    // Request adding Binance Smart Chain to wallet
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0xCC",
            rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
            chainName: "opBNB",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18
            },
            blockExplorerUrls: ["https://opbnbscan.com"]
        }]
    });
    
    // Request access to user's accounts
    await userProvider.send("eth_requestAccounts", []);
    
    // Get the signer (account) from the provider
    let signer = userProvider.getSigner();
  
    // Instantiate the treasure contract with the signer
    let tresureContract = new ethers.Contract(address.tresure, abi.tresure, signer);
    
    // Log the retrieved value (for debugging)
    console.log("Treasure ID:", treasureId);
    
    try {
        // Call the contract's 'openbox' function with the retrieved treasure ID
        await tresureContract.gamestart(treasureId);
    } catch(e) {
        // Handle any errors that occur during the transaction
        alert(e.data.message.replace('execution reverted: ',''));
    }
};
  
  
  async function Openbox(treasureId) {
    // Connect to the user's Web3 provider
    let userProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    // Request adding Binance Smart Chain to wallet
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0xCC",
            rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
            chainName: "opBNB",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18
            },
            blockExplorerUrls: ["https://opbnbscan.com"]
        }]
    });
    
    // Request access to user's accounts
    await userProvider.send("eth_requestAccounts", []);
    
    // Get the signer (account) from the provider
    let signer = userProvider.getSigner();
  
    // Instantiate the treasure contract with the signer
    let tresureContract = new ethers.Contract(address.tresure, abi.tresure, signer);
    
    // Log the retrieved value (for debugging)
    console.log("Treasure ID:", treasureId);
    
    try {
        // Call the contract's 'openbox' function with the retrieved treasure ID
        await tresureContract.openbox(treasureId);
    } catch(e) {
        // Handle any errors that occur during the transaction
        alert(e.data.message.replace('execution reverted: ',''));
    }
};

  
  
 
  
  export {Openbox};
  export {Gamestart};