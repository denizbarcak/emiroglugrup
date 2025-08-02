"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";

export default function ContactSettings() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // İletişim bilgilerini getir
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`
      );
      if (!response.ok) throw new Error("Bilgiler alınamadı");
      const data = await response.json();
      setEmail(data.email);
      setPhone(data.phone);
    } catch (err) {
      setError("İletişim bilgileri yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Oturum bulunamadı");
      }

      // Telefon numarasını formatla
      let formattedPhone = phone.replace(/[^0-9]/g, ""); // Sadece rakamları al
      if (formattedPhone.startsWith("0")) {
        formattedPhone = formattedPhone.substring(1); // Baştaki 0'ı kaldır
      }
      if (!formattedPhone.startsWith("90")) {
        formattedPhone = "90" + formattedPhone;
      }

      // Telefon numarasını güzel görünümlü hale getir
      const displayPhone =
        "+" +
        formattedPhone.replace(
          /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
          "$1 ($2) $3 $4 $5"
        );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, phone: displayPhone }),
        }
      );

      if (!response.ok) throw new Error("Güncelleme başarısız");

      setSuccess("İletişim bilgileri başarıyla güncellendi");
    } catch (err) {
      setError("İletişim bilgileri güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            İletişim Ayarları
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-sm rounded-lg p-6"
          >
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
                {success}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email Adresi
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black mb-2"
              >
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5XX XXX XX XX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
