"use client"

import { useEffect, useRef } from "react"

type Notice = { id: number; x: number; y: number; w: number; h: number; title: string; color?: string }

export default function NoticeBoard3D({
  notices,
  onNoticeClick,
}: {
  notices: Notice[]
  onNoticeClick?: (id: number) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    resize()

    // use passed-in notices (positions are used for hit testing)
    const boardNotices = notices

    let mouseX = 0
    let mouseY = 0
    let t = 0

    const drawBoard = () => {
      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio

      // Background board
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#6b4f3b"
      ctx.fillRect(20, 20, w - 40, h - 40)

      // Board texture
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      for (let i = 0; i < w; i += 12) {
        ctx.fillRect(i, 20, 1, h - 40)
      }

      // Draw notices with slight parallax
      notices.forEach((n, i) => {
        const px = n.x + Math.sin((t + i * 30) * 0.01) * 2 + (mouseX - w / 2) * 0.02 * (i + 1)
        const py = n.y + Math.cos((t + i * 20) * 0.01) * 2 + (mouseY - h / 2) * 0.02 * (i + 1)

        // Paper shadow
        ctx.fillStyle = "rgba(0,0,0,0.12)"
        ctx.fillRect(px + 6, py + 6, n.w, n.h)

  // Paper
  const paperColor = n.color ?? "#fffaf0"
  ctx.fillStyle = paperColor
  ctx.fillRect(px, py, n.w, n.h)

        // Pin
        ctx.beginPath()
        ctx.fillStyle = "#ff5c5c"
        ctx.arc(px + n.w / 2, py, 6, 0, Math.PI * 2)
        ctx.fill()

        // Title text
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 14px sans-serif"
        ctx.fillText(n.title, px + 12, py + 24)
      })

      // Frame
      ctx.strokeStyle = "rgba(0,0,0,0.15)"
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, w - 40, h - 40)

      t += 1
      requestAnimationFrame(drawBoard)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio

      for (let i = 0; i < boardNotices.length; i++) {
        const n = boardNotices[i]
        const px = n.x + Math.sin((t + i * 30) * 0.01) * 2 + (mouseX - w / 2) * 0.02 * (i + 1)
        const py = n.y + Math.cos((t + i * 20) * 0.01) * 2 + (mouseY - h / 2) * 0.02 * (i + 1)

        if (cx >= px && cx <= px + n.w && cy >= py && cy <= py + n.h) {
          onNoticeClick?.(n.id)
          break
        }
      }
    }

    window.addEventListener("resize", resize)
  canvas.addEventListener("mousemove", onMove)
  canvas.addEventListener("click", onClick)

    drawBoard()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-96 bg-transparent rounded-lg overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />
    </div>
  )
}
