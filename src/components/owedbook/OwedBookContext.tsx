"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createOwedBookService, owedBookService, type OwedBookService } from "@/services/owedbook";
import { isDemoMode, listTenantStores, type TenantStore } from "@/services/tenantScope";
import type { OwedBookFilters } from "@/types/OwedBook";
interface OwedBookCtx {
  filters: OwedBookFilters; pbmOptions: string[]; applyFilters: (f: OwedBookFilters) => void; clearFilters: () => void; appliedTick: number;
  service: OwedBookService; stores: TenantStore[]; storeId?: string; selectStore: (id:string) => void;
  scopeLoading: boolean; scopeError: string | null; scopeReady: boolean; optionsError: string | null; refreshTick: number; refresh: () => void;
}
export const countActiveFilters = (f: OwedBookFilters): number => (f.from?1:0)+(f.to?1:0)+(f.pbms.length?1:0)+(f.filter?1:0);
const EMPTY: OwedBookFilters={pbms:[]};
const OwedBookContext=createContext<OwedBookCtx>({filters:EMPTY,pbmOptions:[],applyFilters:()=>{},clearFilters:()=>{},appliedTick:0,service:owedBookService,stores:[],selectStore:()=>{},scopeLoading:false,scopeError:null,scopeReady:true,optionsError:null,refreshTick:0,refresh:()=>{}});
export const useOwedBook=()=>useContext(OwedBookContext);
export const OwedBookProvider=({children}:{children:ReactNode})=>{
 const demo=isDemoMode();
 const [filters,setFilters]=useState<OwedBookFilters>(EMPTY);
 const [appliedTick,setAppliedTick]=useState(0);
 const [stores,setStores]=useState<TenantStore[]>([]);
 const [storeId,setStoreId]=useState<string>();
 const [scopeLoading,setScopeLoading]=useState(!demo);
 const [scopeError,setScopeError]=useState<string|null>(null);
 const [refreshTick,setRefreshTick]=useState(0);
 const service=useMemo(()=>demo?owedBookService:createOwedBookService(storeId),[demo,storeId]);
 const request=useMemo(()=>({service,refreshTick}),[service,refreshTick]);
 const [options,setOptions]=useState<{request:typeof request;values:string[];error:string|null}|null>(null);
 useEffect(()=>{
  if(demo)return;
  let cancelled=false;
  listTenantStores().then(rows=>{if(!cancelled){setScopeError(null);setStores(rows);setStoreId(id=>rows.some(s=>s.id===id)?id:rows[0]?.id);setScopeLoading(false);}}).catch(()=>{if(!cancelled){setStores([]);setStoreId(undefined);setScopeError("Store access unavailable. Retry to reload your permitted stores.");setScopeLoading(false);}});
  return ()=>{cancelled=true;};
 },[demo,refreshTick]);
 const scopeReady=demo||!!storeId&&!scopeLoading&&!scopeError;
 useEffect(()=>{
  if(!scopeReady)return;
  let cancelled=false;
  service.getPbmOptions().then(values=>{if(!cancelled)setOptions({request,values,error:null});}).catch(()=>{if(!cancelled)setOptions({request,values:[],error:"PBM options unavailable. Retry refresh."});});
  return ()=>{cancelled=true;};
 },[service,request,scopeReady]);
 const applyFilters=useCallback((f:OwedBookFilters)=>{setFilters(f);setAppliedTick(t=>t+1);},[]);
 const clearFilters=useCallback(()=>applyFilters({pbms:[]}),[applyFilters]);
 const selectStore=useCallback((id:string)=>{if(!stores.some(s=>s.id===id))return;setStoreId(id);setFilters({pbms:[]});setOptions(null);setAppliedTick(t=>t+1);},[stores]);
 const refresh=useCallback(()=>setRefreshTick(t=>t+1),[]);
 return <OwedBookContext.Provider value={{filters,pbmOptions:scopeReady&&options?.request===request?options.values:[],applyFilters,clearFilters,appliedTick,service,stores,storeId,selectStore,scopeLoading,scopeError,scopeReady,optionsError:options?.request===request?options.error:null,refreshTick,refresh}}>{children}</OwedBookContext.Provider>;
};
