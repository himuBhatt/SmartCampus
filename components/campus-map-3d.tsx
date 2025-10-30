"use client"

import { useEffect, useRef } from "react"

export default function CampusMap3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    // Use devicePixelRatio-aware sizing for crisp canvas
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(300, Math.floor(canvas.offsetWidth * dpr))
      canvas.height = Math.max(150, Math.floor(canvas.offsetHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const buildings = [
      { name: "Principal Quarter", x: 100, y: 150, width: 80, height: 60, color: "#0d9488" },
      { name: "Block I", x: 220, y: 100, width: 100, height: 80, color: "#14b8a6" },
      { name: "Block II", x: 360, y: 120, width: 100, height: 80, color: "#0d9488" },
      { name: "Block III", x: 520, y: 100, width: 100, height: 80, color: "#14b8a6" },
      { name: "NIT Boys Hostel", x: 320, y: 250, width: 90, height: 70, color: "#ea580c" },
      { name: "Girls Hostel", x: 120, y: 300, width: 90, height: 70, color: "#f97316" },
      { name: "Library", x: 460, y: 280, width: 80, height: 70, color: "#0d9488" },
      { name: "Auditorium", x: 220, y: 350, width: 120, height: 80, color: "#14b8a6" },
      { name: "Sports Complex", x: 520, y: 350, width: 100, height: 100, color: "#ea580c" },
      { name: "Cafeteria", x: 360, y: 400, width: 80, height: 60, color: "#f97316" },
    ]

    // Interaction state (mouse parallax + slight float)
    let mouseX = 0
    let mouseY = 0
    let t = 0
    let scale = 1

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      // Clear background
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, w, h)

      // Grid (subtle)
      ctx.strokeStyle = "rgba(13,148,136,0.06)"
      ctx.lineWidth = 1
      for (let i = 0; i < w; i += 60) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.stroke()
      }

      // Centered scale transform so zoom works uniformly
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.scale(scale, scale)
      ctx.translate(-w / 2, -h / 2)

      buildings.forEach((building, i) => {
        // small float + mouse parallax, similar to notice-board behavior
        const px = building.x + Math.sin((t + i * 20) * 0.01) * 2 + (mouseX - w / 2) * 0.02 * (i + 1)
        const py = building.y + Math.cos((t + i * 15) * 0.01) * 2 + (mouseY - h / 2) * 0.02 * (i + 1)

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.12)"
        ctx.fillRect(px + 6, py + 6, building.width, building.height)

        // Building
        ctx.fillStyle = building.color
        ctx.fillRect(px, py, building.width, building.height)

        // Border
        ctx.strokeStyle = "rgba(0,0,0,0.2)"
        ctx.lineWidth = 2
        ctx.strokeRect(px, py, building.width, building.height)

        // Label
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(building.name, px + building.width / 2, py + building.height / 2)
      })

      ctx.restore()

      t += 1
      requestAnimationFrame(draw)
    }

    draw()

    // Zoom on wheel (kept but gentle)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      scale += e.deltaY > 0 ? -0.03 : 0.03
      scale = Math.max(0.6, Math.min(1.6, scale))
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    window.addEventListener("resize", resizeCanvas)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 pointer-events-none">
        <p>Scroll to zoom • Rotate animation active</p>
      </div>
    </div>
  )
}
