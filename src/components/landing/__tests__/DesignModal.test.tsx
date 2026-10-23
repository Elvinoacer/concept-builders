import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import type { LandingPlan } from "@/lib/landing-designs";
import DesignModal from "../DesignModal";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
  }) => {
    // An actual image element lets the test identify which house is displayed.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} onLoad={onLoad} />;
  },
}));

const homes: LandingPlan[] = [
  {
    id: "preview-race-a",
    name: "House A",
    category: "Villas",
    images: [{ url: "https://example.com/a.jpg" }],
  },
  {
    id: "preview-race-b",
    name: "House B",
    category: "Bungalows",
    images: [{ url: "https://example.com/b.jpg" }],
  },
];

function GalleryHarness() {
  const [plan, setPlan] = useState(homes[0]);
  return (
    <DesignModal
      plan={plan}
      collection={homes}
      onSelect={setPlan}
      onClose={jest.fn()}
      onRestoreFocus={jest.fn()}
    />
  );
}

const originalFetch = global.fetch;
afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = originalFetch;
});

test("switching homes cancels the previous request and ignores its late response", async () => {
  const pending: {
    resolve: (response: unknown) => void;
    signal: AbortSignal;
  }[] = [];
  global.fetch = jest.fn(
    (_url: RequestInfo | URL, options?: RequestInit) =>
      new Promise((resolve) =>
        pending.push({ resolve, signal: options!.signal as AbortSignal }),
      ),
  ) as unknown as typeof fetch;
  render(<GalleryHarness />);
  await waitFor(() => expect(pending).toHaveLength(1));
  fireEvent.click(screen.getByRole("button", { name: "Next home" }));
  await waitFor(() => expect(pending).toHaveLength(2));
  expect(pending[0].signal.aborted).toBe(true);
  pending[1].resolve({
    ok: true,
    json: async () => ({
      id: homes[1].id,
      images: [
        homes[1].images[0],
        { url: "https://example.com/b-side.jpg" },
        { url: "https://example.com/b-rear.jpg" },
      ],
    }),
  });
  await screen.findByRole("button", { name: "Show Rear elevation" });
  pending[0].resolve({
    ok: true,
    json: async () => ({
      id: homes[0].id,
      images: [{ url: "https://example.com/wrong-house.jpg" }],
    }),
  });
  fireEvent.click(screen.getByRole("button", { name: "Next perspective" }));
  expect(screen.getByAltText("House B — Side view")).toHaveAttribute(
    "src",
    "https://example.com/b-side.jpg",
  );
  expect(screen.queryByAltText(/House A/)).not.toBeInTheDocument();
});

test("a failed gallery request keeps the complete available image and offers a retry", async () => {
  global.fetch = jest
    .fn<typeof fetch>()
    .mockResolvedValue({ ok: false } as Response);
  const plan = { ...homes[0], id: "preview-outage" };
  render(
    <DesignModal
      plan={plan}
      collection={[plan]}
      onSelect={jest.fn()}
      onClose={jest.fn()}
      onRestoreFocus={jest.fn()}
    />,
  );
  await screen.findByRole("button", {
    name: "Try loading the full gallery again",
  });
  expect(screen.getByAltText("House A — Perspective 01")).toHaveAttribute(
    "src",
    "https://example.com/a.jpg",
  );
  expect(
    screen.getByRole("link", { name: "View plan details" }),
  ).toHaveAttribute("href", "/designs/preview-outage");
  expect(screen.getByRole("button", { name: "Next home" })).toBeDisabled();
});
