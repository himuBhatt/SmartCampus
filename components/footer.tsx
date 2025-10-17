import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    /* Changed footer to solid black background instead of faded */
    <footer  className=" text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">GPS Srinagar</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Government Polytechnic Srinagar - Excellence in Technical Education since 1968.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-color-accent transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-color-accent transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-gray-400 hover:text-color-accent transition">
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-color-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Srinagar, Garhwal, Uttarakhand</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91-XXXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@gpsrinagar.org</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-color-accent transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-color-accent transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-color-accent transition" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-color-accent transition" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Government Polytechnic Srinagar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
