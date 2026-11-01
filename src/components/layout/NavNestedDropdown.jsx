'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {schoolSubmenuId} from './navigation-state.js'

const NavNestedDropdown = ({ items, isOpen = false, openPaths = {}, onToggle = () => {}, onNavigate = () => {}, id, pathname }) => {
  return (
    <div id={id} data-nav-popup="true" hidden={!isOpen} className="school-nav-popup">
      <div className="school-nav-popup-surface">
        {items.map((item) => (
          <div key={item.path} className="relative group/sub">
            {item.nested ? (
              <>
                <button
                  type="button"
                  onClick={() => onToggle(item.path)}
                  aria-expanded={!!openPaths[item.path]}
                  aria-controls={schoolSubmenuId(item.path)}
                  className="school-nav-popup-link school-nav-popup-trigger"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <div id={schoolSubmenuId(item.path)} hidden={!openPaths[item.path]} className="school-nav-nested">
                  <div>
                    {item.nested.map((nested) => (
                      <Link
                        key={nested.path}
                        href={nested.path}
                        onClick={onNavigate}
                        aria-current={pathname===nested.path?'page':undefined}
                        className="school-nav-popup-link"
                      >
                        {nested.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={item.path}
                onClick={onNavigate}
                aria-current={pathname===item.path?'page':undefined}
                className="school-nav-popup-link"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NavNestedDropdown
