/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

const Page = async () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }: any) => {
      if (success) {
        //user synced to DB
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (err: any) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });
};

export default Page;
