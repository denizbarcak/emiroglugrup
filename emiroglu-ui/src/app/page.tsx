import Image from "next/image";
import Link from "next/link";
import CatalogList from "@/components/CatalogList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] relative">
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
      <section id="kataloglar" className="relative py-24" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-[40px] shadow-lg p-8 md:p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Kataloglarımız
            </h2>

            <CatalogList />
          </div>
        </div>
      </section>
    </div>
  );
}
