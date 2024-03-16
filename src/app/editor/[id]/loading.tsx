import { Skeleton } from '@/components/ui/skeleton';

export default async function Loading() {
  return (
    <section className="pl-4">
    {Array.from(Array(5).keys()).map(item => (
      <Skeleton key={item} className="mt-2 w-full h-[40px]"/>
    ))}
    </section>
  );
}
