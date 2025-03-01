declare global {
  interface Window {
    ethereum?: any;
  }
}

interface EthereumError {
  code: number;
}

"use client"

import { useState } from "react"
import { Info, ArrowUpRight } from "lucide-react"
import BuildShipModal from "./components/build-ship-modal"
import RWASuccessModal from "./components/rwa-success-modal"
import RWATransferModal from "./components/rwa-transfer-modal"
import RWAInfoModal from "./components/rwa-info-modal"
import { ethers } from "ethers"
import { BOAT_FACTORY_ABI, BOAT_ABI } from "./lib/FactoryAbi"

const BOAT_FACTORY_ADDRESS = '0x10043682974f42491DCeF0d761c8c42F62B5f0c7';
const JWT = process.env.NEXT_PUBLIC_JWT;

export default function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("ships")
  const [hasShips, setHasShips] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRWAModalOpen, setIsRWAModalOpen] = useState(false)
  const [rwaData, setRwaData] = useState({
    name: "House1",
    shipName: "Ship",
    tokenId: "####",
    hash: "0x",
    description: "...",
    fileUrl: "IPFS://",
    txId: "0x...",
  })
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [selectedRWA, setSelectedRWA] = useState({
    name: "House1",
    tokenId: "####",
    hash: "0x",
    description: "...",
    fileUrl: "IPFS://",
  })
  const [selectedRWAInfo, setSelectedRWAInfo] = useState({
    shipAddress: "0x",
    name: "House1",
    tokenId: "####",
    hash: "0x",
    description: "...",
    fileUrl: "IPFS://",
    pastOwners: [{ date: "dd/mm/yy", address: "0x..." }],
  })

  // Sample ship data
  const ships = [
    { id: "#1", hash: "hash1", name: "RWAName1" },
    { id: "#2", hash: "hash2", name: "RWAName1" },
    { id: "#3", hash: "hash3", name: "RWAName1" },
  ]

  const [shipsTable, setShipsTable] = useState([
    { name: "Vault1", status: "ON", address: "0x..." },
  ])

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rwaName, setRwaName] = useState('');
  const [rwaDescription, setRwaDescription] = useState('');
  const [selectedShip, setSelectedShip] = useState('');

  const getContract = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(BOAT_FACTORY_ADDRESS, BOAT_FACTORY_ABI, signer);
  };


  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Switch to U2U Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x9b4' }], // 2484 in hex
          });
        } catch (switchError) {
          // Chain hasn't been added yet
          if ((switchError as EthereumError).code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x9b4',
                chainName: 'U2U Nebulas Testnet',
                nativeCurrency: {
                  name: 'U2U',
                  symbol: 'U2U',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-nebulas-testnet.uniultra.xyz/'],
                blockExplorerUrls: ['https://testnet.u2uscan.xyz']
              }]
            });
          }
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
    setIsConnected(true)
  }

  const openBuildModal = () => {
    setIsModalOpen(true)
  }

  const handleBuild = async (name: string, initialState: "ON" | "OFF") => {
    console.log("Building ship:", { name, initialState })
    setIsModalOpen(false)
    if (!name.trim()) {
      alert('Please enter a ship name');
      return;
    }

    try {
      const contract = await getContract();
      console.log("Creating ship with name:", name);
      const tx = await contract?.createBoat(name);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      // Obtener el último ID de barco creado
      const boatCount = await contract?.getBoatCount();
      console.log("Total boats:", boatCount?.toString());
      
      const lastIndex = Number(boatCount) - 1;

      // Obtener la dirección del barco usando el ID
      const boatAddress = await contract?.getBoatById(lastIndex);
      console.log("New boat address:", boatAddress);

      setShipsTable([...shipsTable, { name: name, status: "ON", address: boatAddress }])
      console.log("Transaction confirmed");
      setHasShips(true)
    } catch (error) {
      console.error("Error creating ship:", error);
      alert('Error creating ship. Check console for details.');
    }
  }

  const handleCreateRWA = async () => {
    if (!selectedFile || !rwaName || !rwaDescription || !selectedShip) {
      alert('Please fill all fields and select a PDF file');
      return;
    }
      
    try {
      // Crear FormData con el archivo
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Subir archivo a IPFS
      const uploadResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JWT}`,
        },
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to IPFS');
      }
      
      const uploadData = await uploadResponse.json();
      console.log("uploadData", uploadData);
      const fileHash = uploadData.IpfsHash;
      
      // Crear metadata
      const metadata = {
        name: rwaName,
        description: rwaDescription,
        shipAddress: selectedShip,
        file: `ipfs://${fileHash}`,
        fileHash: ethers.keccak256(ethers.toUtf8Bytes(fileHash))
      };

      // Actualizar metadata en Pinata
      const metadataResponse = await fetch('https://api.pinata.cloud/pinning/hashMetadata', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ipfsPinHash: fileHash,
          name: rwaName,
          keyvalues: metadata
        })
      });
      
      if (!metadataResponse.ok) {
        throw new Error('Failed to update metadata');
      }
      console.log("metadataResponse", metadataResponse);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const shipContract = new ethers.Contract(selectedShip, BOAT_ABI, signer);

       /* console.log("Connected wallet:", account);
      const owner = await shipContract.owner();
      if (owner.toLowerCase() !== account?.toLowerCase()) {
        throw new Error('You are not the owner of this ship');
      } */
      console.log("metadata", metadata);
      let bytes32Hash;
      if (fileHash.startsWith('0x')) {
        // Si ya es un hex string, asegurarse de que tenga el largo correcto
        bytes32Hash = ethers.zeroPadValue(fileHash, 32);
      } else {
        // Si no es hex, convertir el string a bytes32
        bytes32Hash = ethers.keccak256(ethers.toUtf8Bytes(fileHash));
      }
      console.log("bytes32Hash", bytes32Hash);
      const tx = await shipContract.mint(bytes32Hash, metadata.file);
      console.log("Token mint transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Token mint confirmed, receipt:", receipt);

      // Actualizar el estado con los datos del RWA creado
      setRwaData({
        name: rwaName,
        shipName: selectedShip,
        tokenId: "5",
        hash: fileHash,
        description: rwaDescription,
        fileUrl: `ipfs://${fileHash}`,
        txId: receipt.hash.slice(0, 6) + "..." + receipt.hash.slice(-4),
      });
      
      // Mostrar modal de éxito
      setIsRWAModalOpen(true);
      
      // Limpiar el formulario
      setSelectedFile(null);
      setRwaName('');
      setRwaDescription('');
      setSelectedShip('');
      
    } catch (error) {
      console.error('Error creating RWA:', error);
      alert('Error creating RWA. Please check console for details.');
    }
  }

  const handleCreateAnotherRWA = () => {
    setIsRWAModalOpen(false)
    // Reset form fields if needed
  }

  const handleTransfer = (destination: string) => {
    console.log("Transferring RWA to:", destination)
    // In a real app, you would call your backend to perform the transfer
    // The success notification is now handled in the RWATransferModal component
  }

  const handleShare = () => {
    console.log("Sharing RWA info")
    // Implement sharing functionality
    setIsInfoModalOpen(false)
  }

  const openTransferFromInfo = () => {
    setIsInfoModalOpen(false)
    // Set the selected RWA for transfer
    setSelectedRWA({
      name: selectedRWAInfo.name,
      tokenId: selectedRWAInfo.tokenId,
      hash: selectedRWAInfo.hash,
      description: selectedRWAInfo.description,
      fileUrl: selectedRWAInfo.fileUrl,
    })
    setIsTransferModalOpen(true)
  }

  // Update the ships tab content to show either the empty state or the ships table
  const renderShipsContent = () => {
    if (!hasShips) {
      return (
        <div className="w-full space-y-4">
          <hr />
          <hr />

          <h2 className="text-3xl font-bold text-center text-gray-900">ohhh... it seems you don't own any ships!</h2>

          <div className="flex justify-center py-6">
            <div className="relative w-32 h-32">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-700 transform rotate-45 rounded-sm"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-blue-600 transform -rotate-[10deg] rounded-tr-lg rounded-br-lg"></div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={openBuildModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70 hover:scale-105"
            >
              Build Ship
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full space-y-8">
        <div className="bg-blue-300/50 backdrop-blur-sm rounded-lg overflow-hidden">
        { shipsTable.map((ship, index) => (
          <table className="w-full">
            <thead key={index}>
              <tr className="border-b border-blue-400/50">
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">{ship.name}</th>
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">{ship.status}</th>
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">{ship.address}</th>
                <th className="py-4 px-2"></th>
                <th className="py-4 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship, index) => (
                <tr key={index} className="hover:bg-blue-400/20 transition-colors">
                  <td className="py-4 px-6 text-lg font-medium">{ship.id}</td>
                  <td className="py-4 px-6 text-lg font-medium text-red-500">{ship.hash}</td>
                  <td className="py-4 px-6 text-lg font-medium">{ship.name}</td>
                  <td className="py-4 px-2">
                    <button
                      className="p-2 rounded-full bg-blue-400/30 hover:bg-blue-400/50 transition-colors"
                      onClick={() => {
                        setSelectedRWAInfo({
                          shipAddress: "0x",
                          name: "House1",
                          tokenId: ship.id,
                          hash: ship.hash,
                          description: "...",
                          fileUrl: "IPFS://",
                          pastOwners: [{ date: "dd/mm/yy", address: "0x..." }],
                        })
                        setIsInfoModalOpen(true)
                      }}
                    >
                      <Info size={20} />
                    </button>
                  </td>
                  <td className="py-4 px-2">
                    <button
                      className="p-2 rounded-full bg-blue-400/30 hover:bg-blue-400/50 transition-colors"
                      onClick={() => {
                        setSelectedRWA({
                          name: "House1",
                          tokenId: ship.id,
                          hash: ship.hash,
                          description: "...",
                          fileUrl: "IPFS://",
                        })
                        setIsTransferModalOpen(true)
                      }}
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Do you want another Ship?</h2>

          <div className="flex justify-center">
            <button
              onClick={openBuildModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70 hover:scale-105"
            >
              Build Ship
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getShipTokens = async (shipAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const shipContract = new ethers.Contract(shipAddress, BOAT_ABI, provider);
      
      // Asumiendo que el contrato tiene una función para obtener los tokens
      const tokenCount = await shipContract.balanceOf(account);
      const tokens = [];
      
      for(let i = 0; i < tokenCount; i++) {
        const tokenId = await shipContract.tokenOfOwnerByIndex(account, i);
        tokens.push(tokenId.toString());
      }
      
      return tokens;
    } catch (error) {
      console.error("Error getting ship tokens:", error);
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <div className="flex items-center">
          <div className="text-blue-500 mr-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-45">
              <path d="M21,17H3V21H21V17M6.5,13L11,6.5L15.5,13H6.5Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-500">Relationships.</h1>
        </div>
        <button
          onClick={handleConnectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          {account ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
        {/* Navigation Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("inscribe")}
            className={`font-medium py-3 px-8 rounded-lg transition-colors ${
              activeTab === "inscribe" ? "bg-blue-900 text-white" : "bg-blue-300/70 hover:bg-blue-400/70 text-blue-900"
            }`}
          >
            Inscribe
          </button>
          <button
            onClick={() => setActiveTab("ships")}
            className={`font-medium py-3 px-8 rounded-lg transition-colors ${
              activeTab === "ships" ? "bg-blue-900 text-white" : "bg-blue-300/70 hover:bg-blue-400/70 text-blue-900"
            }`}
          >
            Ships
          </button>
        </div>

        {activeTab === "inscribe" ? (
          <div className="w-full space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Inscribe a RWA</h2>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">Ship</label>
                  <div className="relative">
                    <select className="w-full bg-blue-200/70 text-gray-800 rounded-lg py-3 px-4 appearance-none"
                      value={selectedShip}
                      onChange={(e) => {
                        setSelectedShip(e.target.value);
                      }}
                    >
                      <option>Select a ship</option>
                      {shipsTable.map((ship, index) => (
                        <option key={index} value={ship.address}>{ship.name}/{ship.address.slice(0, 6)}...</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">RWA Name</label>
                  <input
                    type="text"
                    placeholder="Name..."
                    className="w-full bg-blue-200/70 text-gray-800 rounded-lg py-3 px-4"
                    value={rwaName}
                    onChange={(e) => {
                      setRwaName(e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">Description</label>
                  <textarea
                    placeholder="..."
                    className="w-full bg-gray-100/80 text-gray-800 rounded-lg py-3 px-4 min-h-[120px] resize-none"
                    value={rwaDescription}
                    onChange={(e) => {
                      setRwaDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="flex items-start justify-center">
              <button className="w-36 h-36 bg-blue-100/80 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                <label className="w-36 h-36 bg-blue-100/80 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        console.log("PDF selected:", file.name);
                      }
                    }}
                  />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 4V20M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">Select PDF</span>
                  </label>
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleCreateRWA}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70 hover:scale-105"
              >
                Create RWA
              </button>
            </div>
          </div>
        ) : (
          renderShipsContent()
        )}
      </main>

      {/* Modals */}
      <BuildShipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBuild={handleBuild} account={account}/>

      <RWASuccessModal
        isOpen={isRWAModalOpen}
        onClose={() => setIsRWAModalOpen(false)}
        onCreateAnother={handleCreateAnotherRWA}
        rwaData={rwaData}
      />

      <RWATransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransfer}
        rwaData={selectedRWA}
      />

      <RWAInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onShare={handleShare}
        onTransfer={openTransferFromInfo}
        rwaData={selectedRWAInfo}
      />
    </div>
  )
}

