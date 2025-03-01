"use client"
import { X } from "lucide-react"

interface RWAInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: () => void
  onTransfer: () => void
  rwaData: {
    shipAddress: string
    name: string
    tokenId: string
    hash: string
    description: string
    fileUrl: string
    pastOwners: Array<{ date: string; address: string }>
  }
}

export default function RWAInfoModal({ isOpen, onClose, onShare, onTransfer, rwaData }: RWAInfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-700 z-10">
          <X size={24} />
        </button>

        <div className="flex justify-center pt-8 pb-4">
          <div className="bg-blue-600 text-white font-bold py-3 px-10 rounded-full text-xl shadow-md">
            RWA Information
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xl font-medium">Current Ship:</span>
              <span className="text-xl">{rwaData.shipAddress}</span>
            </div>

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
              <span className="text-xl font-medium">File URI:</span>
              <span className="text-xl">{rwaData.fileUrl}</span>
            </div>

            <div>
              <span className="text-xl font-medium">Past Owners:</span>
              {rwaData.pastOwners.map((owner, index) => (
                <div key={index} className="flex justify-between mt-1">
                  <span className="text-xl">{owner.date}</span>
                  <span className="text-xl">{owner.address}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onShare}
              className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Share Info
            </button>
            <button
              onClick={onTransfer}
              className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

