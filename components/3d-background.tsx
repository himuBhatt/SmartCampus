"use client"

import { useEffect, useRef } from "react"

type Background3DProps = {
  className?: string
}

export default function Background3D({ className = "" }: Background3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  // Narrow canvas to a non-null HTMLCanvasElement for use inside
  // nested classes/closures so TypeScript knows it's not null.
  const canvasEl = canvas as HTMLCanvasElement

  const ctx = canvasEl.getContext("2d")
  if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
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
  this.x = Math.random() * canvasEl.width - canvasEl.width / 2
  this.y = Math.random() * canvasEl.height - canvasEl.height / 2
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
          this.x = Math.random() * canvasEl.width - canvasEl.width / 2
          this.y = Math.random() * canvasEl.height - canvasEl.height / 2
        }

        if (Math.abs(this.x) > canvasEl.width) {
          this.x = -this.x
        }
        if (Math.abs(this.y) > canvasEl.height) {
          this.y = -this.y
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = 500 / (500 + this.z)
  const x = this.x * scale + canvasEl.width / 2
  const y = this.y * scale + canvasEl.height / 2
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
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const scale = 500 / (500 + (particles[i].z + particles[j].z) / 2)
            const x1 = particles[i].x * scale + canvasEl.width / 2
            const y1 = particles[i].y * scale + canvasEl.height / 2
            const x2 = particles[j].x * scale + canvasEl.width / 2
            const y2 = particles[j].y * scale + canvasEl.height / 2

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

  return <canvas ref={canvasRef} className={`${className} fixed top-0 left-0 w-full h-full -z-10`} />
}
