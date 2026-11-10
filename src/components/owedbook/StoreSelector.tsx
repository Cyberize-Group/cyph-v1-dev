"use client";
import { isDemoMode } from "@/services/tenantScope";
import { useOwedBook } from "./OwedBookContext";
export default function StoreSelector(){
 const {stores,storeId,selectStore,scopeLoading,scopeError,refresh}=useOwedBook();
 if(isDemoMode())return <p className="text-xs text-muted-foreground">Synthetic demo data</p>;
 if(scopeError)return <div role="alert">{scopeError} <button onClick={refresh}>Retry stores</button></div>;
 return <label className="flex flex-col gap-1 text-sm">Store<select aria-label="Store" value={storeId??""} disabled={scopeLoading||!stores.length} onChange={e=>selectStore(e.target.value)} className="border bg-background p-2"><option value="" disabled>{scopeLoading?"Loading stores…":"No permitted stores"}</option>{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>;
}
