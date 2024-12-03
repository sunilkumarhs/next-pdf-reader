"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import Image from "next/image";

import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { LoaderPinwheel, MessageSquare, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const utils = trpc.useContext();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-stone-200 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-stone-900">My Files</h1>
        <UploadButton />
      </div>

      {/* displaying user files */}

      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-stone-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-stone-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-stone-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 text-xs gap-6 text-stone-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteFile({ id: file.id })}
                  >
                    {currentlyDeletingFile === file.id ? (
                      <LoaderPinwheel className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={4} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Image
            src="/empty-bucket.png"
            alt="empty-section"
            width={300}
            height={100}
            quality={100}
          />
          <h3 className="font-semibold text-xl">PDF bucket store is empty!!</h3>
          <p>Let&apos;s fill your PDF bucket store by uploading first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
