"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"];

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Podcast title must be at least 2 characters.",
  }),
  podcastDescription: z.string().min(2, {
    message: "Podcast description must be at least 2 characters.",
  }),
});

const CreatePodcastPage = () => {
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPodcast = useMutation(api.podcasts.createPodcast)

  const {toast} = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: "Please generate audio and image",
        });
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast({ title: "Podcast created" });
      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col mt-10">
      <h1 className="text-20 font-bold text-white-1">create poscasts</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex flex-col  w-full"
        >
          <div className="border-b border-black-5 pb-10 flex flex-col gap-[30px] ">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-orange-1"
                      placeholder="Joe Rogan Podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <Label className="form-label">Select Ai Voice</Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 border-none bg-black-1 text-gray-1 w-full focus:ring-orange-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select Ai Voice"
                    className="placeholder:text-gray-1 "
                  />
                </SelectTrigger>
                <SelectContent className="border-none focus:ring-orange-1 text-16 bg-black-1 font-bold text-white-1">
                  {voiceCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize focus:bg-orange-1"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="form-label">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-orange-1"
                      placeholder="Write a short podcast description."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              setImagePrompt={setImagePrompt}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImage={setImageUrl}
            />
            <div className="mt-10 w-full ">
              <Button
                type="submit"
                className="text-16 bg-orange-1 w-full py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "submit and publish podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcastPage;
