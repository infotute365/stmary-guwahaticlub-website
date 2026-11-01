import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '../.tmp-ui-qa/node_modules/playwright/index.mjs';
const origin='http://localhost:3100';
const routes=JSON.parse(await fs.readFile('docs/website-editor/baseline/routes.json','utf8'));
const report={origin,viewports:[],interactions:{},pageErrors:[],consoleErrors:[],failedRequests:[]};
if(process.argv.includes('--interactions-only')){const previous=JSON.parse(await fs.readFile('docs/ui-redesign/browser-results.json','utf8'));for(const key of ['viewports','pageErrors','consoleErrors','failedRequests'])report[key]=previous[key];}
await fs.mkdir('docs/ui-redesign/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();page.setDefaultNavigationTimeout(60000);
page.on('pageerror',error=>report.pageErrors.push(error.message));
page.on('console',msg=>{if(msg.type()==='error')report.consoleErrors.push({url:page.url(),message:msg.text()})});
page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ERR_ABORTED'))report.failedRequests.push({url:r.url(),error:r.failure()?.errorText})});
const geometry=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,overflows:[...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main input,main button,main table,.school-nav-link,.school-desktop-nav,.school-brand,.school-contact-link,.school-notice-card')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&(r.right>innerWidth+1||r.left< -1)&&!el.closest('[inert],[aria-hidden=true],.overflow-x-auto')}).map(el=>({tag:el.tagName,text:el.textContent.slice(0,90),class:el.className})).slice(0,12)}));
try {
if(!process.argv.includes('--interactions-only'))for(const [width,height] of [[320,740],[360,800],[375,812],[390,844],[430,932],[768,1024],[820,1180],[1024,768],[1280,900],[1440,1000],[1920,1080],[844,390]]) {
 await page.setViewportSize({width,height});
 for(const route of routes){
  report.currentRoute={width,path:route.path};
  await fs.writeFile('docs/ui-redesign/browser-progress.json',JSON.stringify(report.currentRoute));
  let response=await page.goto(origin+route.path,{waitUntil:'domcontentloaded'});
  if(!response)response=await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('main').waitFor();
  await page.waitForFunction(()=>Object.keys(document.querySelector('.school-menu-toggle')||{}).some(k=>k.startsWith('__reactProps')));
  if(route.path==='/') await page.locator('.swiper-initialized').waitFor();
  await page.waitForLoadState('networkidle',{timeout:1000}).catch(()=>{});
  const row={route:route.path,width,height,status:response.status(),...await geometry()};
  report.viewports.push(row);
  if(route.path==='/'&&[320,390,820,1440,1920].includes(width))await page.screenshot({path:`docs/ui-redesign/screenshots/home-${width}.png`,fullPage:width===390});
 }
 console.log(JSON.stringify({width,height,routes:routes.length,issues:report.viewports.filter(x=>x.width===width&&(x.scroll>width||x.overflows.length)).map(x=>({route:x.route,scroll:x.scroll,overflows:x.overflows}))}));
 await fs.writeFile('docs/ui-redesign/browser-results.json',JSON.stringify(report,null,2));
}
await page.setViewportSize({width:390,height:844});await page.goto(origin,{waitUntil:'domcontentloaded'});
await page.locator('.swiper-initialized').waitFor();
const toggle=page.getByRole('button',{name:'Open navigation',exact:true});
await toggle.click();
await assert.doesNotReject(()=>page.getByRole('dialog',{name:'School navigation'}).waitFor());
assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
await page.screenshot({path:'docs/ui-redesign/screenshots/mobile-drawer-390.png'});await page.locator('.school-mobile-drawer').getByRole('button',{name:'Administration',exact:true}).click();
await page.locator('.school-mobile-drawer').getByRole('button',{name:'Teaching Staff',exact:true}).click();
await page.locator('.school-mobile-drawer').getByRole('link',{name:'Higher Secondary',exact:true}).click();
await page.waitForURL('**/administration/teaching-staff/higher-secondary',{waitUntil:'domcontentloaded'});
assert.equal(await page.getByRole('button',{name:'Open navigation',exact:true}).getAttribute('aria-expanded'),'false');
report.interactions.nestedMenuAndRouteClose='PASS';
await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.keyboard.press('Escape');
assert.equal(await page.getByRole('button',{name:'Open navigation',exact:true}).getAttribute('aria-expanded'),'false');
assert.equal(await page.evaluate(()=>document.activeElement.className),'school-menu-toggle');
report.interactions.escapeAndFocusReturn='PASS';
await page.setViewportSize({width:820,height:800});await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.locator('.school-drawer-backdrop').click({position:{x:20,y:20}});assert.equal(await page.getByRole('button',{name:'Open navigation',exact:true}).getAttribute('aria-expanded'),'false');
report.interactions.outsideClose='PASS';
await page.setViewportSize({width:320,height:740});
await page.locator('.school-fees-button').click();
assert.equal(await page.locator('#school-fee-options').isVisible(),true);
assert.deepEqual(await page.locator('#school-fee-options a').evaluateAll(nodes=>nodes.map(x=>x.href)),['https://epay.federalbank.co.in/easypayments/DIRECTPAYMENT.ASPX?CODE=DABB4QLY4Q1O4','https://eacademia.southindianbank.bank.in/feeuser/org?id=3037']);
const feeBox=await page.locator('#school-fee-options').boundingBox();assert.ok(feeBox.x>=0&&feeBox.x+feeBox.width<=320);
await page.keyboard.press('Escape');assert.equal(await page.locator('#school-fee-options').isVisible(),false);
report.interactions.paymentLinksAndPopup='PASS';
await page.goto(origin,{waitUntil:'domcontentloaded'});
await page.locator('.school-notice-list [role=button]').first().click();await page.getByRole('dialog',{name:'Editor QA fixture notice'}).waitFor();
assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
await page.screenshot({path:'docs/ui-redesign/screenshots/notice-modal-320.png'});
await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});assert.equal(await page.getByRole('dialog').count(),0);report.interactions.noticeModal='PASS';
await page.goto(origin+'/gallery',{waitUntil:'domcontentloaded'});await page.getByText('Fixture school photograph',{exact:true}).first().click();await page.getByRole('dialog').waitFor();
await page.getByRole('button',{name:'Next image',exact:true}).click();assert.ok(await page.getByRole('dialog').getAttribute('aria-label'));
await page.waitForFunction(()=>{const n=document.querySelector('.school-gallery-lightbox');return n&&Number(getComputedStyle(n).opacity)>.99&&n.querySelector('img').naturalWidth>0});await page.screenshot({path:'docs/ui-redesign/screenshots/gallery-lightbox-320.png'});
await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});assert.equal(await page.getByRole('dialog').count(),0);report.interactions.galleryMobileNavigation='PASS';
// Preserve the real API request: only this browser response is replaced to inspect
// the API-empty rendering branch; the populated branch above uses actual MongoDB.
await page.route('**/api/circulars**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
await page.goto(origin,{waitUntil:'domcontentloaded'});await page.getByText('No notices available',{exact:true}).waitFor();
assert.equal(await page.getByText('0 New',{exact:true}).count(),1);await page.locator('.school-notice-card').screenshot({path:'docs/ui-redesign/screenshots/notices-empty-320.png'});report.interactions.emptyNotices='PASS';
await page.unroute('**/api/circulars**');
// Long titles and a full list use a browser-only API fixture, without modifying MongoDB.
const longTitle='Long notice title '.repeat(30);
await page.route('**/api/circulars**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(Array.from({length:4},(_,i)=>({_id:'long-'+i,title:longTitle,content:'Notice content '.repeat(100),date:'2026-11-01'})))}));
await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.school-notice-list [role=button]').first().waitFor();
const longCard=await page.locator('.school-notice-card').boundingBox();assert.ok(longCard.x>=0&&longCard.x+longCard.width<=320);
const listSize=await page.locator('.school-notice-list').evaluate(n=>({client:n.clientHeight,scroll:n.scrollHeight}));assert.ok(listSize.client<=340&&listSize.scroll>listSize.client);
await page.locator('.school-notice-list [role=button]').first().click();const longDialog=page.getByRole('dialog');await longDialog.waitFor();const box=await longDialog.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=320&&box.height<=740);
await page.screenshot({path:'docs/ui-redesign/screenshots/notice-long-title-320.png'});await page.keyboard.press('Escape');await longDialog.waitFor({state:'detached'});report.interactions.longNotices='PASS';
await page.unroute('**/api/circulars**');
await page.setViewportSize({width:1440,height:1000});await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.swiper-initialized').waitFor();
const desktop=page.locator('.school-desktop-nav');await desktop.getByRole('button',{name:'Administration',exact:true}).click();await desktop.getByRole('button',{name:'Teaching Staff',exact:true}).click();await desktop.getByRole('link',{name:'Higher Secondary',exact:true}).click();await page.waitForURL('**/administration/teaching-staff/higher-secondary',{waitUntil:'domcontentloaded'});report.interactions.desktopNestedNavigation='PASS';
await desktop.getByRole('button',{name:'About',exact:true}).press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Our Founders');await page.keyboard.press('Escape');report.interactions.desktopKeyboardDropdown='PASS';
await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.swiper-initialized').waitFor();
const beforeHeight=await page.locator('.school-hero-grid').evaluate(n=>n.getBoundingClientRect().height);
await page.locator('.swiper-pagination-bullet').nth(1).click();
const visibleStates=await page.evaluate(async()=>{const result=[];for(let i=0;i<12;i++){await new Promise(requestAnimationFrame);result.push([...document.querySelectorAll('.school-hero-copy')].filter(n=>getComputedStyle(n).visibility!=='hidden').length)}return result});
assert.ok(visibleStates.every(count=>count===1));assert.equal(await page.locator('.school-hero-grid').evaluate(n=>n.getBoundingClientRect().height),beforeHeight);report.interactions.singleVisibleCarouselState='PASS';
report.hydrationErrors=report.consoleErrors.filter(row=>/hydration|hydrated|did not match|minified React error/i.test(typeof row==='string'?row:row.message));assert.equal(report.hydrationErrors.length,0);
report.status=report.viewports.every(x=>x.status===200&&x.scroll<=x.width&&x.overflows.length===0)&&report.pageErrors.length===0?'PASS':'FAIL';
} catch(error){report.status='FAIL';report.error=error.stack;console.error(error);process.exitCode=1}
finally {await fs.writeFile('docs/ui-redesign/browser-results.json',JSON.stringify(report,null,2));await browser.close()}
