
let address= {
    tresure: "0xfa1144E8B4dD23d07a1FC3400a2582fac1A9aBdD",  //game.sol 계약 주소 

     }
  let abi = {
  
    tresure: [
        "function openbox(uint _id) public",
        "function gamestart(uint _id) public",
        "function  g1(address user,uint _id) public view returns(bool)",
        "function  g2(uint _id) public view returns(uint) ",
        "function  g3() public view returns(uint)",
        "function  g6() public view returns(uint)",
        "event reward(uint amount);"
      ]
  

  };

  
  let Vettop = async () => {
   
    
    const provider = new ethers.providers.JsonRpcProvider('https://opbnb-mainnet-rpc.bnbchain.org');
  
    let tresureContract = new ethers.Contract(address.tresure, abi.tresure, provider);
    let vet1 = await tresureContract.g3(); //jack
    let vetprice = await tresureContract.g6(); //jack
    document.getElementById("jack").innerHTML = parseFloat(vet1*vetprice/1e18/4).toFixed(4);
  
    tresureContract.on('reward', (amount) => {
     console.log('찾은보물:', amount);
     let formattedAmount = (amount / 1e18).toFixed(6);
     document.getElementById('eventT1').innerText = `포인트+ ${formattedAmount} P`;
     treasureBox.style.display = "none";
     const eventDiv = document.getElementById('eventDiv');
     eventDiv.classList.remove('hidden');
  });
  
  
  }
  
  Vettop ();




  
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