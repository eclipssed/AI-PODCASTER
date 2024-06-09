"use client";
import PodcastCard from "@/components/PodcastCard";
import { Button } from "@/components/ui/button";
import { podcastData } from "@/constants";
import Image from "next/image";

import { useQuery } from "convex/react";
import {api} from '../../../convex/_generated/api'



export default function Home() {
  const tasks = useQuery(api.tasks.get);
  console.log(tasks)
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending poscasts</h1>
        <div className="podcast_grid">

        {podcastData.map(({ id, title, description, imgURL }) => (
          <PodcastCard
          key={id}
          title={title}
          description={description}
          imgURL={imgURL}
          podcastId ={id}
          />
          ))}
        </div>
      </section>
    </div>
  );
}
