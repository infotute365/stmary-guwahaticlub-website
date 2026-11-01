'use client'
import {MotionConfig} from 'framer-motion'
export default function SchoolMotion({children}){
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
