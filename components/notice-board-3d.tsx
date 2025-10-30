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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Local admin credentials (client-side check per user request)
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
  }

  // If the app uses Firebase Auth elsewhere, allow an already-signed-in
  // admin to be recognized automatically by checking the auth currentUser.
  useEffect(() => {
    try {
      const auth = getAuth()
      const u = auth.currentUser
      if (u?.email === ADMIN_EMAIL) {
        setIsAdmin(true)
      }
    } catch (e) {
      // ignore if firebase not initialized or unavailable
    }
  }, [])

  // Subscribe to notices collection
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

  // Keep a ref to the latest notices so canvas drawing and hit-testing
  // (which run in a long-lived animation/event loop) can access updates
  // without re-creating the whole canvas effect.
  const noticesRef = useRef<Notice[]>([])

  useEffect(() => {
    noticesRef.current = notices
  }, [notices])

  const handleNoticeClick = async (id: string) => {
    if (isEditing && isAdmin) {
      try {
        await deleteDoc(doc(db, "notices", id))
      } catch (error) {
        console.error("Error removing notice:", error)
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Base design size for layouting notices. We'll scale positions/sizes
    // proportionally so the board looks consistent across screen sizes.
    const BASE_W = 640
    const BASE_H = 360

    const resize = () => {
      // Match canvas pixel size to displayed size (HiDPI aware)
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    // Use ResizeObserver so changes to the container size (e.g. responsive layout)
    // trigger a redraw and resize the internal canvas accordingly.
    const ro = new ResizeObserver(() => resize())
    ro.observe(container)

    // do initial resize
    resize()

  // use a ref to notices for hit-testing/drawing so the animation loop
  // always sees the latest data without re-registering event listeners

    let mouseX = 0
    let mouseY = 0
    let t = 0

    const drawBoard = () => {
      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio

      const scaleX = w / BASE_W
      const scaleY = h / BASE_H

      // Background board
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#6b4f3b"
      ctx.fillRect(20, 20, w - 40, h - 40)

      // Board texture
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      for (let i = 0; i < w; i += 12) {
        ctx.fillRect(i, 20, 1, h - 40)
      }

      // helper: wrap text into lines for canvas and optionally clamp to maxLines
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

        // If we have a maxLines and the text still overflows, truncate the last line with an ellipsis
        if (maxLines && lines.length > 0 && lines.length >= maxLines) {
          let last = lines[Math.min(lines.length - 1, maxLines - 1)]
          // ensure last line fits, else trim
          while (ctx.measureText(last + "…").width > maxWidth && last.length > 0) {
            last = last.slice(0, -1)
          }
          lines[maxLines - 1] = last + (last.length ? "…" : "")
          return lines.slice(0, maxLines)
        }

        return lines
      }

      // Draw notices with slight parallax
        const currentNotices = noticesRef.current
        currentNotices.forEach((n, i) => {

    // calculate scaled positions/sizes
    const basePx = n.x
    const basePy = n.y
    const baseWn = n.w
    const baseHn = n.h

    const px = basePx * scaleX + Math.sin((t + i * 30) * 0.01) * 2 * scaleX + (mouseX - w / 2) * 0.02 * (i + 1)
    const py = basePy * scaleY + Math.cos((t + i * 20) * 0.01) * 2 * scaleY + (mouseY - h / 2) * 0.02 * (i + 1)
    const drawW = baseWn * scaleX
    const drawH = baseHn * scaleY

    // Paper shadow
    ctx.fillStyle = "rgba(0,0,0,0.12)"
    ctx.fillRect(px + 6 * scaleX, py + 6 * scaleY, drawW, drawH)

    // Paper
    const paperColor = n.color ?? "#fffaf0"
    ctx.fillStyle = paperColor
    ctx.fillRect(px, py, drawW, drawH)

        // Pin
        ctx.beginPath()
        ctx.fillStyle = "#ff5c5c"
  ctx.arc(px + drawW / 2, py, 6 * Math.min(scaleX, scaleY), 0, Math.PI * 2)
        ctx.fill()

        // Title text — truncate to fit width and add subtle shadow for contrast
        ctx.save()
        ctx.fillStyle = "#0f172a" // darker for best contrast
        ctx.shadowColor = "rgba(0,0,0,0.18)"
        ctx.shadowBlur = 2
        const titleFontSize = Math.max(12, 14 * Math.min(scaleX, scaleY))
        ctx.font = `bold ${titleFontSize}px sans-serif`
        const titleMaxWidth = drawW - 24 * scaleX
        let titleText = String(n.title ?? "")
        // truncate title if too long
        if (ctx.measureText(titleText).width > titleMaxWidth) {
          while (titleText.length && ctx.measureText(titleText + "…").width > titleMaxWidth) {
            titleText = titleText.slice(0, -1)
          }
          titleText = titleText + (titleText.length ? "…" : "")
        }
  // measure title to compute a safe bottom for the title (avoid overlap)
  const titleMetrics = ctx.measureText(titleText)
  // ascent/descent may be undefined in some browsers; fall back to heuristics
  const titleAscent = titleMetrics.actualBoundingBoxAscent ?? titleFontSize * 0.75
  const titleDescent = titleMetrics.actualBoundingBoxDescent ?? titleFontSize * 0.35
  const titleHeight = titleAscent + titleDescent
  const titleBaseline = py + 26 * scaleY
  ctx.fillText(titleText, px + 12 * scaleX, titleBaseline)
  // compute the bottom pixel of the drawn title relative to py
  const titleBottom = titleBaseline + titleDescent
        ctx.restore()

        // Description (wrap inside the paper)
        if (n.description) {
          // Determine the vertical space available for description under the title
          const descFontSize = Math.max(10, 12 * Math.min(scaleX, scaleY))
          const descFont = `${descFontSize}px sans-serif`
          const maxTextWidth = drawW - 24 * scaleX
          // Reserve space: use measured title bottom plus padding so description starts below the title's drawn glyphs
          // titleBottom is in canvas coordinates; subtract py to get offset inside the paper
          const reservedTop = Math.max(28 * scaleY, (titleBottom - py) + 8 * scaleY, titleFontSize * 1.2)
          const reservedBottom = 10 * scaleY
          const availableH = drawH - reservedTop - reservedBottom
          const lineHeight = descFontSize * 1.2
          const maxLines = Math.max(1, Math.floor(availableH / lineHeight))

          const lines = wrapText(n.description, maxTextWidth, descFont, maxLines)
          ctx.save()
          ctx.fillStyle = "#1f2937"
          ctx.font = descFont
          ctx.shadowColor = "rgba(0,0,0,0.08)"
          ctx.shadowBlur = 1
          const startY = py + reservedTop
          for (let li = 0; li < lines.length; li++) {
            ctx.fillText(lines[li], px + 12 * scaleX, startY + li * lineHeight)
          }
          ctx.restore()
        }
      })

      // Frame
      ctx.strokeStyle = "rgba(0,0,0,0.15)"
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, w - 40, h - 40)

      t += 1
      requestAnimationFrame(drawBoard)
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (e instanceof TouchEvent) {
        const t0 = e.touches[0]
        mouseX = t0.clientX - rect.left
        mouseY = t0.clientY - rect.top
      } else {
        mouseX = (e as MouseEvent).clientX - rect.left
        mouseY = (e as MouseEvent).clientY - rect.top
      }
    }

    const onClick = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      let cx = 0
      let cy = 0
      if (e instanceof TouchEvent) {
        const t0 = e.touches[0] || e.changedTouches[0]
        cx = t0.clientX - rect.left
        cy = t0.clientY - rect.top
      } else {
        cx = (e as MouseEvent).clientX - rect.left
        cy = (e as MouseEvent).clientY - rect.top
      }

      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio

      const scaleX = w / BASE_W
      const scaleY = h / BASE_H

      const currentNotices2 = noticesRef.current
      for (let i = 0; i < currentNotices2.length; i++) {
        const n = currentNotices2[i]
        const basePx = n.x
        const basePy = n.y
        const baseWn = n.w
        const baseHn = n.h

        const px = basePx * scaleX + Math.sin((t + i * 30) * 0.01) * 2 * scaleX + (mouseX - w / 2) * 0.02 * (i + 1)
        const py = basePy * scaleY + Math.cos((t + i * 20) * 0.01) * 2 * scaleY + (mouseY - h / 2) * 0.02 * (i + 1)
        const drawW = baseWn * scaleX
        const drawH = baseHn * scaleY

        if (cx >= px && cx <= px + drawW && cy >= py && cy <= py + drawH) {
          handleNoticeClick(n.id)
          break
        }
      }
    }

    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("touchmove", onMove)
    canvas.addEventListener("click", onClick)
    canvas.addEventListener("touchend", onClick)

    drawBoard()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("touchmove", onMove)
      canvas.removeEventListener("click", onClick)
      canvas.removeEventListener("touchend", onClick)
      ro.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="w-full h-64 sm:h-80 md:h-[520px] bg-transparent rounded-lg overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full block ${isEditing ? "cursor-not-allowed" : "cursor-pointer"}`} 
        />
      </div>
      <NoticeControls
        onAddNotice={() => {}} // Handled by Firestore subscription
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isAdmin={isAdmin}
        onAdminLogin={onAdminLogin}
        onAdminLogout={onAdminLogout}
        loginError={loginError}
      />
    </>
  )
}
