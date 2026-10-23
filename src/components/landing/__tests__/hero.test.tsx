import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import type { LandingPlan } from "@/lib/landing-designs";
import DreamPlan from "../hero";

declare const jest: typeof import("@jest/globals").jest;

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
    onError,
  }: {
    src: string;
    alt: string;
    onLoad: () => void;
    onError: () => void;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} onLoad={onLoad} onError={onError} />;
  },
}));

const homes: LandingPlan[] = [
  {
    name: "FIVE BEDROOM VILLA MAISONETTE (CB3023)",
    category: "Maisonettes",
    images: [{ url: "https://example.com/villa.jpg" }],
  },
  {
    name: "Courtyard bungalow",
    category: "Bungalows",
    images: [{ url: "https://example.com/bungalow.jpg" }],
  },
];
beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

function showHero() {
  return render(
    <DreamPlan
      plan={homes[0]}
      collection={homes}
      onPreview={jest.fn()}
      paused={false}
    />,
  );
}

test("a timed transition waits for the incoming image and pause keeps the current home", () => {
  showHero();
  fireEvent.load(screen.getByAltText(homes[0].name));
  act(() => {
    jest.advanceTimersByTime(9000);
  });
  expect(
    screen.getByRole("heading", { name: homes[0].name }),
  ).toBeInTheDocument();
  fireEvent.load(screen.getByAltText(homes[1].name));
  expect(
    screen.getByRole("heading", { name: homes[1].name }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Pause hero animation" }));
  act(() => {
    jest.advanceTimersByTime(30000);
  });
  expect(
    screen.getByRole("heading", { name: homes[1].name }),
  ).toBeInTheDocument();
});

test("reduced motion disables autoplay while keeping manual home navigation available", () => {
  window.matchMedia = jest.fn(() => ({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
  showHero();
  fireEvent.load(screen.getByAltText(homes[0].name));
  fireEvent.load(screen.getByAltText(homes[1].name));
  act(() => {
    jest.advanceTimersByTime(30000);
  });
  expect(
    screen.getByRole("heading", { name: homes[0].name }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next featured home" }));
  expect(
    screen.getByRole("heading", { name: homes[1].name }),
  ).toBeInTheDocument();
});

test("a late catalog response preserves the opening scene until its image is ready", () => {
  const view = showHero();
  fireEvent.load(screen.getByAltText(homes[0].name));
  act(() => {
    jest.advanceTimersByTime(1200);
  });
  const catalogHome = {
    ...homes[1],
    id: "catalog-home",
    name: "Catalog villa",
    images: [{ url: "https://example.com/catalog.jpg" }],
  };
  view.rerender(
    <DreamPlan
      plan={catalogHome}
      collection={[catalogHome]}
      onPreview={jest.fn()}
      paused={false}
    />,
  );
  expect(
    screen.getByRole("heading", { name: homes[0].name }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: "Discover our house plans" }),
  ).toHaveAttribute("data-entered", "true");
  fireEvent.load(screen.getByAltText(catalogHome.name));
  expect(
    screen.getByRole("heading", { name: catalogHome.name }),
  ).toBeInTheDocument();
});

test("an incoming home waits while the full preview pauses the hero", () => {
  const view = showHero();
  fireEvent.load(screen.getByAltText(homes[0].name));
  fireEvent.click(screen.getByRole("button", { name: "Next featured home" }));
  view.rerender(
    <DreamPlan
      plan={homes[0]}
      collection={homes}
      onPreview={jest.fn()}
      paused
    />,
  );
  fireEvent.load(screen.getByAltText(homes[1].name));
  expect(
    screen.getByRole("heading", { name: homes[0].name }),
  ).toBeInTheDocument();
  view.rerender(
    <DreamPlan
      plan={homes[0]}
      collection={homes}
      onPreview={jest.fn()}
      paused={false}
    />,
  );
  expect(
    screen.getByRole("heading", { name: homes[1].name }),
  ).toBeInTheDocument();
});
