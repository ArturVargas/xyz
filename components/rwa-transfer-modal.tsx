"use client"

import { useState } from "react"
import { X } from "lucide-react"
import RWATransferSuccessNotification from "./rwa-transfer-success-notification"

interface RWATransferModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (destination: string) => void
  rwaData: {
    name: string
    tokenId: string
    hash: string
    description: string
    fileUrl: string
  }
}

export default function RWATransferModal({ isOpen, onClose, onTransfer, rwaData }: RWATransferModalProps) {
  const [destination, setDestination] = useState("0x...")
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [txId, setTxId] = useState("0x...")

  const handleTransfer = () => {
    // In a real app, you would call your backend to perform the transfer
    // and get the transaction ID from the response
    const mockTxId = "0x" + Math.random().toString(16).substring(2, 10)
    setTxId(mockTxId)
    setIsSuccessOpen(true)

    // Call the parent component's onTransfer callback
    onTransfer(destination)
  }

  const handleSuccessClose = () => {
    setIsSuccessOpen(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-700 z-10">
            <X size={24} />
          </button>

          <div className="flex justify-center pt-8 pb-4">
            <div className="bg-red-500 text-white font-bold py-3 px-10 rounded-full text-xl shadow-md">
              RWA Transfer
            </div>
          </div>

          <div className="px-8 py-6">
            <h3 className="text-xl font-bold text-center mb-6">
              Careful: You're going to transfer out this token from your Ship
            </h3>

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
                <span className="text-xl">{rwaData.fileUrl}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center bg-gray-200 rounded-lg px-4 py-2">
                <span className="text-xl font-medium">Destination:</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-xl outline-none text-right w-1/2"
                />
              </div>
            </div>

            <div className="text-center mt-6 mb-4">
              <p className="text-lg font-bold">This is permanent and can't be undone!!</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleTransfer}
                className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors"
              >
                Send RWA
              </button>
            </div>
          </div>
        </div>
      </div>

      <RWATransferSuccessNotification isOpen={isSuccessOpen} onClose={handleSuccessClose} txId={txId} />
    </>
  )
}

