'use client'

import React,{useState,useEffect,useRef} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Menu,X,ChevronDown,Sparkles} from 'lucide-react'
import NavDropdown from './NavDropdown.jsx'
import NavNestedDropdown from './NavNestedDropdown.jsx'
import {useWebsiteContent} from '../website-editor/useWebsiteContent.js'
import {toggleSchoolSubmenu,schoolSubmenuId,navigationFocusTargets} from './navigation-state.js'

const Navbar=()=>{
  const websiteContent=useWebsiteContent()
  const [isOpen,setIsOpen]=useState(false)
  const [isScrolled,setIsScrolled]=useState(false)
  const [openDropdowns,setOpenDropdowns]=useState({})
  const [drawerTop,setDrawerTop]=useState(0)
  const navRef=useRef(null),drawerRef=useRef(null),toggleRef=useRef(null)
  const pathname=usePathname()
  const closeMenu=()=>{setIsOpen(false);setOpenDropdowns({})}
  const toggleDropdown=path=>setOpenDropdowns(previous=>toggleSchoolSubmenu(previous,path))
  const openMenu=()=>{setDrawerTop(Math.max(0,navRef.current?.getBoundingClientRect().bottom||0));setIsOpen(true);setOpenDropdowns({})}

  useEffect(()=>{
    const onScroll=()=>setIsScrolled(window.scrollY>24)
    onScroll();window.addEventListener('scroll',onScroll,{passive:true})
    return()=>window.removeEventListener('scroll',onScroll)
  },[])
  useEffect(()=>{setIsOpen(false);setOpenDropdowns({})},[pathname])
  useEffect(()=>{
    const outside=event=>{if(!navRef.current?.contains(event.target)&&!event.target.closest?.('[data-website-editor-ui]')){setOpenDropdowns({});setIsOpen(false)}}
    const escape=event=>{if(event.key==='Escape'&&!isOpen){setOpenDropdowns({});const popup=event.target.closest?.('[data-nav-popup]');if(popup)navRef.current?.querySelector(`[aria-controls="${popup.id}"]`)?.focus()}}
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
  },[isOpen])
  useEffect(()=>{
    if(!isOpen)return
    const previousOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    const reposition=()=>{
      if(window.innerWidth>=1440){setIsOpen(false);return}
      setDrawerTop(Math.max(0,navRef.current?.getBoundingClientRect().bottom||0))
    }
    const frame=window.requestAnimationFrame(()=>drawerRef.current?.querySelector('a[href],button')?.focus())
    const keyboard=event=>{
      if(event.target.closest?.('[data-website-editor-ui]'))return
      if(event.key==='Escape'){event.preventDefault();setIsOpen(false);setOpenDropdowns({});return}
      if(event.key!=='Tab')return
      const controls=navigationFocusTargets(drawerRef.current,null)
      const first=controls[0],last=controls.at(-1)
      if(!controls.includes(document.activeElement)){event.preventDefault();first?.focus()}
      else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }
    document.addEventListener('keydown',keyboard)
    window.addEventListener('resize',reposition)
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(reposition)
    if(navRef.current)observer?.observe(navRef.current)
    return()=>{
      document.body.style.overflow=previousOverflow
      document.removeEventListener('keydown',keyboard);window.removeEventListener('resize',reposition)
      observer?.disconnect();window.cancelAnimationFrame(frame);toggleRef.current?.focus()
    }
  },[isOpen])

  const navItems = [
    { label: websiteContent.value("global.navbar.nav-items.item1.label", 'Home'), path: websiteContent.value("global.navbar.nav-items.item1.path", '/') },
    {
      label: websiteContent.value("global.navbar.nav-items.item2.label", 'About'),
      path: '/about',
      dropdown: [
        { label: websiteContent.value("global.navbar.nav-items.item2.item1.label", 'Our Founders'), path: websiteContent.value("global.navbar.nav-items.item2.item1.path", '/about/founders') },
        { label: websiteContent.value("global.navbar.nav-items.item2.item2.label", 'Our Journey'), path: websiteContent.value("global.navbar.nav-items.item2.item2.path", '/about/journey') },
        { label: websiteContent.value("global.navbar.nav-items.item2.item3.label", 'Superiors'), path: websiteContent.value("global.navbar.nav-items.item2.item3.path", '/about/superiors') },
        { label: websiteContent.value("global.navbar.nav-items.item2.item4.label", 'Principal'), path: websiteContent.value("global.navbar.nav-items.item2.item4.path", '/about/principal') }
      ]
    },
    {
      label: websiteContent.value("global.navbar.nav-items.item3.label", 'Administration'),
      path: '/administration',
      dropdown: [
        { label: websiteContent.value("global.navbar.nav-items.item3.item1.label", 'Management'), path: websiteContent.value("global.navbar.nav-items.item3.item1.path", '/administration/management') },
        {
          label: websiteContent.value("global.navbar.nav-items.item3.item2.label", 'Teaching Staff'),
          path: '/administration/teaching-staff',
          nested: [
            { label: websiteContent.value("global.navbar.nav-items.item3.item2.item1.label", 'Primary School'), path: websiteContent.value("global.navbar.nav-items.item3.item2.item1.path", '/administration/teaching-staff/primary') },
            { label: websiteContent.value("global.navbar.nav-items.item3.item2.item2.label", 'Middle School'), path: websiteContent.value("global.navbar.nav-items.item3.item2.item2.path", '/administration/teaching-staff/middle') },
            { label: websiteContent.value("global.navbar.nav-items.item3.item2.item3.label", 'High School'), path: websiteContent.value("global.navbar.nav-items.item3.item2.item3.path", '/administration/teaching-staff/high') },
            { label: websiteContent.value("global.navbar.nav-items.item3.item2.item4.label", 'Higher Secondary'), path: websiteContent.value("global.navbar.nav-items.item3.item2.item4.path", '/administration/teaching-staff/higher-secondary') }
          ]
        },
        { label: websiteContent.value("global.navbar.nav-items.item3.item3.label", 'Non-Teaching Staff'), path: websiteContent.value("global.navbar.nav-items.item3.item3.path", '/administration/non-teaching') }
      ]
    },
    { label: websiteContent.value("global.navbar.nav-items.item4.label", 'Infrastructure'), path: websiteContent.value("global.navbar.nav-items.item4.path", '/infrastructure') },
    {
      label: websiteContent.value("global.navbar.nav-items.item5.label", 'Admissions'),
      path: websiteContent.value("global.navbar.nav-items.item5.path", '/admissions'),
      dropdown: [
        { label: websiteContent.value("global.navbar.nav-items.item5.item1.label", 'Admission Process'), path: websiteContent.value("global.navbar.nav-items.item5.item1.path", '/admissions') },
        { label: websiteContent.value("global.navbar.nav-items.item5.item2.label", 'Enquiry Form'), path: websiteContent.value("global.navbar.nav-items.item5.item2.path", '/admissions/inquiry') }
      ]
    },
    {
      label: websiteContent.value("global.navbar.nav-items.item6.label", 'Academics'),
      path: '/academics',
      dropdown: [
        { label: websiteContent.value("global.navbar.nav-items.item6.item1.label", 'Syllabus'), path: websiteContent.value("global.navbar.nav-items.item6.item1.path", '/academics/syllabus') },
        { label: websiteContent.value("global.navbar.nav-items.item6.item2.label", 'Evaluation System'), path: websiteContent.value("global.navbar.nav-items.item6.item2.path", '/academics/evaluation') }
      ]
    },
    { label: websiteContent.value("global.navbar.nav-items.item7.label", 'Student Rules'), path: websiteContent.value("global.navbar.nav-items.item7.path", '/student-rules') },
    {
      label: websiteContent.value("global.navbar.nav-items.item8.label", 'Activities'),
      path: '/extracurricular',
      dropdown: [
        { label: websiteContent.value("global.navbar.nav-items.item8.item1.label", 'Clubs & Associations'), path: websiteContent.value("global.navbar.nav-items.item8.item1.path", '/extracurricular/clubs') },
        { label: websiteContent.value("global.navbar.nav-items.item8.item2.label", 'Formative Moments'), path: websiteContent.value("global.navbar.nav-items.item8.item2.path", '/extracurricular/moments') }
      ]
    },
    { label: websiteContent.value("global.navbar.nav-items.item9.label", 'Gallery'), path: websiteContent.value("global.navbar.nav-items.item9.path", '/gallery') },
    { label: websiteContent.value("global.navbar.nav-items.item10.label", 'Contact'), path: websiteContent.value("global.navbar.nav-items.item10.path", '/contact') }
  ]

  const isActive=path=>path==='/'?pathname==='/':pathname.startsWith(path)
  const focusSubmenu=(event,path)=>{
    if(event.key!=='ArrowDown')return
    event.preventDefault();setOpenDropdowns(previous=>({...previous,[path]:true}))
    window.requestAnimationFrame(()=>document.getElementById(schoolSubmenuId(path))?.querySelector('a[href],button')?.focus())
  }
  return <nav ref={navRef} data-scrolled={isScrolled} className="school-navbar" aria-label="School navigation">
    <div className="school-nav-inner">
          <Link {...websiteContent.props(["global.navbar.navbar.href"])} href={websiteContent.value("global.navbar.navbar.href", "/")} className="school-brand flex items-center gap-3 group shrink-0">
            <div className={`relative transition-all duration-500 ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}>
              <div className="bg-linear-to-br from-maroon-700 to-maroon-900 p-2 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                <img {...websiteContent.imageProps(websiteContent.value("global.navbar.navbar.src", "/logo.jpeg"))} {...websiteContent.props(["global.navbar.navbar.src","global.navbar.navbar.alt"])}
                  src={websiteContent.value("global.navbar.navbar.src", "/logo.jpeg")}
                  alt={websiteContent.value("global.navbar.navbar.alt", "St. Mary's School Logo")}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="absolute -inset-1 bg-linear-to-r from-gold-400/20 to-maroon-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <h1 {...websiteContent.props(["global.navbar.navbar.heading"])} className={`font-display font-bold text-maroon-900 transition-all duration-300 tracking-tight ${
                isScrolled ? 'text-lg' : 'text-2xl'
              }`}>{websiteContent.value("global.navbar.navbar.heading", "St. Mary's")}<span className="inline-block ml-1">
                  <Sparkles size={12} className="text-gold-400 fill-gold-400 inline" />
                </span>
              </h1>
              <p {...websiteContent.props(["global.navbar.navbar.paragraph"])} className={`text-[13px] text-gray-700 leading-tight tracking-widest uppercase font-label transition-all duration-300 ${
                isScrolled ? 'text-[8px]' : ''
              }`}>{websiteContent.value("global.navbar.navbar.paragraph", "Higher Secondary School")}</p>
            </div>
          </Link>
      <div className="school-desktop-nav">
        {navItems.map(item=><div key={item.path} className="school-nav-item">
          {item.dropdown?<>
            <button type="button" className="school-nav-link" data-active={isActive(item.path)} onClick={()=>toggleDropdown(item.path)} onKeyDown={event=>focusSubmenu(event,item.path)} aria-expanded={!!openDropdowns[item.path]} aria-controls={schoolSubmenuId(item.path)}>
              <span {...websiteContent.propsFor(item.label)}>{item.label}</span><ChevronDown size={13} aria-hidden="true"/>
            </button>
            {item.dropdown.some(child=>child.nested)?<NavNestedDropdown items={item.dropdown} isOpen={!!openDropdowns[item.path]} openPaths={openDropdowns} onToggle={toggleDropdown} onNavigate={()=>setOpenDropdowns({})} id={schoolSubmenuId(item.path)} pathname={pathname}/>:<NavDropdown items={item.dropdown} isOpen={!!openDropdowns[item.path]} onNavigate={()=>setOpenDropdowns({})} id={schoolSubmenuId(item.path)} pathname={pathname}/>}
          </>:<Link href={item.path} aria-current={isActive(item.path)?'page':undefined} className="school-nav-link" data-active={isActive(item.path)}><span {...websiteContent.propsFor(item.label)}>{item.label}</span></Link>}
        </div>)}
      </div>
      <button ref={toggleRef} type="button" className="school-menu-toggle" aria-label={isOpen?'Close navigation':'Open navigation'} aria-expanded={isOpen} aria-controls="school-mobile-navigation" onClick={()=>isOpen?closeMenu():openMenu()}>
        <span className="school-menu-icon" data-open={isOpen}><Menu size={23} aria-hidden="true"/><X size={23} aria-hidden="true"/></span>
      </button>
    </div>
    <div className="school-drawer-backdrop" data-open={isOpen} aria-hidden="true" style={{top:drawerTop}} onClick={closeMenu}/>
    <div ref={drawerRef} id="school-mobile-navigation" className="school-mobile-drawer" data-open={isOpen} role={isOpen?'dialog':undefined} aria-modal={isOpen?true:undefined} aria-label="School navigation" aria-hidden={!isOpen} inert={!isOpen} style={{top:drawerTop}}>
      <div className="school-drawer-controls"><button type="button" onClick={closeMenu} aria-label="Close navigation"><X size={20} aria-hidden="true"/></button></div>
      <div className="school-mobile-links">
        {navItems.map(item=><div key={item.path} className="school-mobile-item">
          {item.dropdown?<>
            <button type="button" className="school-mobile-link" data-active={isActive(item.path)} onClick={()=>toggleDropdown(item.path)} aria-expanded={!!openDropdowns[item.path]} aria-controls={`mobile-${schoolSubmenuId(item.path)}`}>
              <span {...websiteContent.propsFor(item.label)}>{item.label}</span><ChevronDown size={17} aria-hidden="true"/>
            </button>
            <div id={`mobile-${schoolSubmenuId(item.path)}`} className="school-mobile-submenu" hidden={!openDropdowns[item.path]}>
              {item.dropdown.map(sub=><div key={sub.path}>
                {sub.nested?<>
                  <button type="button" className="school-mobile-link school-mobile-nested-trigger" onClick={()=>toggleDropdown(sub.path)} aria-expanded={!!openDropdowns[sub.path]} aria-controls={`mobile-${schoolSubmenuId(sub.path)}`}>
                    <span {...websiteContent.propsFor(sub.label)}>{sub.label}</span><ChevronDown size={15} aria-hidden="true"/>
                  </button>
                  <div id={`mobile-${schoolSubmenuId(sub.path)}`} className="school-mobile-submenu" hidden={!openDropdowns[sub.path]}>
                    {sub.nested.map(nested=><Link {...websiteContent.propsFor(nested.label)} key={nested.path} href={nested.path} className="school-mobile-link school-mobile-leaf" aria-current={isActive(nested.path)?'page':undefined} onClick={closeMenu}>{nested.label}</Link>)}
                  </div>
                </>:<Link {...websiteContent.propsFor(sub.label)} href={sub.path} className="school-mobile-link school-mobile-leaf" aria-current={isActive(sub.path)?'page':undefined} onClick={closeMenu}>{sub.label}</Link>}
              </div>)}
            </div>
          </>:<Link {...websiteContent.propsFor(item.label)} href={item.path} className="school-mobile-link" data-active={isActive(item.path)} aria-current={isActive(item.path)?'page':undefined} onClick={closeMenu}>{item.label}</Link>}
        </div>)}
            <div className="pt-4 mt-2 border-t border-dashed border-maroon-100/60">
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400 font-label">
                <span {...websiteContent.props(["global.navbar.navbar.text"])}>{websiteContent.value("global.navbar.navbar.text", "🏫 St. Mary's")}</span>
                <span className="w-px h-3 bg-gray-300" />
                <span {...websiteContent.props(["global.navbar.navbar.text.2"])}>{websiteContent.value("global.navbar.navbar.text.2", "📚 Guwahati")}</span>
              </div>
            </div>
  
      </div>
    </div>
  </nav>
}
export default Navbar
