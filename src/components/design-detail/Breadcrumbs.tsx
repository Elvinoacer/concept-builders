import Link from "next/link";

const Breadcrumbs = ({ designName }: { designName: string }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="list-none p-0 inline-flex items-center">
        <li className="flex items-center">
          <Link href="/designs" className="text-gray-500 hover:text-[var(--primary-color)] transition-colors dark:text-gray-400 dark:hover:text-[var(--primary-color)]">
            Designs
          </Link>
          <span className="material-symbols-outlined mx-2 text-gray-400">chevron_right</span>
        </li>
        <li className="flex items-center">
          <span className="text-gray-800 font-medium dark:text-gray-200">{designName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;