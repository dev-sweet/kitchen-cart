import { Suspense } from 'react';
import ShopPage from './shop';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}