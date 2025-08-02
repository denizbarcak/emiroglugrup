"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Token cookie'sini sil
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin");
  };

  // Dropdown dışına tıklandığında menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white z-50"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
      }}
    >
      <nav className="container mx-auto px-4 py-7 md:py-4">
        <div className="relative flex items-center">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Emiroglu Grup
          </Link>

          <div className="absolute right-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <span className="font-medium">Admin</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                <Link
                  href="/admin/iletisim-ayarlari"
                  className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  İletişim Ayarları
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-50"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
