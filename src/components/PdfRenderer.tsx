"use client";

import { useToast } from "@/hooks/use-toast";
import { LuLoaderPinwheel } from "react-icons/lu";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import {
  TbArrowBadgeLeftFilled,
  TbArrowBadgeRightFilled,
} from "react-icons/tb";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";
import { MdRotate90DegreesCw } from "react-icons/md";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import PdfFullScreen from "./PdfFullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PdfRenderProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRenderProps) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [numberofPages, setNumberofPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numberofPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };

  const handleRotation = () => {
    if (rotation >= 360) {
      setRotation(0);
    } else {
      setRotation((prev) => prev + 90);
    }
  };

  return (
    <div className="w-full rounded-md bg-white shadow flex flex-col items-center">
      <div className="w-full h-14 border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <button
            className={`px-3 hover:bg-slate-100 rounded-md py-3 ${
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            } focus-visible:outline-blue-600`}
            disabled={currentPage === 1 || currentPage === undefined}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              setValue("page", String(currentPage - 1));
            }}
          >
            <TbArrowBadgeLeftFilled className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              {...register("page")}
              className={`w-10 h-8 flex text-center text-sm border-2 rounded-sm outline-blue-600 ${
                errors.page && "focus-visible:outline-red-600"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numberofPages ?? 0}</span>
            </p>
          </div>
          <button
            className={`px-3 hover:bg-slate-100 rounded-md py-3 ${
              currentPage === numberofPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } focus-visible:outline-blue-600`}
            disabled={
              currentPage === numberofPages || currentPage === undefined
            }
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setValue("page", String(currentPage + 1));
            }}
          >
            <TbArrowBadgeRightFilled className="h-5 w-5" />
          </button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" variant="ghost" aria-label="zoom">
                <FaSearch className="h-5 w-5" />
                {scale * 100}%<FaChevronDown className="h-3 w-3 opacity-20" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            aria-label="rotate 90 degrees"
            className="hover:bg-slate-100 p-2 rounded-md focus-visible:outline-blue-600"
            onClick={handleRotation}
          >
            <MdRotate90DegreesCw className="w-5 h-5" />
          </button>
          <PdfFullScreen fileUrl={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h[calc(100vh-10rem)]">
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
              file={url}
              className="max-h-full"
            >
              <Page
                width={width ? width : 1}
                scale={scale}
                pageNumber={currentPage}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
