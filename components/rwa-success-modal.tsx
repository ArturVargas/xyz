"use client"
import { X } from "lucide-react"

interface RWASuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAnother: () => void
  rwaData: {
    name: string
    shipName: string
    tokenId: string
    hash: string
    description: string
    fileUrl: string
    txId: string
  }
}

export default function RWASuccessModal({ isOpen, onClose, onCreateAnother, rwaData }: RWASuccessModalProps) {
  if (!isOpen) return null
  console.log("rwaData", rwaData);
  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-700 z-10">
          <X size={24} />
        </button>

        <div className="bg-blue-900 text-white text-center py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Success!</h2>
        </div>

        <div className="px-8 py-6">
          <h3 className="text-2xl font-bold text-center mb-6">RWA Created in "{rwaData.shipName.slice(0, 6)}..."</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xl font-medium">RWA Name:</span>
              <span className="text-xl">{rwaData.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-medium">Token ID:</span>
              <span className="text-xl">{rwaData.tokenId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-medium">Hash:</span>
              <span className="text-xl">{rwaData.hash}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-medium">Description:</span>
              <span className="text-xl">{rwaData.description}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-medium">File URL:</span>
              <a href={rwaData.fileUrl} target="_blank" rel="noopener noreferrer">
                <span className="text-xl">{rwaData.fileUrl.slice(0, 10)}...</span>
              </a>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-medium">Tx Id:</span>
              <a href={`https://testnet.u2uscan.xyz/tx/${rwaData.txId}`} target="_blank" rel="noopener noreferrer">
                <span className="text-xl">{rwaData.txId.slice(0, 10)}...</span>
              </a>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onCreateAnother}
              className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Create another RWA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

