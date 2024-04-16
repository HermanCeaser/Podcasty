'use client'

import React, { useState } from 'react'
import Nav from './Nav';
import NavItem from './NavItem';

const Navbar = () => {
    const [activeLink, setActiveLink] = useState("/"); // State to track active link

    // Function to handle click on a nav item
    const handleNavItemClick = (href: string) => {
      setActiveLink(href);
    };

    // Data array containing nav items
    const navItems = [
      { href: "/", label: "New Releases" },
      { href: "/top", label: "Top Rated" },
      { href: "/podcasts/create", label: "Create Podcast" },
    ];

    return (
      <div>
        <Nav>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              isActive={activeLink === item.href} // Check if the current item is active
              onClick={handleNavItemClick} // Pass click handler
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </div>
    );
}

export default Navbar
