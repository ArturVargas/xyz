"use client"

import { X } from "lucide-react"

interface RWATransferSuccessNotificationProps {
  isOpen: boolean
  onClose: () => void
  txId: string
}

export default function RWATransferSuccessNotification({ isOpen, onClose, txId }: RWATransferSuccessNotificationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-700 z-10">
          <X size={20} />
        </button>

        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">RWA sent successfully!</h3>

          <div className="flex justify-between items-center">
            <span className="text-xl font-medium">Tx Id:</span>
            <span className="text-xl">{txId}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

