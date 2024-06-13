"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const isProfileActive = pathname.startsWith("/profile");
  const { audio } = useAudio();

  return (
    <section className={cn("left_sidebar h-[calc(100vh-5px)]", {
      'h-[calc(100vh-140px)]': audio?.audioUrl
    })}>
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
            <>
              <Link
                key={label}
                className={cn(
                  "flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start",
                  {
                    "bg-nav-focus border-r-4 border-orange-1": isActive,
                  }
                )}
                href={route!}
              >
                <Image src={imgURL} height={24} width={24} alt={label} />
                <p>{label}</p>
              </Link>
            </>
          );
        })}
        <SignedIn>
          <Link
            key={"profile"}
            className={cn(
              "flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start",
              {
                "bg-nav-focus border-r-4 border-orange-1": isProfileActive,
              }
            )}
            href={`/profile/${user?.id}`}
          >
            <Image
              src={"/icons/profile.svg"}
              height={24}
              width={24}
              alt={"profile"}
            />
            <p>My profile</p>
          </Link>
        </SignedIn>
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={() => signOut(() => router.push("/"))}
          >
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
