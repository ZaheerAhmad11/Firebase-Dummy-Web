import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata = {
    icons: {
    icon: './favicon2.png',
  },
  title: "Crown Chicken",
  description: "Next.js Firebase CRUD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-200 min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
