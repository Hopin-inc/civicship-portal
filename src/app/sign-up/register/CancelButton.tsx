"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

const CancelButton: React.FC = () => {
  const router = useRouter();
  const cookies = useCookies();

  const cancel: MouseEventHandler = async (e) => {
    e.preventDefault();
    await auth.signOut();
    cookies.remove("access_token");
    router.push("/");
  };

  return (
    <Link href="/" onClick={cancel} className="inline-flex">
      <ChevronLeft />
      トップに戻る
    </Link>
  );
};

export default CancelButton;
