import { createOwedBookService } from "@/services/owedbook";
import { canAdminister, listTenantStores } from "@/services/tenantScope";
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const filters={from:"2026-01-01",to:"2026-01-31",pbms:["SYNTHETIC PBM 1"],filter:"underpaid"};
function client(){return {rpc:jest.fn().mockResolvedValue({data:[],error:null})};}
describe("APBM tenant-scoped real services",()=>{
 it("derives capability from server tenancy, not platform role",async()=>{
  const c=client();c.rpc.mockResolvedValue({data:[{id:B,account_id:A,name:"Store B",capability:"owner"}],error:null});
  expect(canAdminister(await listTenantStores(c))).toBe(true);
  expect(c.rpc).toHaveBeenCalledWith("tenant_stores",{});
  expect(canAdminister([{id:B,account_id:A,name:"B",capability:"member"}])).toBe(false);
 });
 it("fails closed on malformed or rejected scope",async()=>{
  const c=client();c.rpc.mockResolvedValueOnce({data:[{id:A}],error:null}).mockResolvedValueOnce({data:null,error:{message:"denied"}});
  await expect(listTenantStores(c)).rejects.toThrow("Store access");
  await expect(listTenantStores(c)).rejects.toThrow("denied");
 });
 it("requires explicit selection and never defaults to another tenant",async()=>{
  const c=client();await expect(createOwedBookService(undefined,c).getKpis(filters)).rejects.toThrow("Select a permitted store");expect(c.rpc).not.toHaveBeenCalled();
 });
 it("passes store and all filters to audited RPCs",async()=>{
  const c=client();c.rpc.mockResolvedValueOnce({data:[{commercial_underpaid:"12.5",commercial_scripts:3,updated_difference:2,owed:12.5}],error:null});
  const svc=createOwedBookService(A,c);expect((await svc.getKpis(filters)).commercial_underpaid).toBe(12.5);
  await svc.getRows("federal_dollars",filters,2);await svc.getSummary(filters);await svc.getPbmOptions();
  expect(c.rpc.mock.calls.map(x=>x[0])).toEqual(["owedbook_kpis","owedbook_rows","owedbook_summary","owedbook_pbm_options"]);
  expect(c.rpc.mock.calls.every(x=>x[1].p_business_id===A)).toBe(true);
  expect(c.rpc.mock.calls[1][1]).toMatchObject({p_tab:"federal_dollars",p_from:filters.from,p_to:filters.to,p_pbms:filters.pbms,p_filter:filters.filter,p_page:2,p_limit:25});
 });
 it("does not share mutable selection between simultaneous services",async()=>{
  const c=client();await Promise.all([createOwedBookService(A,c).getRows("commercial_dollars",filters,1),createOwedBookService(B,c).getRows("commercial_dollars",filters,1)]);
  expect(c.rpc.mock.calls.map(x=>x[1].p_business_id)).toEqual([A,B]);
 });
 it("propagates a foreign-store refusal without mock fallback",async()=>{
  const c=client();c.rpc.mockResolvedValue({data:null,error:{message:"not a member of business"}});
  await expect(createOwedBookService(B,c).getKpis(filters)).rejects.toThrow("not a member of business");expect(c.rpc).toHaveBeenCalledTimes(1);
 });
 it("rejects absent KPI response and disables upload without an RPC",async()=>{
  const c=client();const svc=createOwedBookService(A,c);await expect(svc.getKpis(filters)).rejects.toThrow("KPI data unavailable");
  c.rpc.mockClear();await expect(svc.uploadData({} as File)).rejects.toThrow("Not available");expect(c.rpc).not.toHaveBeenCalled();
 });
});
