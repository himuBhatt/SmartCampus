"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Calendar, MapPin, Clock } from "lucide-react"

export default function EventsPage() {
  const titleRef = useRef(null)
  const eventsRef = useRef(null)

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
            gsap.from(entry.target.querySelectorAll(".event-card"), {
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

    if (eventsRef.current) {
      observer.observe(eventsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Technical Symposium",
      date: "March 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      category: "Academic",
      description: "A platform for students to showcase their technical projects and innovations",
      attendees: "500+",
      image: "/technical-symposium-event.jpg",
    },
    {
      id: 2,
      title: "Industry Expert Talk",
      date: "March 22, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Seminar Hall",
      category: "Workshop",
      description: "Learn from industry leaders about latest trends in technology and career opportunities",
      attendees: "200+",
      image: "/professional-conference-talk.jpg",
    },
    {
      id: 3,
      title: "Sports Day",
      date: "April 5, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "Sports Complex",
      category: "Sports",
      description: "Inter-departmental sports competition featuring various athletic events",
      attendees: "800+",
      image: "/sports-day-competition.jpg",
    },
    {
      id: 4,
      title: "Cultural Fest",
      date: "April 18, 2025",
      time: "5:00 PM - 10:00 PM",
      location: "Open Ground",
      category: "Cultural",
      description: "Celebrate diversity with music, dance, drama, and cultural performances",
      attendees: "1000+",
      image: "/cultural-festival-performance.jpg",
    },
    {
      id: 5,
      title: "Coding Competition",
      date: "April 25, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Computer Lab",
      category: "Academic",
      description: "Showcase your programming skills in this exciting coding challenge",
      attendees: "150+",
      image: "/coding-competition-hackathon.jpg",
    },
    {
      id: 6,
      title: "Placement Drive",
      date: "May 2, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Campus",
      category: "Placement",
      description: "Meet leading companies and explore exciting career opportunities",
      attendees: "30+ Companies",
      image: "/job-fair-recruitment-event.jpg",
    },
  ]

  const pastEvents = [
    {
      title: "Orientation Program",
      date: "January 15, 2025",
      description: "Welcome session for new students",
    },
    {
      title: "Republic Day Celebration",
      date: "January 26, 2025",
      description: "National flag hoisting and cultural program",
    },
    {
      title: "Alumni Meet",
      date: "February 10, 2025",
      description: "Reconnect with alumni and share experiences",
    },
  ]

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-black">
            Events & Activities
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            Stay updated with campus events, workshops, and celebrations
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section ref={eventsRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Upcoming <span className="text-color-primary">Events</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-card-bg">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-color-primary/10 text-color-primary rounded-full text-sm font-semibold">
                      {event.category}
                    </span>
                    <span className="text-sm text-neutral font-medium">{event.attendees}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                  <p className="text-neutral leading-relaxed mb-6">{event.description}</p>

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-3 text-neutral">
                      <Calendar size={18} className="text-color-primary flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral">
                      <Clock size={18} className="text-color-primary flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral">
                      <MapPin size={18} className="text-color-primary flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 px-4 py-2 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-light transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Recent <span className="text-color-primary">Events</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-sm border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <Calendar className="text-color-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-neutral font-medium">{event.date}</p>
                    <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                  </div>
                </div>
                <p className="text-neutral leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Calendar Info */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-color-primary to-color-primary-light rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl">
              Subscribe to our newsletter to receive updates about upcoming events, workshops, and campus activities.
              Never miss an opportunity to be part of our vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-color-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
