"use client";
import PodcastCard from "@/components/PodcastCard";
import { Button } from "@/components/ui/button";
import { podcastData } from "@/constants";
import Image from "next/image";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  if (!trendingPodcasts) return <LoaderSpinner />;

  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending poscasts</h1>
        {/* <div className="podcast_grid">
          {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <PodcastCard 
              key={_id}
              imgUrl={imageUrl as string}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
            />
          ))}
        </div> */}
        <div className="podcast_grid">
          {podcastData.map(({ id, title, description, imgUrl }) => (
            <PodcastCard
              key={id}
              title={title}
              description={description}
              imgUrl={imgUrl}
              podcastId={id as any}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
