import React from "react";

const PodcastDetailsPage = ({ params }: { params: { podcastId: string } }) => {
  return <div className="text-white-1">PodcastDetailsPage for {params.podcastId}</div>;
};

export default PodcastDetailsPage;
