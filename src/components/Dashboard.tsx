"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import Image from "next/image";

import Skeleton from "react-loading-skeleton";

const Dashboard = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-stone-200 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-stone-900">My Files</h1>
        <UploadButton />
      </div>

      {/* displaying user files */}

      {files && files?.length !== 0 ? (
        <div></div>
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
