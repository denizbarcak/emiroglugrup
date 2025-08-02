"use client";

import { useState, useEffect } from "react";

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCatalog?: {
    id: string;
    name: string;
    description: string;
  };
}

export default function CatalogModal({
  isOpen,
  onClose,
  onSuccess,
  editingCatalog,
}: CatalogModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>("");

  useEffect(() => {
    if (editingCatalog) {
      const fetchCatalogDetails = async () => {
        try {
          if (!process.env.NEXT_PUBLIC_API_URL) {
            throw new Error("API URL is not configured");
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/${editingCatalog.id}`
          );
          if (!response.ok) {
            throw new Error("Katalog detayları getirilemedi");
          }
          const catalog = await response.json();
          setName(catalog.name);
          setDescription(catalog.description);

          if (catalog.fileUrl) {
            const fileName = catalog.fileUrl.split("/").pop() || "";
            setCurrentFileName(fileName);
            setCurrentPdfUrl(catalog.fileUrl);
          }

          if (catalog.imageUrl) {
            setCurrentImageUrl(catalog.imageUrl);
          }
        } catch (error) {
          console.error("Catalog details fetch error:", error);
          setError("Katalog detayları getirilemedi");
        }
      };

      fetchCatalogDetails();
    } else {
      resetForm();
    }
  }, [editingCatalog]);

  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setFile(null);
    setImage(null);
    setCurrentFileName("");
    setCurrentImageUrl("");
    setCurrentPdfUrl("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || (!editingCatalog && !file)) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not configured");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("file", file);
      }
      if (image) {
        formData.append("image", image);
      }

      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (!tokenCookie) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      const token = tokenCookie.split("=")[1];

      const url = editingCatalog
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/${editingCatalog.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs`;

      const response = await fetch(url, {
        method: editingCatalog ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          editingCatalog
            ? "Katalog güncellenirken bir hata oluştu"
            : "Katalog eklenirken bir hata oluştu"
        );
      }

      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Catalog submit error:", error);
      setError(
        editingCatalog
          ? "Katalog güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
          : "Katalog eklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  // ... (rest of the JSX remains the same)
  return (
    <div className="fixed inset-0 backdrop-blur-[4px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            {editingCatalog ? "Kataloğu Düzenle" : "Yeni Katalog Ekle"}
          </h2>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-black text-sm font-bold mb-2"
            >
              Katalog Adı
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              placeholder="Katalog adını girin"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-black text-sm font-bold mb-2"
            >
              Açıklama
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
              rows={3}
              placeholder="Katalog açıklamasını girin"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-black text-sm font-bold mb-2"
            >
              Katalog Görseli
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className={`flex flex-col items-center justify-center w-full border-2 ${
                  image
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 border-dashed bg-gray-50"
                } rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 p-6`}
              >
                {image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Seçilen görsel"
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm text-black font-medium">
                      {image.name}
                    </p>
                    <p className="text-xs text-black mt-1">
                      Görsel seçildi - Değiştirmek için tıklayın
                    </p>
                  </div>
                ) : currentImageUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${currentImageUrl}`}
                      alt="Mevcut görsel"
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm text-black font-medium">
                      Mevcut Görsel
                    </p>
                    <p className="text-xs text-black mt-1">
                      Değiştirmek için tıklayın
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-black font-medium">
                      Görsel yüklemek için tıklayın
                    </p>
                    <p className="text-xs text-black mt-1">
                      veya sürükleyip bırakın
                    </p>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="file"
              className="block text-black text-sm font-bold mb-2"
            >
              PDF Dosyası
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className={`flex flex-col items-center justify-center w-full border-2 ${
                  file
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 border-dashed bg-gray-50"
                } rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 p-6`}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-blue-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm text-black font-medium">
                      {file.name}
                    </p>
                    <p className="text-xs text-black mt-1">
                      PDF seçildi - Değiştirmek için tıklayın
                    </p>
                  </div>
                ) : currentPdfUrl ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-blue-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm text-black font-medium">
                      {currentFileName}
                    </p>
                    <p className="text-xs text-black mt-1">
                      Mevcut PDF - Değiştirmek için tıklayın
                    </p>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${currentPdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      PDF'i Görüntüle
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-black font-medium">
                      PDF yüklemek için tıklayın
                    </p>
                    <p className="text-xs text-black mt-1">
                      veya sürükleyip bırakın
                    </p>
                  </div>
                )}
                <input
                  id="file"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingCatalog ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
