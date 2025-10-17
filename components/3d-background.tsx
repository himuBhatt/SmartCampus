"use client"

import { useEffect, useRef } from "react"

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: any[] = []
    const connections: any[] = []

    class Particle {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      size: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width - canvas.width / 2
        this.y = Math.random() * canvas.height - canvas.height / 2
        this.z = Math.random() * 1000 + 100
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.vz = (Math.random() - 0.5) * 3
        this.size = Math.random() * 4 + 2
        this.opacity = Math.random() * 0.5 + 0.3

        const colors = ["#0d9488", "#14b8a6", "#ea580c", "#f97316"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz

        if (this.z < 0) {
          this.z = 1000
          this.x = Math.random() * canvas.width - canvas.width / 2
          this.y = Math.random() * canvas.height - canvas.height / 2
        }

        if (Math.abs(this.x) > canvas.width) {
          this.x = -this.x
        }
        if (Math.abs(this.y) > canvas.height) {
          this.y = -this.y
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = 500 / (500 + this.z)
        const x = this.x * scale + canvas.width / 2
        const y = this.y * scale + canvas.height / 2
        const size = this.size * scale

        ctx.fillStyle = this.color.replace(")", `, ${this.opacity * scale})`)
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const scale = 500 / (500 + (particles[i].z + particles[j].z) / 2)
            const x1 = particles[i].x * scale + canvas.width / 2
            const y1 = particles[i].y * scale + canvas.height / 2
            const x2 = particles[j].x * scale + canvas.width / 2
            const y2 = particles[j].y * scale + canvas.height / 2

            ctx.strokeStyle = `rgba(13, 148, 136, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
      }

      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
