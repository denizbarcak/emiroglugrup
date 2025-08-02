"use client";

import { useEffect, useState } from "react";

interface Catalog {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  imageUrl: string;
}

export default function CatalogList() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

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
      console.error("Catalog fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (catalogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Henüz katalog eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {catalogs.map((catalog) => (
        <div
          key={catalog.id}
          className="bg-gray-50 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
        >
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
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {catalog.name}
            </h3>
            <p className="text-gray-700 mb-4">{catalog.description}</p>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}${catalog.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Kataloğu İncele
              <svg
                className="w-4 h-4"
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
      ))}
    </div>
  );
}
