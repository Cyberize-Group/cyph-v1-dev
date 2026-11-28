"use client";
import { isDemoMode } from "@/services/tenantScope";
import { useOwedBook } from "./OwedBookContext";
export default function StoreSelector(){
 const {stores,storeId,selectStore,scopeLoading,scopeError,refresh}=useOwedBook();
 if(isDemoMode())return <p className="text-xs text-muted-foreground">Synthetic demo data</p>;
 if(scopeError)return <div role="alert" className="pb-notice pb-tone-destructive text-sm"><p className="font-semibold">{scopeError}</p> <button onClick={refresh} className="pb-link mt-1 min-h-11">Retry stores</button></div>;
 return <label className="flex flex-col gap-1 text-[13px] font-medium text-muted-foreground">Store<select aria-label="Store" value={storeId??""} disabled={scopeLoading||!stores.length} onChange={e=>selectStore(e.target.value)} className="min-h-11 rounded-md border border-input bg-card px-2.5 py-2 text-[15px] text-foreground">{/* ABM007_FINAL FINAL-01 (AC-F01): the placeholder exists only while loading or when there are no permitted stores, never beside selectable stores. */}{(scopeLoading||!stores.length)&&<option value="" disabled>{scopeLoading?"Loading stores…":"No permitted stores"}</option>}{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>;
}
