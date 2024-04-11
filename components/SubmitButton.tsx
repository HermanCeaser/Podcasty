"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-3">
      <Button
        type="submit"
        disabled={pending}
      >
        {pending ? "saving..." : "Save"}
      </Button>
    </div>
  );
}
