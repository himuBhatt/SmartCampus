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

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()

    const buildings = [
      { name: "Principal Quarter", x: 100, y: 150, width: 80, height: 60, color: "#0d9488" },
      { name: "Block I", x: 200, y: 100, width: 100, height: 80, color: "#14b8a6" },
      { name: "Block II", x: 350, y: 120, width: 100, height: 80, color: "#0d9488" },
      { name: "Block III", x: 500, y: 100, width: 100, height: 80, color: "#14b8a6" },
      { name: "NIT Boys Hostel", x: 300, y: 250, width: 90, height: 70, color: "#ea580c" },
      { name: "Girls Hostel", x: 100, y: 300, width: 90, height: 70, color: "#f97316" },
      { name: "Library", x: 450, y: 280, width: 80, height: 70, color: "#0d9488" },
      { name: "Auditorium", x: 200, y: 350, width: 120, height: 80, color: "#14b8a6" },
      { name: "Sports Complex", x: 500, y: 350, width: 100, height: 100, color: "#ea580c" },
      { name: "Cafeteria", x: 350, y: 400, width: 80, height: 60, color: "#f97316" },
    ]

    let rotation = 0
    let scale = 1

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(13, 148, 136, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw buildings with 3D effect
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation * 0.0005)
      ctx.scale(scale, scale)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      buildings.forEach((building, index) => {
        const depth = Math.sin(rotation * 0.001 + index) * 10
        const shadowOffset = 5 + depth

        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fillRect(building.x + shadowOffset, building.y + shadowOffset, building.width, building.height)

        // Building
        ctx.fillStyle = building.color
        ctx.fillRect(building.x, building.y, building.width, building.height)

        // Border
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 2
        ctx.strokeRect(building.x, building.y, building.width, building.height)

        // Label
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(building.name, building.x + building.width / 2, building.y + building.height / 2)
      })

      ctx.restore()

      rotation += 1
      requestAnimationFrame(animate)
    }

    animate()

    // Zoom animation on scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      scale += e.deltaY > 0 ? -0.05 : 0.05
      scale = Math.max(0.5, Math.min(2, scale))
    }

    canvas.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
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
