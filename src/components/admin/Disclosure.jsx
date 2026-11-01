'use client'

import React,{useCallback,useEffect,useRef,useState} from 'react'
import {Plus,Edit,Trash2,X,FileText} from 'lucide-react'
import {getDisclosures,createDisclosure,updateDisclosure,deleteDisclosure,uploadPDF,getFileUrl} from '../../services/api.js'

const empty=()=>({title:'',description:'',status:'Pending',expiryDate:'',isPublished:false,fileUrl:'',file:null})
export default function Disclosure(){
  const [records,setRecords]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[message,setMessage]=useState('')
  const [selected,setSelected]=useState(null),[form,setForm]=useState(empty),[open,setOpen]=useState(false),[busy,setBusy]=useState(false)
  const lock=useRef(false),dialog=useRef(null),opener=useRef(null)
  const load=useCallback(async()=>{
    setLoading(true)
    try{setRecords(await getDisclosures(true));setError('');return true}
    catch(failure){setError(failure.response?.data?.message||failure.message||'Could not load disclosures.');return false}
    finally{setLoading(false)}
  },[])
  useEffect(()=>{void load()},[load])
  useEffect(()=>{
    if(!open)return
    const previous=document.activeElement
    dialog.current?.querySelector('input')?.focus()
    const onKey=event=>{
      if(event.key==='Escape'&&!lock.current){event.preventDefault();setOpen(false)}
      if(event.key!=='Tab')return
      const nodes=[...dialog.current.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled])')]
      const first=nodes[0],last=nodes.at(-1)
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }
    document.addEventListener('keydown',onKey)
    return()=>{document.removeEventListener('keydown',onKey);if(previous?.isConnected)previous.focus();else opener.current?.focus()}
  },[open])
  const edit=record=>{
    setSelected(record||null);setForm(record?{title:record.title,description:record.description||'',status:record.status,expiryDate:record.expiryDate?.slice(0,10)||'',isPublished:record.isPublished,fileUrl:record.fileUrl,file:null}:empty())
    setMessage('');setError('');setOpen(true)
  }
  const change=event=>setForm(previous=>({...previous,[event.target.name]:event.target.type==='checkbox'?event.target.checked:event.target.value}))
  const save=async event=>{
    event.preventDefault()
    if(lock.current)return
    lock.current=true;setBusy(true);setError('');setMessage('')
    try{
      let fileUrl=form.fileUrl
      if(form.file){fileUrl=(await uploadPDF(form.file,'disclosure')).path;setForm(previous=>({...previous,fileUrl,file:null}))}
      if(!fileUrl)throw new Error('Choose a PDF document.')
      const payload={title:form.title,description:form.description,status:form.status,expiryDate:form.expiryDate||null,isPublished:form.isPublished,fileUrl}
      if(selected)await updateDisclosure(selected._id,{...payload,expectedVersion:selected.version})
      else await createDisclosure(payload)
      setOpen(false);setMessage('Disclosure saved.');await load()
    }catch(failure){setError(failure.response?.data?.message||failure.message||'Could not save disclosure.')}
    finally{lock.current=false;setBusy(false)}
  }
  const remove=async record=>{
    if(lock.current||!window.confirm(`Delete “${record.title}”? The uploaded PDF will be retained.`))return
    lock.current=true;setBusy(true);setError('');setMessage('')
    try{await deleteDisclosure(record._id,record.version);setMessage('Disclosure deleted.');await load()}
    catch(failure){setError(failure.response?.data?.message||'Could not delete disclosure.')}
    finally{lock.current=false;setBusy(false)}
  }
  const input='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500'
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div><h2 className="text-2xl font-serif font-bold text-maroon-800">Disclosure</h2><p className="text-gray-500 text-sm">Manage existing certificates and disclosure PDFs.</p></div>
      <button ref={opener} type="button" onClick={()=>edit(null)} disabled={busy||loading} className="flex items-center gap-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 disabled:opacity-50"><Plus size={18}/>Add Disclosure</button>
    </div>
    {!open&&error&&<div role="alert" className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error} <button type="button" onClick={load} disabled={busy} className="underline">Reload records</button></div>}
    {message&&<p role="status" className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">{message}</p>}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      {loading?<p role="status" className="p-6 text-gray-500">Loading disclosures…</p>:records.length===0?<div className="p-12 text-center text-gray-400"><FileText size={36} className="mx-auto mb-3"/>No disclosures yet.</div>:<table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">Document</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Visibility</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{records.map(record=><tr key={record._id} className="border-t border-gray-100"><td className="px-4 py-3"><a href={getFileUrl(record.fileUrl)} target="_blank" rel="noopener noreferrer" className="font-medium text-maroon-700 underline">{record.title}</a>{record.expiryDate&&<p className="mt-1 text-xs text-gray-500">Expires: {record.expiryDate.slice(0,10)}</p>}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3">{record.isPublished?'Published':'Draft'}</td><td className="px-4 py-3"><div className="flex gap-3"><button type="button" onClick={()=>edit(record)} disabled={busy} aria-label={`Edit ${record.title}`} className="text-maroon-700"><Edit size={18}/></button><button type="button" onClick={()=>remove(record)} disabled={busy} aria-label={`Delete ${record.title}`} className="text-red-600"><Trash2 size={18}/></button></div></td></tr>)}</tbody></table>}
    </div>
    {open&&<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="disclosure-form-title" className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-5"><h3 id="disclosure-form-title" className="font-serif text-xl font-bold text-maroon-800">{selected?'Edit Disclosure':'Add Disclosure'}</h3><button type="button" onClick={()=>setOpen(false)} disabled={busy} aria-label="Close disclosure form"><X size={22}/></button></div>
      {error&&<p role="alert" className="mb-4 text-red-700">{error}</p>}
      <form onSubmit={save} className="space-y-4"><fieldset disabled={busy} className="space-y-4">
        <label className="block text-sm font-medium">Title<input name="title" value={form.title} onChange={change} required maxLength={200} className={input}/></label>
        <label className="block text-sm font-medium">Description<textarea name="description" value={form.description} onChange={change} maxLength={5000} rows={3} className={input}/></label>
        <label className="block text-sm font-medium">Certificate status<select name="status" value={form.status} onChange={change} className={input}>{['Pending','Valid','Active','Expired'].map(value=><option key={value}>{value}</option>)}</select></label>
        <label className="block text-sm font-medium">Expiry date (optional)<input type="date" name="expiryDate" value={form.expiryDate} onChange={change} className={input}/></label>
        <label className="block text-sm font-medium">PDF document<input type="file" accept="application/pdf,.pdf" required={!form.fileUrl} onChange={event=>setForm(previous=>({...previous,file:event.target.files?.[0]||null}))} className={input}/></label>
        {form.fileUrl&&<a href={getFileUrl(form.fileUrl)} target="_blank" rel="noopener noreferrer" className="block text-sm text-maroon-700 underline">View saved PDF</a>}
        <p className="text-xs text-gray-500">PDF only, up to 15 MiB. Use the school's actual document; no sample certificates are created.</p>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={change}/><span>Publish on the existing disclosure page after reviewing the document and its details.</span></label>
      </fieldset><div className="flex justify-end gap-3 pt-3"><button type="button" onClick={()=>setOpen(false)} disabled={busy} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" disabled={busy} className="px-4 py-2 bg-maroon-700 text-white rounded-lg disabled:opacity-50">{busy?'Saving…':'Save Disclosure'}</button></div></form>
    </section></div>}
  </div>
}
