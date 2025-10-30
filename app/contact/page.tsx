"use client"

import Background3D from "@/components/3d-background"
import type React from "react"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Scope GSAP animations to this component and revert on unmount
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      const formElements = formRef.current
        ? Array.from(formRef.current.querySelectorAll<HTMLDivElement>(".form-element"))
        : []

      tl.from(titleRef.current, {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: "power3.out",
        immediateRender: false,
      }).from(
        formElements,
        {
          duration: 0.6,
          opacity: 0,
          y: 20,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
        },
        "-=0.5",
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main ref={containerRef} className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D className="absolute inset-0 w-full h-full opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Get In Touch
          </h1>
          <p className="text-3xl text-black md:text-2xl opacity-90 max-w-3xl">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="p-8 bg-white rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <MapPin className="text-color-primary mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-2">Address</h3>
              <p className="text-neutral text-sm">Srinagar, Garhwal, Uttarakhand 246174, India</p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <Phone className="text-color-primary mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-2">Phone</h3>
              <p className="text-neutral text-sm">+91-1340-XXXXXX</p>
              <p className="text-neutral text-sm">+91-XXXX-XXXXXX</p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <Mail className="text-color-primary mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-2">Email</h3>
              <p className="text-neutral text-sm">info@gpsrinagar.org</p>
              <p className="text-neutral text-sm">admissions@gpsrinagar.org</p>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <Clock className="text-color-primary mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-foreground mb-2">Hours</h3>
              <p className="text-neutral text-sm">Mon - Fri: 9:00 AM - 5:00 PM</p>
              <p className="text-neutral text-sm">Sat: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-card-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-12 text-foreground">
            Send us a <span className="text-black">Message</span>
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-element">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary bg-white text-foreground"
                  placeholder="Your name"
                />
              </div>

              <div className="form-element">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary bg-white text-foreground"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Phone and Subject Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-element">
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary bg-white text-foreground"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>

              <div className="form-element">
                <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary bg-white text-foreground"
                >
                  <option value="">Select a subject</option>
                  <option value="admissions">Admissions Inquiry</option>
                  <option value="courses">Course Information</option>
                  <option value="placement">Placement Assistance</option>
                  <option value="facilities">Facilities & Campus</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="form-element">
              <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary bg-white text-foreground resize-none"
                placeholder="Please share your message or inquiry..."
              />
            </div>

            {/* Submit Button */}
            <div className="form-element">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-grey text-black rounded-lg font-semibold hover:bg-color-primary-light transition-colors duration-200 flex items-center justify-center gap-2" 
              >
                <Send size={20} />
                Send Message
              </button>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-semibold">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Find Us On <span className="text-color-primary">Map</span>
          </h2>
          <div className="w-full h-96 bg-card-bg rounded-lg border border-border overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="GPS Srinagar Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3356.5555555555556!2d78.7666666!3d30.2166667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDEzJzAwLjAiTiA3OMKwNDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Frequently Asked <span className="text-color-primary">Questions</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "What are the admission requirements?",
                answer:
                  "Students must have passed 10th standard (SSC) or equivalent with a minimum of 40% aggregate marks. Admission is based on merit and entrance examination scores.",
              },
              {
                question: "What is the duration of the diploma programs?",
                answer:
                  "All diploma programs are 3 years long, divided into 6 semesters with a mix of theoretical and practical learning.",
              },
              {
                question: "Does the college provide hostel facilities?",
                answer:
                  "Yes, we provide separate hostel facilities for boys and girls with 24/7 security, high-speed internet, and recreational amenities.",
              },
              {
                question: "What is the placement rate?",
                answer:
                  "Our college has a 95% placement rate with students being placed in leading companies across various sectors.",
              },
              {
                question: "How can I apply for admission?",
                answer:
                  "You can apply online through our website or visit the campus during office hours. The application process is simple and straightforward.",
              },
              {
                question: "Are scholarships available?",
                answer:
                  "Yes, we offer various scholarship programs for deserving students based on merit and financial need.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                <p className="text-neutral leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
