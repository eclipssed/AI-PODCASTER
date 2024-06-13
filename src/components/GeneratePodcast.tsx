"use client";

import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";

// hook
const useGeneratePodcast = ({
  setAudio,
  voicePrompt,
  voiceType,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  // function
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title: "Please provide a voice prompt to generate podcast.",
      });
      return setIsGenerating(false);
    }
    if (!voiceType) {
      toast({
        title: "Please select a voiceType to generate podcast.",
      });
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        voice: voiceType!,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error creating podcast.",
        variant: "destructive",
      });
      console.log("Error generating podcast.", error);
      setIsGenerating(false);
    }
  };
  return {
    isGenerating: false,
    generatePodcast,
  };
};

// ui component
const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="form-label">Ai prompt to generate podcast</Label>
        <Textarea
          className="input-class focus-visible:ring-orange-1"
          placeholder="Provide prompt to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          onClick={generatePodcast}
          type="button"
          className="text-16 bg-orange-1  py-4 font-bold text-white-1 "
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
