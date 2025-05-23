
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PageLoading: React.FC = () => (
  <div className="w-full h-full min-h-[50vh] flex flex-col space-y-4 p-8">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full mx-auto" />
    <Skeleton className="h-8 w-2/4 mx-auto" />
    <Skeleton className="h-32 w-5/6 mx-auto" />
  </div>
);

export default PageLoading;
