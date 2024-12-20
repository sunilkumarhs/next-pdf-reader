"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { LuLoaderPinwheel } from "react-icons/lu";

const UploadDropzone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { toast } = useToast();

  const { startUpload } = useUploadThing("pdfUploader");
  const { mutate: insertFiletoDB } = trpc.addFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  // const { mutate: startPolling } = trpc.getFile.useMutation({
  //   onSuccess: (file) => {
  //     router.push(`/dashboard/${file.id}`);
  //   },
  //   retry: true,
  //   retryDelay: 50000,
  // });

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        //handle file uploading
        const res = await startUpload(acceptedFile);
        if (!res) {
          return toast({
            title: "Something went wrong!!",
            description: "Please try again later!",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;
        const name = fileResponse?.name;
        const url = fileResponse?.url;

        if (!key) {
          return toast({
            title: "Something went wrong!!",
            description: "Please try again later!",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        insertFiletoDB({ key, name, url });
        // startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border m-4 h-64 border-dashed border-stone-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <RiUploadCloud2Fill className="h-10 w-10 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop.
                </p>
                <p className="text-xs text-zinc-600">PDF (up to 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FaRegFilePdf className="h-7 w-7 text-red-700" />
                  </div>
                  <div className="px-3 py-2 text-sm truncate h-full">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <LuLoaderPinwheel className="h-5 w-5 animate-spin text-green-500" />
                      Redirecting......
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
