"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

/**
 * A password field with a show/hide control (U-3). It is the existing Input with one button beside the text: the
 * password starts hidden, the button never submits the form, its label and aria-pressed follow the state, and the
 * field keeps its value, focus and caret while the visibility changes. Every other prop (value, onChange, ref,
 * autocomplete, aria attributes from FormControl) passes straight to the input. Nothing is logged or stored.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  // Browsers put the caret at the start when an input's type changes, and Chromium does it again just after the commit.
  // Remember the selection before the toggle and put it back once the type has changed and again on the next frame, so
  // typing continues where it was (found in the production-browser walk; jsdom keeps the caret).
  const input = React.useRef<HTMLInputElement | null>(null);
  const selection = React.useRef<[number | null, number | null] | null>(null);
  const setRefs = React.useCallback((el: HTMLInputElement | null) => {
    input.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, [ref]);
  React.useLayoutEffect(() => {
    const el = input.current, s = selection.current;
    selection.current = null;
    if (!el || !s) return;
    const [start, end] = s;
    if (start === null || end === null) return;
    const restore = () => el.setSelectionRange(start, end);
    restore();
    // Chromium moves the caret once more after the commit. Put it back on the next frame, or at the first key if the
    // person types sooner (before the character goes in); a click in the field picks a new position, so leave that.
    let done = false;
    let frame = 0;
    const onKey = () => settle(true);
    const onPointer = () => settle(false);
    function settle(apply: boolean) {
      if (done) return;
      done = true;
      if (apply) restore();
      if (frame && typeof cancelAnimationFrame === "function") cancelAnimationFrame(frame);
      el!.removeEventListener("keydown", onKey, true);
      el!.removeEventListener("pointerdown", onPointer, true);
    }
    el.addEventListener("keydown", onKey, true);
    el.addEventListener("pointerdown", onPointer, true);
    if (typeof requestAnimationFrame === "function") frame = requestAnimationFrame(() => settle(true));
    return () => settle(false);
  }, [visible]);
  const toggle = () => {
    selection.current = input.current ? [input.current.selectionStart, input.current.selectionEnd] : null;
    setVisible((v) => !v);
  };
  return (
    <div className="relative">
      {/* pr-12 comes last, so a caller's padding (e.g. p-6) cannot run the text under the button. */}
      <Input ref={setRefs} type={visible ? "text" : "password"} className={cn(className, "pr-12")} {...props} />
      <button
        type="button"
        onClick={toggle}
        // Keep the caret in the field for pointer users, so typing continues after a toggle.
        onMouseDown={(e) => e.preventDefault()}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        aria-controls={props.id}
        disabled={props.disabled}
        className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
