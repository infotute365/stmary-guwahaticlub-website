'use client'

import React from 'react'
import Link from 'next/link'

const NavDropdown = ({ items, isOpen = false, onNavigate = () => {}, id, pathname }) => {
  return (
    <div id={id} data-nav-popup="true" hidden={!isOpen} className="school-nav-popup">
      <div className="school-nav-popup-surface">
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            aria-current={pathname===item.path?'page':undefined}
            className="school-nav-popup-link"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavDropdown
