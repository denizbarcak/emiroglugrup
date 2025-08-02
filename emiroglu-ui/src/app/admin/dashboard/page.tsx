"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import CatalogModal from "@/components/CatalogModal";

interface Catalog {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteCatalog = async (id: string) => {
    if (!window.confirm("Bu kataloğu silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (!tokenCookie) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      const token = tokenCookie.split("=")[1];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Katalog silinemedi");
      }

      fetchCatalogs(); // Listeyi yenile
    } catch (error) {
      setError("Katalog silinirken bir hata oluştu");
    }
  };

  const fetchCatalogs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs`
      );
      if (!response.ok) {
        throw new Error("Kataloglar getirilemedi");
      }
      const data = await response.json();
      setCatalogs(data);
    } catch (error) {
      setError("Kataloglar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin";
      return;
    }

    fetchCatalogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFF] relative">
      <AdminHeader />
      <div
        className="absolute inset-0 bg-[url('/unified-bg.svg')] bg-cover bg-center bg-no-repeat"
        style={{ zIndex: 0 }}
      ></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16" style={{ zIndex: 1 }}>
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 flex flex-col items-center">
              <div>
                Yemek Sektörünün{" "}
                <span className="relative">
                  <span className="relative z-10">Güvenilir</span>
                  <div className="absolute bottom-2 left-0 w-full h-3 bg-yellow-200/70 -rotate-1"></div>
                </span>
              </div>
              <div className="mt-2">Tedarikçisi</div>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Kaliteli ürünler, güvenilir hizmet ve geniş ürün yelpazemiz ile
              yemek sektörünün önde gelen toptancısıyız.
            </p>
            <a
              href="#kataloglar"
              className="inline-flex items-center px-8 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 group"
            >
              Katalogları İncele
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Kataloglar Section */}
      <section id="kataloglar" className="pb-24 pt-16">
        <div className="container mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-[40px] shadow-lg p-8 md:p-12 border border-white/20">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Kataloglarımız
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Yeni Katalog Ekle
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Yeni Katalog Ekle
              </button>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : catalogs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Henüz Katalog Eklenmemiş
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Yeni katalog eklemek için sağ üstteki "Yeni Katalog Ekle"
                  butonunu kullanabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {catalogs.map((catalog) => (
                  <div
                    key={catalog.id}
                    className="bg-gray-50 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {catalog.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${catalog.imageUrl}`}
                            alt={catalog.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-center px-4">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                              {catalog.name}
                            </h3>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingCatalog(catalog);
                          setIsModalOpen(true);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {catalog.name}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {catalog.description}
                      </p>
                      <div className="flex space-x-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${catalog.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors text-center"
                        >
                          Görüntüle
                        </a>
                        <button
                          onClick={() => handleDeleteCatalog(catalog.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <CatalogModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCatalog(null);
        }}
        onSuccess={fetchCatalogs}
        editingCatalog={editingCatalog || undefined}
      />
    </div>
  );
}
