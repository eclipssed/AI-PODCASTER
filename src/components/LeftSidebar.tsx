'use client'


import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section className="left_sidebar ">
      <nav className="flex flex-col gap-6">
        <Link
          href={"/"}
          className="flex cursor-pointer items-center gap-1 max-lg:justify-center pb-10"
        >
          <Image width={23} src={"/icons/logo.svg"} height={27} alt="logo" />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Ai-Podcaster
          </h1>
        </Link>
        {sidebarLinks.map(({ label, route, imgURL }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);
          return (
            <Link
              key={label}
              className={cn("flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start", {
               "bg-nav-focus border-r-4 border-orange-1": isActive 
              })}
              href={route}
            >
              <Image src={imgURL} height={24} width={24} alt={label} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
