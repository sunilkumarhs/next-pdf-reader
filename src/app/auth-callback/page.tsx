/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { LuLoaderPinwheel } from "react-icons/lu";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { data, isError, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });
  useEffect(() => {
    if (data) {
      if (data.success) {
        //user synced to DB
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    }
  }, [data]);
  useEffect(() => {
    if (isError) {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/");
      }
    }
  }, [isError]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <LuLoaderPinwheel className="h-10 w-10 animate-spin text-zinc-800" />
        <h3 className="font-bold text-stone-800 text-xl">
          Setting up your account.....
        </h3>
        <p className="text-lg text-stone-600">
          You will be redirected automatically.
        </p>
      </div>
    </div>
  );
};

export default Page;
