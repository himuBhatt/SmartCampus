"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { MapPin, Users, BookOpen, Zap } from "lucide-react"

import Background3D from "@/components/3d-background"
import CampusMap3D from "@/components/campus-map-3d"

export default function CampusPage() {
  const titleRef = useRef(null)
  const facilitiesRef = useRef(null)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Scope animations to this component and auto-clean inline styles on unmount
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(titleRef.current, {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power3.out",
        immediateRender: false,
      })
    }, containerRef)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // create tween and register it with gsap.context so it will be reverted on unmount
            ctx.add(() =>
              gsap.from(entry.target.querySelectorAll(".facility-card"), {
                duration: 0.8,
                opacity: 0,
                y: 30,
                stagger: 0.15,
                ease: "power3.out",
                immediateRender: false,
              }),
            )
          }
        })
      },
      { threshold: 0.2 },
    )

    if (facilitiesRef.current) {
      observer.observe(facilitiesRef.current)
    }

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <main ref={containerRef} className="pt-20 opacity-100">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Our Campus
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            State-of-the-art facilities designed for modern technical education
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Interactive Campus <span className="text-color-primary">Map</span>
          </h2>
        </div>

        {/* Full-width map container to allow larger map visuals */}
        <div className="w-full px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full h-[480px] md:h-[640px]">
              <CampusMap3D />
            </div>
            <p className="text-center text-neutral mt-6">Explore our campus layout with interactive 3D visualization</p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Located in Srinagar, Garhwal</h2>
              <p className="text-lg text-neutral leading-relaxed mb-6">
                Nestled in the scenic Garhwal region of Uttarakhand, our campus offers a serene yet vibrant environment
                for learning and growth. The strategic location provides easy access to major cities while maintaining
                the tranquility needed for focused academic pursuits.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="text-color-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-neutral">Srinagar, Garhwal, Uttarakhand, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="text-color-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Campus Size</h3>
                    <p className="text-neutral">Sprawling 25-acre campus with modern infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card-bg rounded-lg p-8 border border-border">
              <img src="/campus-map.png" alt="Campus Map" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section ref={facilitiesRef} className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            World-Class <span className="text-color-primary">Facilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Modern Library",
                description:
                  "Comprehensive collection of books, journals, and digital resources for research and learning",
              },
              {
                icon: Zap,
                title: "Advanced Labs",
                description: "State-of-the-art laboratories equipped with latest technology and equipment",
              },
              {
                icon: Users,
                title: "Classrooms",
                description: "Well-designed, spacious classrooms with modern teaching aids and technology",
              },
              {
                icon: MapPin,
                title: "Sports Complex",
                description: "Comprehensive sports facilities including grounds, courts, and gymnasium",
              },
              {
                icon: BookOpen,
                title: "Auditorium",
                description: "Large capacity auditorium for seminars, conferences, and cultural events",
              },
              {
                icon: Zap,
                title: "Cafeteria",
                description: "Well-maintained cafeteria serving nutritious meals and refreshments",
              },
            ].map((facility, i) => {
              const Icon = facility.icon
              return (
                <div
                  key={i}
                  className="facility-card p-8 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <Icon className="text-color-primary mb-4" size={32} />
                  <h3 className="text-xl font-bold text-foreground mb-3">{facility.title}</h3>
                  <p className="text-neutral leading-relaxed">{facility.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Campus <span className="text-color-primary">Amenities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Hostel Facilities",
                items: [
                  "Separate boys and girls hostels",
                  "24/7 security and supervision",
                  "High-speed internet connectivity",
                  "Common recreation areas",
                ],
              },
              {
                title: "Health & Wellness",
                items: [
                  "On-campus medical center",
                  "Regular health checkups",
                  "Counseling services",
                  "Mental health support",
                ],
              },
              {
                title: "Technology Infrastructure",
                items: [
                  "High-speed WiFi throughout campus",
                  "Computer labs with latest systems",
                  "Smart classrooms",
                  "Digital library access",
                ],
              },
              {
                title: "Student Support",
                items: ["Career guidance center", "Placement assistance", "Scholarship programs", "Student mentoring"],
              },
            ].map((section, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-sm border border-border">
                <h3 className="text-2xl font-bold text-color-primary mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-neutral">
                      <div className="w-2 h-2 bg-color-primary rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Experience Our Campus</h2>
          <p className="text-xl mb-8 opacity-90">
            Take a virtual tour or visit us in person to explore our world-class facilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-color-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Virtual Tour
            </button>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-color-primary transition-colors"
            >
              Schedule Visit
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
