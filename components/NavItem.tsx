import Link from "next/link";
import React, { ReactElement } from "react";

const NavItem: React.FC<{
  href: string;
  isActive?: boolean;
  children: string | ReactElement;
  onClick: any;
}> = ({ href, isActive, children, onClick }) => {
    
  const handleClick = onClick.bind(null, href);
  return (
    <li>
      <Link
        href={href}
        className={`block px-3 py-2 rounded-sm hover:bg-primary/95 hover:text-primary-foreground hover:border-none ${
          isActive
            ? "bg-primary text-primary-foreground"
            : " border border-primary-300"
        }`}
        onClick={handleClick}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
