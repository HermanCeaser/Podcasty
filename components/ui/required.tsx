import * as React from "react";

import { cn } from "@/lib/utils";

export interface RequiredProps
  extends React.HTMLAttributes<HTMLElement> {}

const Required = React.forwardRef<HTMLElement, RequiredProps>(
  ({ className, ...props }, ref) => {
    return (
      <small
        className={cn(
          "text-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Required.displayName = "Required";

export { Required };
