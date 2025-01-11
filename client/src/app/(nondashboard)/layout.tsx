import React from "react";
import NonDashboardNavBar from "@/components/NonDashboardNavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavBar />
      <main className="nondashboard-layout__main">{children}</main>
      <Footer />
    </div>
  );
}
