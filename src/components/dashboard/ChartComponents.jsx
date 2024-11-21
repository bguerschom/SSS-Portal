import React, { Suspense } from 'react';
import { Loader } from 'lucide-react';

// Lazy load the charts
const Charts = React.lazy(() => import('./Charts'));

const LoadingSpinner = () => (
  <div className="h-[400px] flex items-center justify-center">
    <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
  </div>
);

export const ChartComponents = ({ timelineData, statusData, senderData }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Charts 
      timelineData={timelineData}
      statusData={statusData}
      senderData={senderData}
    />
  </Suspense>
);

export default ChartComponents;
