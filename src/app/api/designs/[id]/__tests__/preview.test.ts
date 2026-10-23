/** @jest-environment node */
import { NextRequest } from "next/server";
import { GET } from "../route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { expect, jest, test } from "@jest/globals";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: { design: { findUnique: jest.fn() } },
}));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
jest.mock("@/lib/r2-client", () => ({ s3Client: {} }));

test("public previews retrieve published images without session or purchase-document lookups", async () => {
  const preview = {
    id: "house-preview",
    name: "Villa",
    images: [
      { url: "https://example.com/render.jpg", type: "IMAGE", name: "Front" },
    ],
  };
  const findUnique = prisma.design.findUnique as unknown as jest.Mock<
    (query: {
      select: { images: { where: Record<string, unknown> } };
    }) => Promise<unknown>
  >;
  findUnique.mockResolvedValue(preview);
  const response = await GET(
    new NextRequest("http://localhost/api/designs/house-preview?preview=true"),
    { params: Promise.resolve({ id: "house-preview" }) },
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(preview);
  expect(getServerSession).not.toHaveBeenCalled();
  const query = findUnique.mock.calls[0][0];
  expect(query.select.images.where).toEqual({
    type: "IMAGE",
    status: "COMPLETED",
    isLatest: true,
  });
  expect(query.select).not.toHaveProperty("files");
  expect(query.select).not.toHaveProperty("architecturalDesign");
  expect(query.select).not.toHaveProperty("structuralDesign");
  expect(query.select).not.toHaveProperty("packageOptions");
});
