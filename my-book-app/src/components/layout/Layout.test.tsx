/// <reference types="vitest" />
import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Layout from "./Layout";
import { MemoryRouter } from "react-router-dom";

// Mocks
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../utils/decodeToken", () => ({
  getUsernameFromToken: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => navigateMock),
  };
});

import { useAuth } from "../../context/AuthContext";
import { getUsernameFromToken } from "../../utils/decodeToken";

const navigateMock = vi.fn();

describe("Layout Component", () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header and logout button", () => {
    (useAuth as vi.Mock).mockReturnValue({ token: null, logout: logoutMock });
    render(
      <Layout>
        <div>Child content</div>
      </Layout>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText("My Book App")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("shows username if token is present", () => {
    (useAuth as vi.Mock).mockReturnValue({
      token: "fake-token",
      logout: logoutMock,
    });
    (getUsernameFromToken as vi.Mock).mockReturnValue("legato");

    render(
      <Layout>
        <div>Hi</div>
      </Layout>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText(/Welcome, legato/)).toBeInTheDocument();
  });

  it("does not show username if token is missing", () => {
    (useAuth as vi.Mock).mockReturnValue({ token: null, logout: logoutMock });

    render(
      <Layout>
        <div>Hello</div>
      </Layout>,
      { wrapper: MemoryRouter }
    );

    expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
  });

  it("calls logout and navigates to /login on button click", () => {
    (useAuth as vi.Mock).mockReturnValue({
      token: "valid-token",
      logout: logoutMock,
    });
    (getUsernameFromToken as vi.Mock).mockReturnValue("tester");

    render(
      <Layout>
        <div>Logout Test</div>
      </Layout>,
      { wrapper: MemoryRouter }
    );

    fireEvent.click(screen.getByText("Log out"));

    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
