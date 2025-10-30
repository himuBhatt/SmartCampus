"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-provider"

interface AddNoticeFormProps {
  onClose: () => void
  onSubmit: () => void
}

function AddNoticeForm({ onClose, onSubmit }: AddNoticeFormProps) {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("#fffaf0") // Default paper color
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Generate a random position within reasonable bounds
      const x = Math.random() * 300 + 50 // Between 50 and 350
      const y = Math.random() * 150 + 50 // Between 50 and 200
      
      await addDoc(collection(db, "notices"), {
        title,
        description,
        color,
        x,
        y,
        w: 180, // Fixed width for notices
        h: 120, // Fixed height for notices
        createdAt: new Date(),
      })
      
      setTitle("")
      onSubmit()
      onClose()
    } catch (error) {
      console.error("Error adding notice:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Notice</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Paper Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              placeholder="Short description to show on the notice"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface Notice {
  id: string
  title: string
  color?: string
  x: number
  y: number
  w: number
  h: number
}

interface NoticeControlsProps {
  onAddNotice: () => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isAdmin: boolean
  onAdminLogin: (email: string, password: string) => boolean
  onAdminLogout: () => void
  loginError?: string | null
}

export default function NoticeControls({ onAddNotice, isEditing, setIsEditing, isAdmin, onAdminLogin, onAdminLogout, loginError }: NoticeControlsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleLogin = (email: string, password: string) => {
    const ok = onAdminLogin(email, password)
    if (!ok) setLocalError("Invalid credentials")
    else setLocalError(null)
    if (ok) setShowLogin(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 flex gap-3">
        {!isAdmin ? (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 shadow-lg"
            >
              Admin
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
            >
              <Plus size={20} />
              Add Notice
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 ${isEditing ? "bg-red-600" : "bg-gray-600"} text-white rounded-lg hover:bg-opacity-90 shadow-lg`}
            >
              {isEditing ? <Trash2 size={20} /> : <Edit2 size={20} />}
              {isEditing ? "Finish Removing" : "Remove Notices"}
            </button>
            <button
              onClick={onAdminLogout}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-800 shadow-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <AdminLoginForm onCancel={() => setShowLogin(false)} onLogin={handleLogin} error={localError || loginError} />
          </div>
        </div>
      )}

      {showAddForm && (
        <AddNoticeForm
          onClose={() => setShowAddForm(false)}
          onSubmit={onAddNotice}
        />
      )}
    </>
  )
}

function AdminLoginForm({ onCancel, onLogin, error }: { onCancel: () => void; onLogin: (email: string, password: string) => void; error?: string | null }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onLogin(email.trim(), password)
      }}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
      </div>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Login</button>
      </div>
    </form>
  )
}