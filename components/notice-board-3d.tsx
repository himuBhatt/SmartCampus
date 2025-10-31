"use client"

import { useEffect, useRef, useState } from "react"
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getAuth } from "firebase/auth"
import NoticeControls from "./notice-controls"

interface Notice {
  id: string
  x: number
  y: number
  w: number
  h: number
  title: string
  description?: string
  color?: string
}

export default function NoticeBoard3D() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const noticesRef = useRef<Notice[]>([])
  const selectedIdsRef = useRef<Set<string>>(new Set())

  // Update refs on changes
  useEffect(() => {
    noticesRef.current = notices
  }, [notices])

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  // Local admin credentials
  const ADMIN_EMAIL = "minorp584@gmail.com"
  const ADMIN_PASSWORD = "123456789"

  const onAdminLogin = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setLoginError(null)
      return true
    }
    setLoginError("Invalid credentials")
    return false
  }

  const onAdminLogout = () => {
    setIsAdmin(false)
    setIsEditing(false)
    setSelectedIds(new Set())
  }

  // Check Firebase Auth
  useEffect(() => {
    try {
      const auth = getAuth()
      const u = auth.currentUser
      if (u?.email === ADMIN_EMAIL) setIsAdmin(true)
    } catch (e) {
      // ignore if firebase not initialized
    }
  }, [])

  // Subscribe to Firestore notices
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notices"), (snapshot) => {
      const noticesList = snapshot.docs.map(d => {
        const data = d.data() as any
        return {
          id: d.id,
          title: String(data.title ?? ""),
          description: String(data.description ?? ""),
          color: String(data.color ?? "#fffaf0"),
          x: Number(data.x ?? 60),
          y: Number(data.y ?? 60),
          w: Number(data.w ?? 180),
          h: Number(data.h ?? 120),
        } as Notice
      })
      setNotices(noticesList)
    })
    return () => unsubscribe()
  }, [])

  // Handle clicking notices → toggle selection
  const handleNoticeClick = (id: string) => {
    if (!isEditing || !isAdmin) return
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  // Delete selected notices
  const onRemoveSelected = async () => {
    const idsToRemove = Array.from(selectedIds)
    for (const id of idsToRemove) {
      try {
        await deleteDoc(doc(db, "notices", id))
      } catch (error) {
        console.error("Error removing notice:", error)
      }
    }
    setSelectedIds(new Set())
  }

  // Canvas drawing + interactivity
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const BASE_W = 640
    const BASE_H = 360

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(container)
    resize()

    let mouseX = 0
    let mouseY = 0
    let t = 0

    const wrapText = (text: string, maxWidth: number, font: string, maxLines?: number) => {
      ctx.font = font
      const words = String(text).split(" ")
      const lines: string[] = []
      let line = ""
      for (let i = 0; i < words.length; i++) {
        const testLine = line ? line + " " + words[i] : words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line) {
          lines.push(line)
          line = words[i]
          if (maxLines && lines.length >= maxLines) break
        } else {
          line = testLine
        }
      }
      if (line && (!maxLines || lines.length < maxLines)) lines.push(line)
      return lines
    }

    const drawBoard = () => {
      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio
      const scaleX = w / BASE_W
      const scaleY = h / BASE_H

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#6b4f3b"
      ctx.fillRect(20, 20, w - 40, h - 40)

      const currentNotices = noticesRef.current
      for (let i = 0; i < currentNotices.length; i++) {
        const n = currentNotices[i]
        const basePx = n.x
        const basePy = n.y
        const baseWn = n.w
        const baseHn = n.h

        const px = basePx * scaleX + Math.sin((t + i * 30) * 0.01) * 2 * scaleX
        const py = basePy * scaleY + Math.cos((t + i * 20) * 0.01) * 2 * scaleY
        const drawW = baseWn * scaleX
        const drawH = baseHn * scaleY

        ctx.fillStyle = "rgba(0,0,0,0.12)"
        ctx.fillRect(px + 6 * scaleX, py + 6 * scaleY, drawW, drawH)
        ctx.fillStyle = n.color ?? "#fffaf0"
        ctx.fillRect(px, py, drawW, drawH)

        // Pin
        ctx.beginPath()
        ctx.fillStyle = "#ff5c5c"
        ctx.arc(px + drawW / 2, py, 6 * Math.min(scaleX, scaleY), 0, Math.PI * 2)
        ctx.fill()

        // Title
        ctx.save()
        ctx.fillStyle = "#0f172a"
        const titleFontSize = Math.max(12, 14 * Math.min(scaleX, scaleY))
        ctx.font = `bold ${titleFontSize}px sans-serif`
        ctx.fillText(n.title, px + 12 * scaleX, py + 26 * scaleY)
        ctx.restore()

        // Description
        if (n.description) {
          const descFontSize = Math.max(10, 12 * Math.min(scaleX, scaleY))
          const descFont = `${descFontSize}px sans-serif`
          const lines = wrapText(n.description, drawW - 24 * scaleX, descFont, 4)
          ctx.save()
          ctx.fillStyle = "#1f2937"
          ctx.font = descFont
          for (let li = 0; li < lines.length; li++) {
            ctx.fillText(lines[li], px + 12 * scaleX, py + 50 * scaleY + li * (descFontSize * 1.2))
          }
          ctx.restore()
        }

        // ✅ Highlight selected
        if (selectedIdsRef.current.has(n.id)) {
          ctx.strokeStyle = "#ff0000"
          ctx.lineWidth = 3 * Math.min(scaleX, scaleY)
          ctx.strokeRect(px - 2 * scaleX, py - 2 * scaleY, drawW + 4 * scaleX, drawH + 4 * scaleY)
        }
      }

      ctx.strokeStyle = "rgba(0,0,0,0.15)"
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, w - 40, h - 40)

      t += 1
      requestAnimationFrame(drawBoard)
    }

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio
      const scaleX = w / BASE_W
      const scaleY = h / BASE_H

      const currentNotices2 = noticesRef.current
      for (let i = 0; i < currentNotices2.length; i++) {
        const n = currentNotices2[i]
        const px = n.x * scaleX
        const py = n.y * scaleY
        const drawW = n.w * scaleX
        const drawH = n.h * scaleY
        if (cx >= px && cx <= px + drawW && cy >= py && cy <= py + drawH) {
          handleNoticeClick(n.id)
          break
        }
      }
    }

    canvas.addEventListener("click", onClick)
    drawBoard()

    return () => {
      canvas.removeEventListener("click", onClick)
      ro.disconnect()
    }
  }, [isEditing, isAdmin])

  return (
    <>
      <div ref={containerRef} className="w-full h-64 sm:h-80 md:h-[520px] bg-transparent rounded-lg overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className={`w-full h-full block ${isEditing ? "cursor-pointer" : "cursor-default"}`}
        />
      </div>
      <NoticeControls
        onAddNotice={() => {}}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isAdmin={isAdmin}
        onAdminLogin={onAdminLogin}
        onAdminLogout={onAdminLogout}
        loginError={loginError}
        onRemoveSelected={onRemoveSelected}
      />
    </>
  )
}
