"use client"

import Background3D from "@/components/3d-background"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Mail } from "lucide-react"

export default function FacultyPage() {
  const titleRef = useRef(null)
  const facultyRef = useRef(null)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Scope animations to this component and revert on unmount
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
            ctx.add(() =>
              gsap.from(entry.target.querySelectorAll(".faculty-card"), {
                duration: 0.8,
                opacity: 0,
                y: 30,
                stagger: 0.1,
                ease: "power3.out",
                immediateRender: false,
              }),
            )
          }
        })
      },
      { threshold: 0.2 },
    )

    if (facultyRef.current) {
      observer.observe(facultyRef.current)
    }

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  const facultyMembers = [
    {
      name: "Dr. Rajesh Kumar",
      department: "Civil Engineering",
      qualification: "Ph.D. in Structural Engineering",
      experience: "18 years",
      specialization: "Earthquake Engineering",
      email: "rajesh.kumar@gpsrinagar.org",
    },
    {
      name: "Prof. Priya Sharma",
      department: "Mechanical Engineering",
      qualification: "M.Tech in Thermal Engineering",
      experience: "15 years",
      specialization: "Renewable Energy Systems",
      email: "priya.sharma@gpsrinagar.org",
    },
    {
      name: "Dr. Amit Patel",
      department: "Electrical Engineering",
      qualification: "Ph.D. in Power Systems",
      experience: "16 years",
      specialization: "Smart Grid Technology",
      email: "amit.patel@gpsrinagar.org",
    },
    {
      name: "Prof. Neha Singh",
      department: "Computer Science",
      qualification: "M.Tech in Artificial Intelligence",
      experience: "12 years",
      specialization: "Machine Learning",
      email: "neha.singh@gpsrinagar.org",
    },
    {
      name: "Dr. Vikram Gupta",
      department: "Electronics Engineering",
      qualification: "Ph.D. in VLSI Design",
      experience: "14 years",
      specialization: "Embedded Systems",
      email: "vikram.gupta@gpsrinagar.org",
    },
    {
      name: "Prof. Anjali Verma",
      department: "Applied Sciences",
      qualification: "M.Sc in Physics",
      experience: "11 years",
      specialization: "Nanotechnology",
      email: "anjali.verma@gpsrinagar.org",
    },
  ]

  return (
    <main ref={containerRef} className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Our Faculty
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            Experienced educators and industry experts dedicated to student success
          </p>
        </div>
      </section>

      {/* Faculty Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "50+", label: "Faculty Members" },
              { number: "15+", label: "Average Experience" },
              { number: "80%", label: "Ph.D. Holders" },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-sm border border-border text-center">
                <div className="text-4xl font-bold text-color-primary mb-2">{stat.number}</div>
                <div className="text-neutral font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-card-bg rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Our Faculty Matters</h2>
            <p className="text-neutral leading-relaxed">
              Our faculty comprises highly qualified professionals with extensive academic credentials and industry
              experience. They are committed to providing quality education, mentoring students, and conducting research
              that contributes to technological advancement. Each faculty member brings unique expertise and passion for
              their discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Members */}
      <section ref={facultyRef} className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Meet Our <span className="text-color-primary">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, i) => (
              <div
                key={i}
                className="faculty-card p-8 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-color-primary to-color-primary-light rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {faculty.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{faculty.name}</h3>
                <p className="text-color-primary font-semibold mb-4">{faculty.department}</p>

                <div className="space-y-3 mb-6 text-sm">
                  <div>
                    <p className="text-neutral font-medium">Qualification</p>
                    <p className="text-foreground">{faculty.qualification}</p>
                  </div>
                  <div>
                    <p className="text-neutral font-medium">Experience</p>
                    <p className="text-foreground">{faculty.experience}</p>
                  </div>
                  <div>
                    <p className="text-neutral font-medium">Specialization</p>
                    <p className="text-foreground">{faculty.specialization}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="flex items-center gap-2 text-color-primary hover:text-color-primary-light transition-colors text-sm"
                  >
                    <Mail size={16} />
                    {faculty.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Our <span className="text-color-primary">Departments</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Civil Engineering",
                description: "Building infrastructure and shaping the future of construction technology",
              },
              {
                name: "Mechanical Engineering",
                description: "Designing and developing mechanical systems and innovative solutions",
              },
              {
                name: "Electrical Engineering",
                description: "Powering innovation through electrical systems and renewable energy",
              },
              {
                name: "Computer Science",
                description: "Advancing technology through software development and AI research",
              },
              {
                name: "Electronics Engineering",
                description: "Creating cutting-edge electronic systems and embedded solutions",
              },
              {
                name: "Applied Sciences",
                description: "Exploring fundamental sciences and their practical applications",
              },
            ].map((dept, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-bold text-color-primary mb-3">{dept.name}</h3>
                <p className="text-neutral leading-relaxed">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
