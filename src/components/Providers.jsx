'use client'

import { AuthProvider } from '../context/AuthContext.jsx'
import WebsiteEditorProvider from './website-editor/WebsiteEditorProvider.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children, publishedContent = {} }) {
  return (
    <AuthProvider>
      <WebsiteEditorProvider initialPublished={publishedContent}>{children}</WebsiteEditorProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}
