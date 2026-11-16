/** @jest-environment jsdom */
// APBM007A U-3 — show/hide on every OwedBook password field: the sign-in form and both profile password fields.
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "@/components/ui/password-input";
import AuthPage from "@/app/(auth)/auth/page";
import ProfileForm from "@/app/profile/ProfileForm";
import { AppRole } from "@/utils/app-role";

const mockLogin = jest.fn();
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn((selector: (state: { login: jest.Mock }) => unknown) => selector({ login: mockLogin })),
}));
const mockUpdateUser = jest.fn();
jest.mock("@/utils/supabase/client", () => ({ createClient: jest.fn(() => ({ auth: { updateUser: mockUpdateUser } })) }));
jest.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast: jest.fn() }) }));

const SECRET = "not-a-real-password-1";

describe("PasswordInput (U-3)", () => {
  it("starts hidden; the button shows and hides while the value, focus and typing carry on", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    render(<form onSubmit={onSubmit}><label htmlFor="pw">Password</label><PasswordInput id="pw" autoComplete="current-password" /></form>);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("aria-controls", "pw");

    await user.type(input, "abc");
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(input.value).toBe("abc");
    expect(document.activeElement).toBe(input);   // the click did not take focus away from the field
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
    await user.type(input, "def");                // typing continues where it was
    expect(input.value).toBe("abcdef");

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
    expect(input.value).toBe("abcdef");
    expect(onSubmit).not.toHaveBeenCalled();     // toggling never submits
  });

  it("is reachable by keyboard and toggles with Space and Enter without submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    render(<form onSubmit={onSubmit}><label htmlFor="pw">Password</label><PasswordInput id="pw" /></form>);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Password"));
    await user.tab();
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(document.activeElement).toBe(toggle);
    expect(toggle.className).toContain("focus-visible:ring-2");
    await user.keyboard(" ");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("puts the caret back where it was: browsers move it to the start when the type changes", async () => {
    // The spy goes in before anything is typed: user-event wraps setSelectionRange on the element when it types, and
    // that wrapper keeps whatever method existed at that moment.
    const restore = jest.spyOn(HTMLInputElement.prototype, "setSelectionRange");
    const user = userEvent.setup();
    render(<><label htmlFor="pw">Password</label><PasswordInput id="pw" /></>);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(input, "abcdef");
    input.setSelectionRange(2, 4);
    const before = restore.mock.calls.length;
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(restore.mock.calls.slice(before)).toContainEqual([2, 4]);   // the component put the selection back
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 4]);
    restore.mockRestore();
  });

  it("the deferred caret restore runs on the next frame, but never after the person has started typing", async () => {
    const frames: FrameRequestCallback[] = [];
    const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => { frames.push(cb); return frames.length; });
    const user = userEvent.setup();
    render(<><label htmlFor="pw">Password</label><PasswordInput id="pw" /></>);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(input, "abc");
    // 1) no typing before the frame: the frame puts the caret back (Chromium had moved it to the start)
    await user.click(screen.getByRole("button", { name: "Show password" }));
    input.setSelectionRange(0, 0);
    frames.splice(0).forEach((cb) => cb(0));
    expect([input.selectionStart, input.selectionEnd]).toEqual([3, 3]);
    // 2) typing before the frame: the first key restores at once and the later frame changes nothing
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    await user.type(input, "de", { skipClick: true });
    frames.splice(0).forEach((cb) => cb(0));
    expect(input.value).toBe("abcde");
    expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);
    raf.mockRestore();
  });

  it("keeps a caller's padding but reserves room for the button", () => {
    render(<PasswordInput aria-label="pw" className="p-6 bg-muted" />);
    expect(screen.getByLabelText("pw")).toHaveClass("p-6", "pr-12", "bg-muted");
  });
});

describe("OwedBook sign-in password (U-3)", () => {
  it("has the toggle, keeps the typed password, and submits exactly what was typed", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    render(<AuthPage />);
    const pw = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(screen.getByLabelText("Email"), "owner@example.test");
    await user.type(pw, SECRET);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(pw).toHaveAttribute("type", "text");
    expect(pw.value).toBe(SECRET);
    expect(mockLogin).not.toHaveBeenCalled();   // the toggle did not submit
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockLogin.mock.calls[0])).toContain(SECRET);
  });
});

describe("OwedBook profile password fields (U-3)", () => {
  const user = { id: "u1", email: "member@example.test", user_metadata: { full_name: "Member", role: "member" } } as never;
  it("both new-password fields have their own toggle and keep their values; validation is unchanged", async () => {
    const ue = userEvent.setup();
    render(<ProfileForm user={user} role={AppRole.MEMBER} />);
    const fields = [screen.getByPlaceholderText("Minimum 8 characters"), screen.getByPlaceholderText("Re-enter new password")] as HTMLInputElement[];
    const toggles = screen.getAllByRole("button", { name: "Show password" });
    expect(toggles).toHaveLength(2);
    for (const f of fields) expect(f).toHaveAttribute("type", "password");
    await ue.type(fields[0], "abcdefgh");
    await ue.type(fields[1], "abcdefgx");
    await ue.click(toggles[0]);
    expect(fields[0]).toHaveAttribute("type", "text");
    expect(fields[1]).toHaveAttribute("type", "password");   // each toggle controls its own field
    expect(fields[0].value).toBe("abcdefgh");
    expect(mockUpdateUser).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));
    expect(await screen.findByText(/match/i)).toBeInTheDocument();   // the existing mismatch validation still runs
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
