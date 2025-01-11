"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import ChaptersSidebar from "./user/courses/[courseId]/ChaptersSidebar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = React.useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId(null);
    }
  }, [isCoursePage, pathname]);

  //handle use effect isCoursePage
  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page</div>;

  return (
    <SidebarProvider>
      <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
          {/* Chapter sidebar will go */}
          {courseId && <ChaptersSidebar />}

          <div
            className={cn("dashboard__main")}
            style={{
              height: "100vh",
            }}
          >
            <Navbar isCoursePage={true} />
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
