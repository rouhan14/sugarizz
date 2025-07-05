import React, { Suspense } from "react";
import ThankYouClient from "@/components/thankyou/ThankYouClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
