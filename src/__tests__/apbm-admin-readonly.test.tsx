/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { render,screen,fireEvent } from "@testing-library/react";
import { createAdminServices } from "@/services/adminDemo";
import AddStoreButton from "@/components/admin-portal/AddStoreButton";
import InviteMemberForm from "@/components/admin-portal/InviteMemberForm";
import BillingRow from "@/components/admin-portal/BillingRow";
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const previous=process.env.NEXT_PUBLIC_APBM_DATA_MODE;
beforeEach(()=>{process.env.NEXT_PUBLIC_APBM_DATA_MODE="real";});
afterAll(()=>{process.env.NEXT_PUBLIC_APBM_DATA_MODE=previous;});
function connection(){return {rpc:jest.fn(async(name:string):Promise<{data:unknown;error:null}>=>({data:name==="admin_stores"?[{id:A,name:"Synthetic A",ncpdp:null,npi:null,status:"active",subscription_status:null,member_count:1}]:[],error:null}))};}
describe("APBM read-only admin adapter",()=>{
 it("shows unknown billing values truthfully without mock prices",async()=>{
  const c=connection();c.rpc.mockImplementation(async name=>({data:name==="admin_stores"?[{id:A,name:"Synthetic A",status:"active",subscription_status:null,member_count:1}]:{account_id:B,subscriptions:[]} as never,error:null}));
  const lines=await createAdminServices(c).billingService.listBilling();expect(lines[0]).toMatchObject({plan:"unavailable",amountLabel:"Price unavailable",subscriptionStatus:"unavailable"});expect(lines[0].nextChargeDate).toBeUndefined();
 });
 it("uses the selected store for member and settings reads",async()=>{
  const c=connection();const s=createAdminServices(c);await s.storeMemberService.listMembers(A);await s.settingsService.getSettings(A);
  expect(c.rpc).toHaveBeenCalledWith("admin_members",{p_business_id:A});expect(c.rpc).toHaveBeenCalledWith("admin_stores",{p_business_id:A});
 });
 it("blocks every write without any RPC or mock-store mutation",async()=>{
  const c=connection();const s=createAdminServices(c);
  for(const action of [s.storeMemberService.inviteMember({storeId:A,email:"synthetic@example.invalid",role:"member"}),s.storeMemberService.resendInvite(A),s.storeMemberService.suspendMember(A),s.storeMemberService.unsuspendMember(A),s.storeMemberService.sendRecovery(A),s.billingService.managePayment(A),s.billingService.cancelSubscription(A),s.settingsService.saveSettings({storeId:A,pharmacyName:"A",contactPerson:"",phone:"",address:"",pharmacySoftware:""})])expect(await action).toMatchObject({ok:false,message:"Not available in this release."});
  await expect(s.ownerStoresService.addStore()).rejects.toThrow("Not available");await expect(s.auditService.append({action:"added_store",target:"A",result:"done"})).rejects.toThrow("Not available");expect(c.rpc).not.toHaveBeenCalled();
 });
 it("deduplicates owner account reads and uses the audited viewer",async()=>{
  const c=connection();c.rpc.mockImplementation(async name=>({data:(name==="tenant_stores"?[{id:A,account_id:B,name:"A",capability:"owner"},{id:B,account_id:B,name:"B",capability:"owner"}]:{rows:[{id:1,occurred_at:"2026-01-01T00:00:00Z",action:"read_page",table_name:"user_data",business_id:A}]}) as never,error:null}));
  expect(await createAdminServices(c).auditService.listAudit()).toHaveLength(1);expect(c.rpc.mock.calls.filter(x=>x[0]==="admin_audit")).toHaveLength(1);expect(c.rpc).toHaveBeenCalledWith("admin_audit",{p_business_id:A,p_limit:100});
 });
 it("denies members audit visibility",async()=>{
  const c=connection();c.rpc.mockResolvedValue({data:[{id:A,account_id:B,name:"A",capability:"member"}] as never,error:null});
  await expect(createAdminServices(c).auditService.listAudit()).rejects.toThrow("Audit access unavailable");expect(c.rpc).toHaveBeenCalledTimes(1);
 });
 it("renders disabled write controls and clear unavailable text",()=>{
  const added=jest.fn();render(<AddStoreButton onAdded={added}/>);fireEvent.click(screen.getByRole("button",{name:"Add store"}));expect(added).not.toHaveBeenCalled();expect(screen.getByRole("button",{name:"Add store"})).toBeDisabled();
  render(<InviteMemberForm storeId={A} onInvited={jest.fn()}/>);expect(screen.getByText(/Inviting members is not available/)).toBeInTheDocument();
  render(<BillingRow line={{storeId:A,storeName:"A",plan:"unavailable",subscriptionStatus:"unavailable",amountLabel:"Price unavailable"}}/>);expect(screen.getByRole("button",{name:"Manage payment"})).toBeDisabled();expect(screen.getByRole("button",{name:"Cancel"})).toBeDisabled();expect(screen.getByText(/Billing dates unavailable/)).toBeInTheDocument();
 });
});
