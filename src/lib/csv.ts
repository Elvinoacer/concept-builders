export function convertToCSV(data: any[]) {
  if (data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
