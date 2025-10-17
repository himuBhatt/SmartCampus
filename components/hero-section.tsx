"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"

export default function HeroSection() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power3.out",
    })
      .from(
        subtitleRef.current,
        {
          duration: 1,
          opacity: 0,
          y: 30,
          ease: "power3.out",
        },
        "-=0.5",
      )
      .from(
        buttonRef.current,
        {
          duration: 1,
          opacity: 0,
          scale: 0.8,
          ease: "back.out",
        },
        "-=0.5",
      )
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 ref={titleRef} className="text-5xl text-black md:text-7xl font-bold text-foreground mb-6 text-balance">
          Government Polytechnic <span className="text-color-primary">Srinagar</span>
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl text-neutral mb-8 text-balance">
          Excellence in Technical Education Since 1968
        </p>
        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="px-8 py-3 bg-color-primary text-black rounded-lg font-semibold hover:bg-color-primary-light transition-colors duration-200"
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border-2 border-color-primary text-color-primary rounded-lg font-semibold hover:bg-color-primary hover:text-white transition-colors duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
