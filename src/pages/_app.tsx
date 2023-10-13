import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/header";
import { ConfigSidebar } from "@/components/config-bar";

export default function App() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 flex">
        <ConfigSidebar />
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
