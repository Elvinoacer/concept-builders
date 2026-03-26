import { createPrismaClient } from "../client";

type DuplicateRow = {
  apiRef: string;
  count: number;
};

function parseFlags(argv: string[]) {
  const apply = argv.includes("--apply");
  const keepOldest = argv.includes("--keep-oldest");
  return { apply, keepOldest };
}

async function main() {
  const { apply, keepOldest } = parseFlags(process.argv.slice(2));
  const { prisma, pool } = createPrismaClient();

  try {
    const duplicateRows = await prisma.$queryRaw<DuplicateRow[]>`
      SELECT "apiRef", COUNT(*)::int AS count
      FROM "PaymentAttempt"
      GROUP BY "apiRef"
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC, "apiRef" ASC
    `;

    if (duplicateRows.length === 0) {
      console.log("No duplicate PaymentAttempt.apiRef values found.");
      return;
    }

    const totalDuplicates = duplicateRows.reduce(
      (sum, row) => sum + row.count,
      0,
    );
    console.log(
      `Found ${duplicateRows.length} duplicated apiRef groups across ${totalDuplicates} rows.`,
    );

    let plannedUpdates = 0;

    for (const group of duplicateRows) {
      const attempts = await prisma.paymentAttempt.findMany({
        where: { apiRef: group.apiRef },
        orderBy: keepOldest
          ? [{ createdAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          apiRef: true,
          createdAt: true,
          status: true,
        },
      });

      if (attempts.length <= 1) {
        continue;
      }

      const keeper = attempts[0];
      const toRewrite = attempts.slice(1);
      plannedUpdates += toRewrite.length;

      console.log(
        `apiRef=${group.apiRef} keep=${keeper.id} rewrite=${toRewrite.length}`,
      );

      if (!apply) {
        continue;
      }

      for (const row of toRewrite) {
        const rewrittenApiRef = `${group.apiRef}__dedup_${row.id}`;

        await prisma.paymentAttempt.update({
          where: { id: row.id },
          data: { apiRef: rewrittenApiRef },
        });
      }
    }

    if (!apply) {
      console.log(
        `Dry run complete. ${plannedUpdates} rows would be rewritten. Re-run with --apply to persist changes.`,
      );
      return;
    }

    console.log(`Done. Rewrote ${plannedUpdates} PaymentAttempt rows.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to dedupe PaymentAttempt apiRef values.", error);
  process.exit(1);
});
