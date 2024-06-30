import NavBar from "@/components/shared/navbar/NavBar";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="background-light850_dark100 relative">
      <NavBar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto h-[2000px] w-full max-w-5xl">{children}</div>
        </section>
        RightSide
      </div>
    </main>
  );
};

export default Layout;
