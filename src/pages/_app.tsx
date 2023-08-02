import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function App() {
  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
