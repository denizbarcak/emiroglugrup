import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Login sayfasına erişimi engelleme
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.next();
    }

    // Token kontrolü
    const token = request.cookies.get("token");
    console.log("Token:", token); // Debug için

    // Token yoksa login sayfasına yönlendir
    if (!token) {
      console.log("Token yok, yönlendiriliyor..."); // Debug için
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      // Token'ı decode et ve role kontrolü yap
      const tokenParts = token.value.split(".");
      console.log("Token parts:", tokenParts); // Debug için

      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const tokenData = JSON.parse(atob(tokenParts[1]));
      console.log("Token data:", tokenData); // Debug için

      if (!tokenData.role || tokenData.role !== "admin") {
        console.log("Role kontrolü başarısız"); // Debug için
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch (error) {
      console.log("Token decode hatası:", error); // Debug için
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
