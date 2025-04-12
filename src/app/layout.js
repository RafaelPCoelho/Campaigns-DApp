import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: "Donate Crypto",
  description: "Donate crypto to your favorite causes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <Navbar />
        <main className="container py-4">
          {children}
        </main>
        
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
          async
        />
      </body>
    </html>
  );
}