// Complete ABI for the BoatFactory contract
export const BOAT_FACTORY_ABI = [
    {
      "inputs": [],
      "name": "getAllBoats",
      "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "boatAddress", "type": "address"}],
      "name": "getBoatInfo",
      "outputs": [
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "address", "name": "ownerAddress", "type": "address"},
        {"internalType": "uint256", "name": "tokenCount", "type": "uint256"},
        {"internalType": "bool", "name": "locked", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "string", "name": "boatName", "type": "string"}],
      "name": "createBoat",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBoatCount",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
      "name": "getBoatById",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "boatAddress", "type": "address"},
        {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
        {"indexed": true, "internalType": "address", "name": "owner", "type": "address"}
      ],
      "name": "BoatCreated",
      "type": "event"
    },
    {
      "inputs": [{"internalType": "address", "name": "boatAddress", "type": "address"}],
      "name": "mintToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  export const BOAT_ABI = [
    {
      "inputs": [
        {"internalType": "bytes32", "name": "tokenHash", "type": "bytes32"},
        {"internalType": "string", "name": "metadataURI", "type": "string"}
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"internalType": "address", "name": "to", "type": "address"}
      ],
      "name": "send",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
