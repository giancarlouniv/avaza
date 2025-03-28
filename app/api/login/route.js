import { NextResponse } from "next/server";

export function middleware(req) {
  const isLoggedIn = req.cookies.get("auth")?.value === "true";

  // Se l'utente non è loggato e sta cercando di accedere a una pagina protetta
  if (!isLoggedIn && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Applica il middleware a tutte le pagine tranne /login
export const config = {
  matcher: "/((?!login|_next|static|favicon.ico).*)",
};
