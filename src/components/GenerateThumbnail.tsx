import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "../../convex/_generated/api";
import {v4 as uuidv4} from 'uuid'

const GenerateThumbnail = ({
  setImagePrompt,
  setImageStorageId,
  image,
  imagePrompt,
  setImage,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const { toast } = useToast();
  const generateImage = async () => {
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: 'image/png' });
      handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive'})
    }
  }
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      toast({
        title: "Error uploading image.",
      });
      console.log(error);
    }
  };
  const handleImage = async (blob: Blob, filename: string) => {
    setIsGenerating(true);
    setImage("");
    try {
      const file = new File([blob], filename, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      // console.log(imageUrl)
      setImage(imageUrl!);
      setIsGenerating(false);
      toast({
        title: "Thumbnail generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
      console.log(error);
      setIsGenerating(false);
    }
  };
  return (
    <>
      <div className="generate_thumbnail ">
        <Button
          type="button"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", {
            "bg-black-6": isAiThumbnail,
          })}
          variant="plain"
        >
          Use Ai to generate thumnail
        </Button>
        <Button
          type="button"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", {
            "bg-black-6": !isAiThumbnail,
          })}
          variant="plain"
        >
          Upload custom Image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className=" mt-5 flex flex-col gap-2.5">
            <Label className="form-label">
              Ai prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class focus-visible:ring-orange-1"
              placeholder="Provide prompt to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              onClick={generateImage}
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
        </div>
      ) : (
        <div
          className="image_div cursor-pointer "
          onClick={() => imageRef?.current?.click()}
        >
          <Input
            ref={imageRef}
            className="hidden"
            type="file"
            onChange={(e) => uploadImage(e)}
          />
          {!isGenerating ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 text-orange-1 font-bold">click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              {" "}
              SVG, JPG, PNG or GIF (max, 1080px, 1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
