import { packageTotal, type DocumentOption } from "../detail-model";

const documents: DocumentOption[] = [
  {
    key: "pdf",
    label: "Architectural PDF",
    description: "",
    available: true,
    included: true,
    price: 619,
  },
  {
    key: "cad",
    label: "Architectural CAD",
    description: "",
    available: true,
    included: false,
    price: 658,
  },
  {
    key: "structural",
    label: "Structural PDF",
    description: "",
    available: false,
    included: false,
    price: 465,
  },
];

test("the included drawing is not charged a second time", () => {
  expect(packageTotal(619, documents, ["pdf"], [])).toBe(619);
});
test("selected drawings and package extras are added to the base price", () => {
  expect(
    packageTotal(
      619,
      documents,
      ["pdf", "cad"],
      [{ id: "extra", name: "Extra", price: 50 }],
    ),
  ).toBe(1327);
});
test("unavailable documents and unknown selections cannot increase the total", () => {
  expect(
    packageTotal(619, documents, ["pdf", "structural", "unknown"], []),
  ).toBe(619);
});
test("removing an optional drawing restores the original price", () => {
  expect(packageTotal(619, documents, ["pdf", "cad"], [])).toBe(1277);
  expect(packageTotal(619, documents, ["pdf"], [])).toBe(619);
});
