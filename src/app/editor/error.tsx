'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from '@geist-ui/icons';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid place-items-center ">
      <div className="flex items-center gap-2 mt-4 mb-2">
        <AlertCircle size={16} />
        <span>Something went wrong!</span>
      </div>
      <Button asChild variant="secondary">
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
}
