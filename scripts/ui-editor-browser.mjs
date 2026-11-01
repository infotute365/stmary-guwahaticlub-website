import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '../.tmp-ui-qa/node_modules/playwright/index.mjs';
const localOrigin='http://localhost:3100';
const origin='https://fixture-school.example.test';
const proxy=async context=>context.route(origin+'/**',async route=>{const url=new URL(route.request().url());let response;
if((route.request().headers()['content-type']||'').startsWith('multipart/form-data')){
 const headers={...await route.request().allHeaders()};delete headers['content-type'];delete headers['content-length'];
 // Chromium's intercepted multipart body omits local file bytes. Forward the
 // exact known fixture selected below; production source and API stay intact.
 response=await context.request.fetch(localOrigin+url.pathname+url.search,{method:route.request().method(),headers,multipart:{image:{name:'logo.jpeg',mimeType:'image/jpeg',buffer:await fs.readFile('public/logo.jpeg')}}});
}else response=await route.fetch({url:localOrigin+url.pathname+url.search,timeout:60000});
await route.fulfill({response})});
const report={actions:{},viewports:[],errors:[]};
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await proxy(context);
const page=await context.newPage();page.setDefaultNavigationTimeout(60000);page.on('pageerror',error=>report.errors.push(error.message));
const ui=page.locator('[data-website-editor-ui]');
const fieldKey='home.hero-carousel.slides.item1.title';
const field=page.locator(`[data-website-field="${fieldKey}"]`);
try{
const initialSession=page.waitForResponse(r=>r.url()===origin+'/api/auth/session',{timeout:60000}).catch(error=>({error:error.message}));await page.goto(origin+'/login',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>Object.keys(document.querySelector('form')||{}).some(k=>k.startsWith('__reactProps')),{},{timeout:15000});await initialSession;await page.locator('input[type=email]').fill('editor-fixture@example.test');await page.locator('input[type=password]').fill('Fixture-Editor-Only-Aa123!');await page.getByRole('button',{name:'Sign In',exact:true}).click();await page.waitForURL('**/admin/dashboard',{waitUntil:'domcontentloaded'});report.actions.login='PASS';console.log('login PASS');
await page.evaluate(async keys=>{for(const key of keys){const state=(await (await fetch('/api/website-content?path=/')).json()).overrides?.[key];if(state){const response=await fetch('/api/website-content/'+key+'/reset',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({expectedRevision:state.revision})});if(!response.ok)throw Error('Fixture reset failed')}}},[fieldKey,'global.navbar.navbar.src']);
await page.getByRole('link',{name:'Edit Website',exact:true}).click();await ui.waitFor();await field.waitFor();report.actions.editWebsite='PASS';console.log('Edit Website PASS');
await field.click();const original=await ui.getByLabel('Content',{exact:true}).inputValue();await ui.getByLabel('Content',{exact:true}).fill('Disposable cancel verification');await ui.getByRole('button',{name:'Cancel',exact:true}).click();assert.ok((await field.textContent()).includes(original));report.actions.cancel='PASS';
await field.click();await ui.getByLabel('Content',{exact:true}).fill('Disposable browser save verification');await ui.getByRole('button',{name:'Save',exact:true}).click();await ui.getByText('All changes saved',{exact:true}).waitFor();
const publicContext=await browser.newContext();await proxy(publicContext);const visitor=await publicContext.newPage();await visitor.goto(origin,{waitUntil:'domcontentloaded'});await visitor.locator('.school-hero-heading').filter({hasText:'Disposable browser save verification'}).first().waitFor();assert.equal(await visitor.locator('[data-website-editor-ui],[data-website-field]').count(),0);await publicContext.close();report.actions.saveAndFreshAnonymousRead='PASS';console.log('save and anonymous read PASS');
await ui.getByRole('button',{name:'Restore original content',exact:true}).click();await field.filter({hasText:original}).waitFor();await ui.getByText('All changes saved',{exact:true}).waitFor();assert.ok((await field.textContent()).includes(original));report.actions.restoreOriginal='PASS';
await ui.getByRole('button',{name:'Close editing panel',exact:true}).click();
// Every viewport retains usable editor controls and a reachable field panel.
for(const width of [320,360,375,390,430,768,820,1024,1280,1440,1920]){
 await page.setViewportSize({width,height:width<768?844:1000});
 await ui.getByRole('button',{name:'Edit fields',exact:true}).click();
 await ui.getByRole('region',{name:'Editable fields on this page'}).waitFor();
 const geometry=await ui.evaluate(root=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflows:[...root.querySelectorAll('button,input,section')].filter(n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&(r.left< -1||r.right>innerWidth+1)}).map(n=>({tag:n.tagName,text:n.textContent.slice(0,70)}))}));
 report.viewports.push(geometry);
 await ui.getByRole('button',{name:'Close fields list',exact:true}).click();
 await ui.getByRole('button',{name:'Preview website without editing controls',exact:true}).click();await page.getByRole('button',{name:'Return to website editing',exact:true}).waitFor();assert.equal(await page.locator('[data-website-field]').count(),0);await page.getByRole('button',{name:'Return to website editing',exact:true}).click();await field.waitFor();
 if([320,390,1440].includes(width)){await field.press('Enter');await page.screenshot({path:`docs/ui-redesign/screenshots/editor-${width}.png`});await ui.getByRole('button',{name:'Cancel',exact:true}).click();}
 console.log('editor viewport',width);
}
report.actions.previewAtEveryViewport='PASS';
await page.setViewportSize({width:390,height:844});await page.locator('.school-brand img').click();
await ui.getByLabel('Upload a replacement',{exact:false}).setInputFiles('public/logo.jpeg');
await ui.getByRole('button',{name:'Save',exact:true}).click();await ui.getByText('All changes saved',{exact:true}).waitFor();
assert.ok((await page.locator('.school-brand img').getAttribute('src')).startsWith('/uploads/website/'));report.actions.imageUploadAndSave='PASS';
await ui.getByRole('button',{name:'Restore original content',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.school-brand img')?.getAttribute('src')==='/logo.jpeg');await ui.getByText('All changes saved',{exact:true}).waitFor();assert.equal(await page.locator('.school-brand img').getAttribute('src'),'/logo.jpeg');report.actions.imageRestored='PASS';
await ui.getByRole('button',{name:'Exit Editor',exact:true}).click();await page.waitForURL('**/admin/dashboard',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('[data-website-editor-ui]').count(),0);report.actions.exit='PASS';
report.status=report.viewports.every(x=>x.scroll<=x.width&&!x.overflows.length)&&!report.errors.length?'PASS':'FAIL';
}catch(e){report.status='FAIL';report.error=e.stack;console.error(e);await page.screenshot({path:'docs/ui-redesign/screenshots/editor-failure.png'}).catch(()=>{});process.exitCode=1}
finally{await fs.writeFile('docs/ui-redesign/editor-browser-results.json',JSON.stringify(report,null,2));await browser.close()}
