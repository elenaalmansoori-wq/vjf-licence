import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "VJF-LICENCE",
  description: "Licencování pro virtuální jezdeckou federaci",
  metadataBase: new URL("https://vjf-licence.vercel.app"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <header className="nav">
          <div className="brand">VJF-LICENCE</div>
          <nav>
            <Link href="/">Domů</Link>
            <Link href="/veterinar">Veterinář</Link>
            <Link href="/kovar">Kovář</Link>
            <Link href="/trener">Trenér</Link>
            <Link href="/vysledky">Výsledky testů</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">© VJF-LICENCE</footer>
      </body>
    </html>
  );
}
