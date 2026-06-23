import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Dummy FastFood",
  description: "Next.js Firebase CRUD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
