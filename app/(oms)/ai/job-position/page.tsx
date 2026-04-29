import { Suspense } from "react";
import { AIJobPositionPage } from "@/components/ai/AIJobPositionPage";

export default function Page() {
  return (
    <Suspense>
      <AIJobPositionPage />
    </Suspense>
  );
}
