/** @jest-environment node */
import { beforeEach, expect, test } from "@jest/globals";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { GET } from "../route";

declare const jest: typeof import("@jest/globals").jest;

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: { design: { findMany: jest.fn(), count: jest.fn() } },
}));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
jest.mock("next/cache", () => ({ revalidateTag: jest.fn() }));

const findMany = jest.mocked(prisma.design.findMany);
const count = jest.mocked(prisma.design.count);

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getServerSession).mockResolvedValue(null);
  findMany.mockResolvedValue([]);
  count.mockResolvedValue(0);
});

test("partial plan-code search composes with bedroom and style filters without a search-vector dependency", async () => {
  const response = await GET(
    new NextRequest(
      "http://localhost/api/designs?mode=cursor&lite=true&search=cb3045&styles=Bungalows&bedrooms=3",
    ),
  );
  expect(response.status).toBe(200);
  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        OR: [
          { name: { contains: "cb3045", mode: "insensitive" } },
          { description: { contains: "cb3045", mode: "insensitive" } },
          { category: { name: { contains: "cb3045", mode: "insensitive" } } },
        ],
        bedrooms: 3,
        category: { name: { in: ["Bungalows"] } },
      },
    }),
  );
  expect(await response.json()).toEqual({
    designs: [],
    totalDesigns: 0,
    nextCursor: null,
    hasMore: false,
  });
});

test("alphabetical sorting and build estimates are available to public discovery cards", async () => {
  await GET(
    new NextRequest(
      "http://localhost/api/designs?mode=cursor&lite=true&sortBy=Name&priceType=building&minPrice=1000&maxPrice=5000",
    ),
  );
  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      where: { minBuildingCost: { gte: 1000 }, maxBuildingCost: { lte: 5000 } },
      select: expect.objectContaining({
        minBuildingCost: true,
        maxBuildingCost: true,
      }),
    }),
  );
});

test("load more advances the cursor, avoids another total count, and returns only the requested page", async () => {
  findMany.mockResolvedValue([
    { id: "second" },
    { id: "third" },
    { id: "fourth" },
  ] as Awaited<ReturnType<typeof prisma.design.findMany>>);
  const response = await GET(
    new NextRequest(
      "http://localhost/api/designs?mode=cursor&lite=true&cursor=first&limit=2&includeTotals=false",
    ),
  );
  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({ cursor: { id: "first" }, skip: 1, take: 3 }),
  );
  expect(count).not.toHaveBeenCalled();
  expect(await response.json()).toEqual({
    designs: [{ id: "second" }, { id: "third" }],
    nextCursor: "third",
    hasMore: true,
  });
});

test("signed-in administrators get the same public cursor browsing and private caching", async () => {
  jest.mocked(getServerSession).mockResolvedValue({ user: { role: "ADMIN" } });
  const response = await GET(
    new NextRequest(
      "http://localhost/api/designs?mode=cursor&lite=true&sortBy=Featured",
    ),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      orderBy: [
        { isFeatured: "desc" },
        { views: "desc" },
        { createdAt: "desc" },
        { id: "asc" },
      ],
      select: expect.objectContaining({ images: expect.any(Object) }),
    }),
  );
  expect(await response.json()).toEqual({
    designs: [],
    totalDesigns: 0,
    nextCursor: null,
    hasMore: false,
  });
});
