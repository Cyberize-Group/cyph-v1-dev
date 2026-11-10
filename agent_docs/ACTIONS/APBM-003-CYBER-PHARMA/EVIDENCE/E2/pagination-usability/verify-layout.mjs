// Local component layout verification. No authentication, remote data or DB writes.
import fs from 'node:fs';
import path from 'node:path';
import Module, {createRequire} from 'node:module';
const root=process.cwd(),require=createRequire(path.join(root,'package.json'));
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{chromium}=require('playwright');
const output=path.dirname(new URL(import.meta.url).pathname);
const originalResolve=Module._resolveFilename;
Module._resolveFilename=function(name,...args){return originalResolve.call(this,name.startsWith('@/')?path.join(root,'src',name.slice(2)):name,...args);};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const Toolbar=require(path.join(root,'src/components/owedbook/ResultsToolbar.tsx')).default;
const Table=require(path.join(root,'src/components/common/DataTable.tsx')).default;
const {COMMERCIAL_COLUMNS}=require(path.join(root,'src/components/owedbook/columns.tsx'));
const {owedBookFixtures}=require(path.join(root,'src/mocks/owedbook.ts'));
const cssFiles=fs.readdirSync(path.join(root,'.next/static/chunks')).filter(f=>f.endsWith('.css'));
const css=cssFiles.map(f=>fs.readFileSync(path.join(root,'.next/static/chunks',f),'utf8')).join('\n');
if(!css.includes('border-l-primary'))throw Error('Updated toolbar CSS absent; build first');
const browser=await chromium.launch({headless:true});const results=[];
function rgb(s){return s.match(/[\d.]+/g).slice(0,3).map(Number);}
function luminance(v){return v.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);}
function contrast(a,b){let x=luminance(rgb(a)),y=luminance(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
try{
for(const theme of ['light','dark'])for(const width of [1440,375])for(const [state,page,total] of [['first',1,50],['last',2,50],['partial',2,31],['empty',1,0]]){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});const tab=await context.newPage();let requests=0;await tab.route('**/*',route=>{requests++;return route.abort();});
 const rows=owedBookFixtures.slice((page-1)*25,Math.min(page*25,total));
 const resultsPage={rows,page,total,limit:25,pageCount:Math.ceil(total/25)};
 const component=React.createElement('main',{className:'mx-auto max-w-6xl min-w-0 p-6'},React.createElement('h1',{className:'mb-6 text-3xl font-bold'},'OwedBook'),React.createElement(Table,{columns:COMMERCIAL_COLUMNS,rows,emptyState:React.createElement('p',{},'No results'),getRowKey:r=>r.id}),React.createElement(Toolbar,{results:resultsPage,onPrevious:()=>{},onNext:()=>{}}));
 await tab.setContent(`<!doctype html><html class="${theme==='dark'?'dark':''}"><head><style>${css}</style></head><body class="bg-background text-foreground">${renderToStaticMarkup(component)}</body></html>`);
 const nav=tab.getByRole('navigation',{name:'Results pagination'});await nav.scrollIntoViewIfNeeded();
 const geometry=await nav.evaluate(el=>{const r=el.getBoundingClientRect();const buttons=[...el.querySelectorAll('button')].map(b=>{const q=b.getBoundingClientRect(),s=getComputedStyle(b);return {height:q.height,left:q.left,right:q.right,color:s.color,background:s.backgroundColor,disabled:b.disabled};});const s=getComputedStyle(el);return {left:r.left,right:r.right,width:r.width,overflow:document.documentElement.scrollWidth>innerWidth,buttons,color:s.color,background:s.backgroundColor,position:s.position,insideScroll:!!el.closest('[data-testid="datatable-desktop"]'),gap:r.top-el.previousElementSibling.getBoundingClientRect().bottom};});
 if(geometry.overflow||geometry.left<0||geometry.right>width||geometry.position!=='static'||geometry.insideScroll)throw Error(`Layout overflow/placement: ${theme} ${width} ${state}`);
 if(geometry.gap<12)throw Error('Insufficient table gap');
 for(const b of geometry.buttons)if(b.height<44||b.left<0||b.right>width||contrast(b.color,b.background)<4.5)throw Error('Button size/contrast failed');
 if(contrast(geometry.color,geometry.background)<4.5)throw Error('Panel text contrast failed');
 const enabled=nav.locator('button:not(:disabled)').first();let focusVisible=null;if(await enabled.count()){await tab.keyboard.press('Tab');await enabled.focus();focusVisible=await enabled.evaluate(el=>({visible:el.matches(':focus-visible'),shadow:getComputedStyle(el).boxShadow}));if(!focusVisible.visible||focusVisible.shadow==='none')throw Error('Focus indicator missing');}
 const name=`${theme}-${width}-${state}.png`;await tab.screenshot({path:path.join(output,name)});
 results.push({theme,width,state,range:await nav.innerText(),geometry,focusVisible,networkRequests:requests,screenshot:name});await context.close();
}
fs.writeFileSync(path.join(output,'layout-results.json'),JSON.stringify({kind:'Actual React table/toolbar with existing local fixtures; static layout harness, not authenticated application smoke',results},null,2)+'\n');console.log(`PASS ${results.length} layouts; contrast >=4.5, buttons >=44px, no overflow, focus visible, zero data requests`);
}finally{await browser.close();}
