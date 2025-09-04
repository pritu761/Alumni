import { Suspense } from 'react';
import { AdvancedSearch } from '@/components/AdvancedSearch';

function SearchPageContent() {
  return <AdvancedSearch />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
