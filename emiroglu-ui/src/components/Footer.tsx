"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    email: "info@emiroglugrup.com",
    phone: "+90 (XXX) XXX XX XX",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`
      );
      if (!response.ok) throw new Error("Bilgiler alınamadı");
      const data = await response.json();
      setContactInfo({
        email: data.email || contactInfo.email,
        phone: data.phone || contactInfo.phone,
      });
    } catch (err) {
      console.error("İletişim bilgileri yüklenirken bir hata oluştu:", err);
    }
  };
  return (
    <footer id="iletisim" className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6">Emiroglu Grup</h3>
            <p className="text-gray-300">
              Yemek sektöründe toptancılık hizmetleri sunan güvenilir
              partneriniz.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6">İletişim</h3>
            <div className="text-gray-300 text-center md:text-left">
              <p className="mb-4">Email: {contactInfo.email}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span>Tel: {contactInfo.phone}</span>
                <a
                  href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="md:hidden inline-flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-600 transition-colors"
                  aria-label="Numarayı ara"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#kataloglar"
                  className="text-gray-300 hover:text-white"
                >
                  Kataloglar
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-300">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Emiroglu Grup. Tüm hakları
            saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
