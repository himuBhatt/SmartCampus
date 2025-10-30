"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Background3D from "@/components/3d-background"
import { X } from "lucide-react"

export default function GalleryPage() {
  const titleRef = useRef(null)
  const galleryRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
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
              gsap.from(entry.target.querySelectorAll(".gallery-item"), {
                duration: 0.6,
                opacity: 0,
                scale: 0.9,
                stagger: 0.08,
                ease: "back.out",
                immediateRender: false,
              }),
            )
          }
        })
      },
      { threshold: 0.2 },
    )

    if (galleryRef.current) {
      observer.observe(galleryRef.current)
    }

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  const galleryImages = [
    {
      id: 1,
      title: "Campus Main Building",
      category: "Infrastructure",
      image: "/modern-college-building-architecture.jpg",
    },
    {
      id: 2,
      title: "Computer Lab",
      category: "Facilities",
      image: "/computer-lab-with-modern-workstations.jpg",
    },
    {
      id: 3,
      title: "Library",
      category: "Facilities",
      image: "/modern-library-interior-with-books.jpg",
    },
    {
      id: 4,
      title: "Sports Complex",
      category: "Sports",
      image: "/sports-complex-gymnasium.jpg",
    },
    {
      id: 5,
      title: "Classroom Session",
      category: "Academics",
      image: "/classroom-learning.png",
    },
    {
      id: 6,
      title: "Laboratory Work",
      category: "Academics",
      image: "/engineering-lab-with-equipment.jpg",
    },
    {
      id: 7,
      title: "Convocation Ceremony",
      category: "Events",
      image: "/graduation-convocation-ceremony.jpg",
    },
    {
      id: 8,
      title: "Campus Grounds",
      category: "Infrastructure",
      image: "/green-campus-grounds-trees.jpg",
    },
    {
      id: 9,
      title: "Auditorium",
      category: "Facilities",
      image: "/large-auditorium-hall.jpg",
    },
    {
      id: 10,
      title: "Student Project",
      category: "Academics",
      image: "/students-working-on-engineering-project.jpg",
    },
    {
      id: 11,
      title: "Cultural Event",
      category: "Events",
      image: "/cultural-performance-stage.png",
    },
    {
      id: 12,
      title: "Cafeteria",
      category: "Facilities",
      image: "/modern-cafeteria-dining-area.jpg",
    },
  ]

  const categories = ["All", "Infrastructure", "Facilities", "Academics", "Sports", "Events"]
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredImages =
    activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <main ref={containerRef} className="pt-20 opacity-100">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Explore the vibrant campus life and world-class facilities
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-color-primary text-white"
                    : "bg-white text-foreground border border-border hover:border-color-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={galleryRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, i) => (
              <div
                key={image.id}
                className="gallery-item group cursor-pointer relative overflow-hidden rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-300"
                onClick={() => setSelectedImage(i)}
              >
                <div className="aspect-square overflow-hidden bg-card-bg">
                  <img
                    src={image.image || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  <p className="text-gray-200 text-sm">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={filteredImages[selectedImage].image || "/placeholder.svg"}
              alt={filteredImages[selectedImage].title}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold">{filteredImages[selectedImage].title}</h3>
              <p className="text-gray-300">{filteredImages[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
