"use client"

import Background3D from "@/components/3d-background"
import HeroSection from "@/components/hero-section"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"

export default function Home() {
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target.querySelectorAll(".stat-item"), {
              duration: 1,
              opacity: 0,
              y: 30,
              stagger: 0.2,
              ease: "power3.out",
            })
          }
        })
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Background3D />
      <HeroSection />

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Our <span className="text-color-primary">Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "1968", label: "Established" },
              { number: "50+", label: "Years of Excellence" },
              { number: "5000+", label: "Alumni" },
              { number: "95%", label: "Placement Rate" },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-color-primary mb-2">{stat.number}</div>
                <div className="text-neutral">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose <span className="text-color-primary">GPS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "World-Class Faculty",
                description: "Experienced educators dedicated to student success",
                icon: "👨‍🏫",
              },
              {
                title: "Modern Infrastructure",
                description: "State-of-the-art labs and facilities",
                icon: "🏗️",
              },
              {
                title: "Industry Partnerships",
                description: "Strong connections with leading companies",
                icon: "🤝",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-border"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-neutral">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful graduates from GPS Srinagar</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-color-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Enroll Now
          </Link>
        </div>
      </section>
    </>
  )
}
