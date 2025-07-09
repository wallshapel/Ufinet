/// <reference types="vitest" />

import { render, screen, fireEvent } from "@testing-library/react";
import CoverInput from "./CoverInput";
import { vi } from "vitest";

describe("CoverInput", () => {
  test("should show error if file type is invalid", async () => {
    const showError = vi.fn();
    const onValidFileSelect = vi.fn();

    render(
      <CoverInput
        currentFile={undefined}
        onValidFileSelect={onValidFileSelect}
        showError={showError}
      />
    );

    const file = new File(["dummy"], "fake.pdf", { type: "application/pdf" });
    const input = screen
      .getByRole("button", { name: /select cover/i })
      .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
    });
    fireEvent.change(input);

    expect(showError).toHaveBeenCalledWith(
      "Only JPG or PNG images are allowed"
    );
    expect(onValidFileSelect).not.toHaveBeenCalled();
  });

  test("should show error if file exceeds max size", async () => {
    const showError = vi.fn();
    const onValidFileSelect = vi.fn();

    render(
      <CoverInput
        currentFile={undefined}
        onValidFileSelect={onValidFileSelect}
        showError={showError}
      />
    );

    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    const input = screen
      .getByRole("button", { name: /select cover/i })
      .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [bigFile],
    });
    fireEvent.change(input);

    expect(showError).toHaveBeenCalledWith("Maximum size allowed is 5MB");
    expect(onValidFileSelect).not.toHaveBeenCalled();
  });
});
