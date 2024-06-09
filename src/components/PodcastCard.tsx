import Image from "next/image";
import React from "react";

const PodcastCard = ({
  podcastId,
  title,
  description,
  imgURL,
}: {
  podcastId: number;
  title: string;
  description: string;
  imgURL: string;
}) => {
  return (
    <div className="cursor-pointer ">
      <figure className="flex flex-col  gap-2">
        <Image src={imgURL} height={174} width={174} alt={title} className="aspect-square rounded-xl h-fit w-full 2xl:size-[200px]" />
        <div className="flex flex-col ">
          <h1 className="text-16 font-bold truncate text-white-1">{title}</h1>
          <h2 className="truncate text-12 capitalize font-normal text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
