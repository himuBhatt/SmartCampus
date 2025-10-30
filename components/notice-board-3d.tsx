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

    // use passed-in notices (positions are used for hit testing)
    const boardNotices = notices

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

      // Draw notices with slight parallax
      notices.forEach((n, i) => {

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

        // Title text
        ctx.fillStyle = "#1f2937"
        ctx.font = `bold ${Math.max(12, 14 * Math.min(scaleX, scaleY))}px sans-serif`
        ctx.fillText(n.title, px + 12 * scaleX, py + 24 * scaleY)
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

      for (let i = 0; i < boardNotices.length; i++) {
        const n = boardNotices[i]
        const basePx = n.x
        const basePy = n.y
        const baseWn = n.w
        const baseHn = n.h

        const px = basePx * scaleX + Math.sin((t + i * 30) * 0.01) * 2 * scaleX + (mouseX - w / 2) * 0.02 * (i + 1)
        const py = basePy * scaleY + Math.cos((t + i * 20) * 0.01) * 2 * scaleY + (mouseY - h / 2) * 0.02 * (i + 1)
        const drawW = baseWn * scaleX
        const drawH = baseHn * scaleY

        if (cx >= px && cx <= px + drawW && cy >= py && cy <= py + drawH) {
          onNoticeClick?.(n.id)
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
    <div ref={containerRef} className="w-full h-64 sm:h-80 md:h-[520px] bg-transparent rounded-lg overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />
    </div>
  )
}
