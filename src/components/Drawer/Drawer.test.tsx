import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(<Drawer open={false} title="Nouvel encaissement" onClose={() => undefined}>x</Drawer>);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("is a labelled dialog that closes on Escape and close button", async () => {
    const onClose = vi.fn();
    render(<Drawer open title="Nouvel encaissement" onClose={onClose}>contenu</Drawer>);
    expect(screen.getByRole("dialog", { name: "Nouvel encaissement" })).toHaveTextContent("contenu");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it("closes when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(<Drawer open title="Nouvel encaissement" onClose={onClose}>contenu</Drawer>);
    await userEvent.click(screen.getByTestId("drawer-backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("traps Tab inside the panel: last focusable wraps to the close button", async () => {
    render(<Drawer open title="Nouvel encaissement" onClose={() => undefined}><button type="button">A</button><button type="button">B</button></Drawer>);
    screen.getByRole("button", { name: "B" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Fermer" })).toHaveFocus();
  });

  describe("drag to dismiss", () => {
    afterEach(() => vi.restoreAllMocks());
    const drag = (dy: number, ms: number) => {
      const now = vi.spyOn(performance, "now");
      render(<Drawer open title="Nouvel encaissement" onClose={onCloseMock}>contenu</Drawer>);
      const handle = document.querySelector("[data-drag-handle]") as HTMLElement;
      now.mockReturnValue(1000);
      fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1, isPrimary: true });
      fireEvent.pointerMove(handle, { clientY: 100 + dy, pointerId: 1 });
      now.mockReturnValue(1000 + ms);
      fireEvent.pointerUp(handle, { clientY: 100 + dy, pointerId: 1 });
    };
    const onCloseMock = vi.fn();
    it("closes after a long drag down", () => {
      onCloseMock.mockClear();
      drag(220, 800);
      expect(onCloseMock).toHaveBeenCalledOnce();
    });
    it("closes after a fast flick", () => {
      onCloseMock.mockClear();
      drag(30, 20);
      expect(onCloseMock).toHaveBeenCalledOnce();
    });
    it("does not close after a short slow drag", () => {
      onCloseMock.mockClear();
      drag(20, 1000);
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  })
  it("forgets a half-finished drag when closed and reopened", () => {
    const onClose = vi.fn();
    const { rerender } = render(<Drawer open title="T" onClose={onClose}>x</Drawer>);
    let handle = document.querySelector("[data-drag-handle]") as HTMLElement;
    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(handle, { clientY: 130, pointerId: 1 });
    rerender(<Drawer open={false} title="T" onClose={onClose}>x</Drawer>);
    rerender(<Drawer open title="T" onClose={onClose}>x</Drawer>);
    handle = document.querySelector("[data-drag-handle]") as HTMLElement;
    fireEvent.pointerMove(handle, { clientY: 400, pointerId: 1 });
    expect(screen.getByRole("dialog").style.transform).not.toContain("translateY(3");
    expect(screen.getByRole("dialog").style.transform).toBe("");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ignores secondary buttons and non-primary pointers", () => {
    const onClose = vi.fn();
    render(<Drawer open title="T" onClose={onClose}>x</Drawer>);
    const handle = document.querySelector("[data-drag-handle]") as HTMLElement;
    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1, isPrimary: true, button: 2 });
    fireEvent.pointerMove(handle, { clientY: 400, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientY: 400, pointerId: 1 });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("never dismisses on pointercancel, even after a long drag", () => {
    const onClose = vi.fn();
    render(<Drawer open title="T" onClose={onClose}>x</Drawer>);
    const handle = document.querySelector("[data-drag-handle]") as HTMLElement;
    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1, isPrimary: true });
    fireEvent.pointerMove(handle, { clientY: 500, pointerId: 1 });
    fireEvent.pointerCancel(handle, { clientY: 500, pointerId: 1 });
    expect(onClose).not.toHaveBeenCalled();
  });
});
