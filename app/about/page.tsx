"use client"

import Background3D from "@/components/3d-background"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"

export default function AboutPage() {
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const statsRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Scope GSAP animations to this component and auto-clean inline styles on unmount
    const ctx = gsap.context(() => {
      const contentBlocks = contentRef.current
        ? Array.from(contentRef.current.querySelectorAll<HTMLDivElement>(".content-block"))
        : []

      const tl = gsap.timeline()
      tl.from(titleRef.current, {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power3.out",
        immediateRender: false,
      }).from(
        contentBlocks,
        {
          duration: 0.8,
          opacity: 0,
          y: 20,
          stagger: 0.2,
          ease: "power3.out",
          immediateRender: false,
        },
        "-=0.5",
      )
    }, containerRef)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the observer-triggered tween into the GSAP context so it is reverted on unmount
            ctx.add(() =>
              gsap.from(entry.target.querySelectorAll(".stat-card"), {
                duration: 0.8,
                opacity: 0,
                scale: 0.9,
                stagger: 0.1,
                ease: "back.out",
                immediateRender: false,
              }),
            )
          }
        })
      },
      { threshold: 0.3 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <main ref={containerRef} className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 text-black relative">
        <Background3D className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-black">
            About GPS Srinagar
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            Pioneering technical education in the Garhwal region for over five decades
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="content-block">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-neutral leading-relaxed max-w-3xl">
              To provide quality technical education that empowers students with practical skills, theoretical
              knowledge, and professional ethics. We are committed to fostering innovation, creativity, and excellence
              in every aspect of education.
            </p>
          </div>

          <div className="content-block">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-lg text-neutral leading-relaxed max-w-3xl">
              To be a leading polytechnic institution recognized for producing skilled professionals who contribute
              meaningfully to society and industry. We envision a campus where learning transcends boundaries and
              students develop into responsible global citizens.
            </p>
          </div>

          <div className="content-block">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our History</h2>
            <p className="text-lg text-neutral leading-relaxed max-w-3xl">
              Established in 1968, GPS Srinagar has been a beacon of technical excellence in the Uttarakhand region.
              Over the decades, we have evolved from a small institution to a comprehensive polytechnic offering diverse
              programs in engineering, management, and applied sciences. Our alumni have made significant contributions
              across various industries and sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            By The <span className="text-color-primary">Numbers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "57", label: "Years of Excellence" },
              { number: "5000+", label: "Successful Alumni" },
              { number: "50+", label: "Faculty Members" },
              { number: "95%", label: "Placement Rate" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card p-8 bg-white rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow"
              >
                <div className="text-5xl font-bold text-color-primary mb-3">{stat.number}</div>
                <div className="text-neutral font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Our <span className="text-color-primary">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "Commitment to highest standards in education and professional conduct",
              },
              {
                title: "Innovation",
                description: "Encouraging creative thinking and adoption of modern technologies",
              },
              {
                title: "Integrity",
                description: "Upholding ethical principles and transparency in all endeavors",
              },
              {
                title: "Inclusivity",
                description: "Creating an environment where every student can thrive and succeed",
              },
              {
                title: "Collaboration",
                description: "Fostering teamwork and partnerships with industry and academia",
              },
              {
                title: "Sustainability",
                description: "Promoting environmental responsibility and social consciousness",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-bold text-color-primary mb-3">{value.title}</h3>
                <p className="text-neutral leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our programs and discover how GPS Srinagar can shape your future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/campus"
              className="px-8 py-3 bg-white text-color-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Visit Campus
            </Link>
            <Link
              href="/courses"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-color-primary transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
