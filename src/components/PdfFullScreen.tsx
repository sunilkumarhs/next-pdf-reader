import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { HiArrowsExpand } from "react-icons/hi";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { LuLoaderPinwheel } from "react-icons/lu";
import { useToast } from "@/hooks/use-toast";

interface PdfFullScreenUrl {
  fileUrl: string;
}

const PdfFullScreen = ({ fileUrl }: PdfFullScreenUrl) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();
  const [numberofPages, setNumberofPages] = useState<number>();

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
        <button
          aria-label="fullscreen"
          className="hover:bg-slate-100 p-2 gap-1.5 rounded-md focus-visible:outline-blue-600"
        >
          <HiArrowsExpand className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <DialogTitle></DialogTitle>
        <SimpleBar autoHide={false} className="max-h[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <LuLoaderPinwheel className="my-32 h-10 w-10 animate-spin" />
                  <p className="px-2 my-[8.5rem] text-xl font-semibold">
                    Loading......
                  </p>
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error Loading PDF",
                  description: "Please try again later....",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumberofPages(numPages);
              }}
              file={fileUrl}
              className="max-h-full"
            >
              {new Array(numberofPages).fill(0).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
