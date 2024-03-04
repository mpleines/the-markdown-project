"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-2">
      <p>Sorry, something went wrong</p>
      <Button asChild variant="secondary">
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
}