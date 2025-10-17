"use client"

import Background3D from "@/components/3d-background"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Clock, Users, Award, BookOpen } from "lucide-react"

export default function CoursesPage() {
  const titleRef = useRef(null)
  const coursesRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power3.out",
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target.querySelectorAll(".course-card"), {
              duration: 0.8,
              opacity: 0,
              y: 30,
              stagger: 0.1,
              ease: "power3.out",
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (coursesRef.current) {
      observer.observe(coursesRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const courses = [
    {
      code: "CE-101",
      name: "Diploma in Civil Engineering",
      duration: "3 Years",
      intake: "60 Students",
      description: "Learn structural design, construction management, and infrastructure development",
      specializations: ["Structural Engineering", "Transportation Engineering", "Water Resources"],
    },
    {
      code: "ME-101",
      name: "Diploma in Mechanical Engineering",
      duration: "3 Years",
      intake: "60 Students",
      description: "Master mechanical systems, thermodynamics, and manufacturing processes",
      specializations: ["Thermal Engineering", "Manufacturing", "Robotics"],
    },
    {
      code: "EE-101",
      name: "Diploma in Electrical Engineering",
      duration: "3 Years",
      intake: "60 Students",
      description: "Explore power systems, electrical machines, and renewable energy solutions",
      specializations: ["Power Systems", "Renewable Energy", "Smart Grid"],
    },
    {
      code: "CS-101",
      name: "Diploma in Computer Science",
      duration: "3 Years",
      intake: "90 Students",
      description: "Develop software applications and explore emerging technologies",
      specializations: ["Web Development", "AI & ML", "Cloud Computing"],
    },
    {
      code: "EC-101",
      name: "Diploma in Electronics Engineering",
      duration: "3 Years",
      intake: "60 Students",
      description: "Design electronic circuits and embedded systems for modern applications",
      specializations: ["VLSI Design", "Embedded Systems", "IoT"],
    },
    {
      code: "AS-101",
      name: "Diploma in Applied Sciences",
      duration: "3 Years",
      intake: "45 Students",
      description: "Study fundamental sciences with practical applications in industry",
      specializations: ["Physics", "Chemistry", "Mathematics"],
    },
  ]

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Our Courses
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            Comprehensive diploma programs designed for career excellence
          </p>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: BookOpen, number: "6", label: "Diploma Programs" },
              { icon: Users, number: "400+", label: "Students Enrolled" },
              { icon: Award, number: "95%", label: "Placement Rate" },
              { icon: Clock, number: "3", label: "Years Duration" },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="p-8 bg-white rounded-lg shadow-sm border border-border text-center">
                  <Icon className="text-color-primary mx-auto mb-4" size={32} />
                  <div className="text-3xl font-bold text-foreground mb-2">{item.number}</div>
                  <div className="text-neutral font-medium">{item.label}</div>
                </div>
              )
            })}
          </div>

          <div className="bg-card-bg rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Program Structure</h2>
            <p className="text-neutral leading-relaxed mb-6">
              All our diploma programs follow a comprehensive 3-year curriculum combining theoretical knowledge with
              practical skills. Students engage in classroom learning, laboratory work, industrial training, and
              project-based learning to develop industry-ready competencies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Semester 1-2: Foundation", "Semester 3-4: Core Concepts", "Semester 5-6: Specialization"].map(
                (phase, i) => (
                  <div key={i} className="p-4 bg-white rounded border border-border">
                    <p className="font-semibold text-foreground">{phase}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section ref={coursesRef} className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Available <span className="text-color-primary">Programs</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <div
                key={i}
                className="course-card p-8 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-color-primary mb-1">{course.code}</p>
                    <h3 className="text-2xl font-bold text-foreground">{course.name}</h3>
                  </div>
                </div>

                <p className="text-neutral leading-relaxed mb-6">{course.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-sm text-neutral font-medium">Duration</p>
                    <p className="text-foreground font-semibold">{course.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral font-medium">Intake</p>
                    <p className="text-foreground font-semibold">{course.intake}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {course.specializations.map((spec, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-color-primary/10 text-color-primary rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Admission <span className="text-color-primary">Criteria</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-lg shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-color-primary mb-6">Eligibility</h3>
              <ul className="space-y-3">
                {[
                  "Passed 10th standard (SSC) or equivalent",
                  "Minimum 40% aggregate marks",
                  "Age limit: 16-25 years",
                  "Valid entrance exam score",
                  "No upper age limit for reserved categories",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral">
                    <div className="w-2 h-2 bg-color-primary rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-color-primary mb-6">Selection Process</h3>
              <ul className="space-y-3">
                {[
                  "Merit-based selection",
                  "Entrance examination",
                  "Document verification",
                  "Counseling session",
                  "Final admission confirmation",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral">
                    <div className="w-2 h-2 bg-color-primary rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your path and become part of our thriving community of engineers and technologists
          </p>
          <button className="px-8 py-3 bg-white text-color-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Apply Now
          </button>
        </div>
      </section>
    </main>
  )
}
