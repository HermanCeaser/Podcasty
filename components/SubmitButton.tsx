"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitProps = {
    isLastStep: boolean
}

export function SubmitButton({isLastStep}: SubmitProps) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-3">
      <Button
        type="submit"
        disabled={pending}
      >
        {pending ? "saving..." : isLastStep ? "Finish": "Next"}
      </Button>
    </div>
  );
}
