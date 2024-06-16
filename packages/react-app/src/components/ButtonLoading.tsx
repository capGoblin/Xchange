import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="h-10 w-2/4 border-spacing-2 rounded-md animate-spin" />
      Please wait a min
    </Button>
  );
}
