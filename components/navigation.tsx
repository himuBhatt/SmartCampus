"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "../lib/firebase"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Campus", href: "/campus" },
    { label: "Faculty", href: "/faculty" },
    { label: "Courses", href: "/courses" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Notice Board", href: "/notice-board" },
    { label: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const iconRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserEmail(u?.email ?? null)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuOpen) return
      if (!iconRef.current) return
      if (e.target instanceof Node && iconRef.current.contains(e.target)) return
      setMenuOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [menuOpen])

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            
            <span className="hidden sm:inline font-bold text-foreground text-sm md:text-base">GPS Srinagar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-foreground hover:text-blue-600"
                }`}
              >
                {item.label}
                <div className={`absolute -bottom-[1px] left-0 w-full h-[3px] bg-blue-600 transform origin-left transition-transform duration-300 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100`} />
              </Link>
            ))}
            {/* User icon */}
            {/* User icon + menu */}
            <div ref={iconRef} className="relative ml-3">
              {userEmail ? (
                <button
                  onClick={() => setMenuOpen((s) => !s)}
                  aria-label="Account menu"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <User size={18} />
                </button>
              ) : (
                <Link href="/auth" aria-label="Open account" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                  <User size={18} />
                </Link>
              )}

              {menuOpen && userEmail && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-lg p-3 z-50">
                  <div className="text-sm text-neutral-700 truncate">{userEmail}</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        await firebaseSignOut(auth)
                        setMenuOpen(false)
                        router.push("/")
                      }}
                      className="flex-1 text-sm bg-red-600 text-white py-1 rounded-md"
                    >
                      Sign out
                    </button>
                    <Link href="/profile" className="flex-1 text-sm bg-gray-100 text-neutral-800 py-1 rounded-md text-center">
                      Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sign up CTA */}
            <Link
              href="/auth"
              className="ml-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-card-bg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
                  isActive(item.href) ? "text-blue-600" : "text-foreground hover:text-blue-600"
                }`}
              >
                {item.label}
                <div className={`absolute -bottom-[1px] left-0 w-full h-[3px] bg-blue-600 transform origin-left transition-transform duration-300 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100`} />
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3">
                <div ref={iconRef} className="relative">
                  {userEmail ? (
                    <button
                      onClick={() => setMenuOpen((s) => !s)}
                      aria-label="Account menu"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                    >
                      <User size={18} />
                    </button>
                  ) : (
                    <Link href="/auth" aria-label="Open account" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                      <User size={18} />
                    </Link>
                  )}

                  {menuOpen && userEmail && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-lg p-3 z-50">
                      <div className="text-sm text-neutral-700 truncate">{userEmail}</div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={async () => {
                            await firebaseSignOut(auth)
                            setMenuOpen(false)
                            router.push("/")
                          }}
                          className="flex-1 text-sm bg-red-600 text-white py-1 rounded-md"
                        >
                          Sign out
                        </button>
                        <Link href="/profile" className="flex-1 text-sm bg-gray-100 text-neutral-800 py-1 rounded-md text-center">
                          Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/auth"
                  className="flex-1 text-center mt-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
          </div>
        )}
      </div>
    </nav>
  )
}
