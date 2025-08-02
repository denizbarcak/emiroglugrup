"use client";

import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [phone, setPhone] = useState("+90 (XXX) XXX XX XX");

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`
      );
      if (!response.ok) throw new Error("Bilgiler alınamadı");
      const data = await response.json();
      if (data.phone) {
        // Telefon numarasından tüm boşlukları ve özel karakterleri kaldır
        const whatsappNumber = data.phone.replace(/[^0-9]/g, "");
        setPhone(whatsappNumber);
      }
    } catch (err) {
      console.error("İletişim bilgileri yüklenirken bir hata oluştu:", err);
    }
  };
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group"
      aria-label="WhatsApp ile iletişime geçin"
    >
      {/* Dış çember animasyonu - daha hafif glow efekti */}
      <div className="absolute -inset-1 bg-[#25D366]/40 rounded-full blur-[2px] group-hover:bg-[#25D366]/50 transition-all duration-300"></div>

      {/* Ana buton */}
      <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-md transform transition-all duration-300 ease-in-out group-hover:scale-105">
        {/* WhatsApp ikonu */}
        <svg
          width="28"
          height="28"
          className="md:w-8 md:h-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.853564 19.7608C0.852627 23.1216 1.73763 26.4031 3.42044 29.2955L0.692627 39.178L10.8851 36.5262C13.6877 38.0491 16.8011 38.847 19.9621 38.8475H19.9697C30.9082 38.8475 39.8335 30.0552 39.8387 19.2787C39.8411 14.0682 37.7385 9.13422 33.9386 5.39786C30.1392 1.66186 25.1334 -0.402138 19.9671 -0.405762C9.02757 -0.405762 0.102627 8.38618 0.853564 19.7608ZM6.49663 29.1111L6.09919 28.4751C4.49319 25.8356 3.64563 22.8348 3.64657 19.7618C3.64657 10.9297 11.0012 3.69274 19.9741 3.69274C24.2756 3.69562 28.3298 5.39674 31.4266 8.44286C34.5229 11.489 36.2516 15.4797 36.2497 19.7161C36.2441 28.5488 28.89 35.7863 19.9697 35.7863H19.9641C17.0047 35.7851 14.1083 35.0472 11.5551 33.6461L10.9392 33.2882L4.73669 34.8748L6.49663 29.1111Z"
            fill="white"
          />
          <path
            d="M14.5679 11.5113C14.2125 10.7225 13.8375 10.7101 13.5026 10.6992C13.2255 10.6897 12.9156 10.6903 12.6057 10.6903C12.2958 10.6903 11.7946 10.8139 11.3684 11.3693C10.9417 11.9251 9.82715 12.9611 9.82715 15.0701C9.82715 17.1791 11.3996 19.2133 11.6171 19.5232C11.8346 19.8331 14.7229 24.4471 19.2871 26.3153C23.0604 27.8753 23.8346 27.6233 24.6646 27.5461C25.4946 27.4689 27.3479 26.4871 27.7479 25.4283C28.1479 24.3695 28.1479 23.4621 28.0396 23.2833C27.9312 23.1045 27.6046 22.9991 27.1146 22.7883C26.6246 22.5775 24.4417 21.5409 23.9842 21.3988C23.5267 21.2566 23.2 21.1855 22.8901 21.6722C22.5802 22.1584 21.7296 23.1236 21.4509 23.4335C21.1722 23.7434 20.8934 23.779 20.4034 23.5682C19.9134 23.3569 18.4842 22.8677 16.7605 21.3363C15.4184 20.1463 14.5234 18.6871 14.2446 18.2009C13.9659 17.7152 14.2134 17.459 14.4496 17.2234C14.6634 17.0096 14.9359 16.6584 15.1846 16.3796C15.4329 16.1009 15.5046 15.8896 15.6484 15.5797C15.7921 15.2698 15.7196 14.991 15.6109 14.7802C15.5021 14.5694 14.6317 12.3734 14.5679 11.5113Z"
            fill="white"
          />
        </svg>
      </div>
    </a>
  );
}
