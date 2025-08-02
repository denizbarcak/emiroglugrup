"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Eğer zaten dashboard sayfasındaysak, yönlendirme yapmayalım
    if (window.location.pathname === "/admin/dashboard") {
      return;
    }

    // Token kontrolü
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (token) {
      try {
        const tokenValue = token.split("=")[1];
        const tokenData = JSON.parse(atob(tokenValue.split(".")[1]));

        if (tokenData.role === "admin") {
          // Cookie'deki token'ı localStorage'a da kaydedelim
          localStorage.setItem("token", tokenValue);
          // window.location.href kullanarak tam sayfa yönlendirme yapalım
          window.location.href = "/admin/dashboard";
        }
      } catch (error) {
        // Token geçersizse cookie'yi temizle
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("token"); // localStorage'ı da temizleyelim
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Token'ı hem cookie hem localStorage'a kaydet
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      localStorage.setItem("token", data.token);

      // Başarılı login sonrası dashboard'a yönlendir
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      data-browser-autocomplete="off"
      data-lpignore="true"
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Girişi
          </h2>
          {error && (
            <div className="mt-2 text-center text-sm text-red-600">{error}</div>
          )}
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          autoComplete="off"
          data-form-type="other"
          data-browser-autocomplete="off"
          data-lpignore="true"
          data-form-extension="ignore"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="off"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-browser-autocomplete="off"
                data-lpignore="true"
                data-form-extension="ignore"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="off"
                type="password"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-browser-autocomplete="off"
                data-lpignore="true"
                data-form-extension="ignore"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
