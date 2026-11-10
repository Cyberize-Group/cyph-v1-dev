/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import OwedBookScreen from "@/components/owedbook/OwedBookScreen";
import { OwedBookProvider,useOwedBook } from "@/components/owedbook/OwedBookContext";
import { createOwedBookService } from "@/services/owedbook";
import { listTenantStores } from "@/services/tenantScope";
import { owedBookFixtures } from "@/mocks/owedbook";
import type { OwedBookKpis,OwedBookPage } from "@/types/OwedBook";
jest.mock("@/services/owedbook",()=>({owedBookService:{},createOwedBookService:jest.fn()}));
jest.mock("@/services/tenantScope",()=>({...jest.requireActual("@/services/tenantScope"),listTenantStores:jest.fn()}));
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const kpi={commercial_underpaid:42,commercial_scripts:1,updated_difference:0,owed:42};
const empty={rows:[],page:1,pageCount:1,limit:25,total:0};
const deferred=<T,>()=>{let resolve!:(x:T)=>void;const promise=new Promise<T>(r=>{resolve=r;});return {promise,resolve};};
const Options=()=>{const {pbmOptions,refresh,applyFilters}=useOwedBook();return <><span data-testid="options">{pbmOptions.join(",")}</span><button onClick={refresh}>Refresh all</button><button onClick={()=>applyFilters({pbms:[],filter:"new"})}>Apply test filter</button></>;};
const renderPage=()=>render(<OwedBookProvider><Options/><OwedBookScreen/></OwedBookProvider>);
let a:ReturnType<typeof createOwedBookService>,b:ReturnType<typeof createOwedBookService>;
const originalMode=process.env.NEXT_PUBLIC_APBM_DATA_MODE;
beforeEach(()=>{
 process.env.NEXT_PUBLIC_APBM_DATA_MODE="real";
 jest.mocked(listTenantStores).mockResolvedValue([{id:A,account_id:A,name:"Store A",capability:"owner"},{id:B,account_id:A,name:"Store B",capability:"owner"}]);
 const service=()=>({getKpis:jest.fn().mockResolvedValue(kpi),getRows:jest.fn().mockResolvedValue(empty),getSummary:jest.fn().mockResolvedValue([]),getPbmOptions:jest.fn().mockResolvedValue(["SYNTHETIC PBM"]),refreshData:jest.fn(),uploadData:jest.fn()});
 a=service();b=service();jest.mocked(createOwedBookService).mockImplementation(id=>id===B?b:a);
});
afterAll(()=>{process.env.NEXT_PUBLIC_APBM_DATA_MODE=originalMode;});
describe("APBM real-mode asynchronous states",()=>{
 it("drops stale store KPI, rows and options after a switch",async()=>{
  const k=deferred<OwedBookKpis>(),r=deferred<OwedBookPage>(),o=deferred<string[]>();
  jest.mocked(a.getKpis).mockReturnValue(k.promise);jest.mocked(a.getRows).mockReturnValue(r.promise);jest.mocked(a.getPbmOptions).mockReturnValue(o.promise);
  renderPage();await waitFor(()=>expect(a.getRows).toHaveBeenCalled());
  fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});
  expect(screen.queryByText("$999.00")).not.toBeInTheDocument();
  await screen.findByText("No results");await act(async()=>{k.resolve({...kpi,commercial_underpaid:999,owed:999});r.resolve({...empty,total:999});o.resolve(["OLD STORE PBM"]);});
  expect(screen.queryByText("$999.00")).not.toBeInTheDocument();expect(screen.queryByText(/of 999 claims/)).not.toBeInTheDocument();expect(screen.getByTestId("options")).not.toHaveTextContent("OLD STORE PBM");
 });
 it("clears already visible values immediately when changing stores",async()=>{
  jest.mocked(a.getKpis).mockResolvedValue({...kpi,commercial_underpaid:999,owed:999});
  const pending=deferred<OwedBookKpis>();jest.mocked(b.getKpis).mockReturnValue(pending.promise);
  renderPage();await screen.findAllByText("$999.00");fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});
  expect(screen.queryByText("$999.00")).not.toBeInTheDocument();expect(screen.getByLabelText("Loading KPIs")).toBeInTheDocument();
  await act(async()=>pending.resolve(kpi));await screen.findAllByText("$42.00");
 });
 it("KPI failure is unavailable and retry refreshes KPIs, options and active rows",async()=>{
  jest.mocked(a.getKpis).mockRejectedValueOnce(new Error("temporary"));renderPage();
  await screen.findByText("KPIs unavailable. Please retry.");expect(screen.queryByText("Commercial Underpaid")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Retry KPIs"}));await screen.findAllByText("$42.00");
  expect(a.getKpis).toHaveBeenCalledTimes(2);expect(a.getRows).toHaveBeenCalledTimes(2);expect(a.getPbmOptions).toHaveBeenCalledTimes(2);
 });
 it("foreign-store rejection renders an error, never old rows",async()=>{
  jest.mocked(b.getRows).mockRejectedValue(new Error("not a member of business"));renderPage();await screen.findByText("No results");
  fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});await screen.findByText("not a member of business");expect(screen.queryByText("No results")).not.toBeInTheDocument();expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
 });
 it("failed store discovery starts no claim RPC and offers retry",async()=>{
  jest.mocked(listTenantStores).mockRejectedValue(new Error("offline"));renderPage();await screen.findByRole("button",{name:"Retry stores"});expect(a.getKpis).not.toHaveBeenCalled();expect(a.getRows).not.toHaveBeenCalled();
 });
});


describe("results toolbar integration",()=>{
 it("keeps request counts, placement, filter/store resets, and non-paginated tabs",async()=>{
  const response=(total:number,page:number):OwedBookPage=>({rows:owedBookFixtures.slice((page-1)*25,Math.min(page*25,total)),page,pageCount:Math.ceil(total/25),limit:25,total});
  jest.mocked(a.getRows).mockImplementation(async(tab,filters,page=1)=>response(tab==="federal_dollars"?0:filters.filter?31:50,page));
  jest.mocked(b.getRows).mockImplementation(async(_tab,_filters,page=1)=>response(50,page));
  renderPage();await screen.findByText("Showing 1–25 of 50 claims");
  const toolbar=screen.getByRole("navigation",{name:"Results pagination"});
  const table=screen.getByTestId("datatable-desktop");
  expect(table.compareDocumentPosition(toolbar)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(table.contains(toolbar)).toBe(false);
  expect(a.getRows).toHaveBeenCalledTimes(1);expect(a.getKpis).toHaveBeenCalledTimes(1);expect(a.getPbmOptions).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–50 of 50 claims");
  expect(a.getRows).toHaveBeenCalledTimes(2);expect(a.getKpis).toHaveBeenCalledTimes(1);expect(a.getPbmOptions).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button",{name:"Previous page"}));await screen.findByText("Showing 1–25 of 50 claims");
  expect(a.getRows).toHaveBeenCalledTimes(3);
  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–50 of 50 claims");
  fireEvent.click(screen.getByRole("button",{name:"Apply test filter"}));await screen.findByText("Showing 1–25 of 31 claims");
  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–31 of 31 claims");
  fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});await screen.findByText("Showing 1–25 of 50 claims");
  fireEvent.mouseDown(screen.getByRole("tab",{name:"Summary"}),{button:0,ctrlKey:false});await waitFor(()=>expect(b.getSummary).toHaveBeenCalled());
  expect(screen.queryByRole("navigation",{name:"Results pagination"})).not.toBeInTheDocument();
  fireEvent.mouseDown(screen.getByRole("tab",{name:"Federal Dollars"}),{button:0,ctrlKey:false});await screen.findByText("Federal reimbursement data is unavailable in this release.");
  expect(screen.queryByRole("navigation",{name:"Results pagination"})).not.toBeInTheDocument();
 });
});
