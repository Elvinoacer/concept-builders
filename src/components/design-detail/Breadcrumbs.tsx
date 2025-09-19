import { designs } from "@/lib/designs";

const Breadcrumbs = ({ design }: { design: (typeof designs)[0] }) => {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <a className="text-gray-500 hover:text-primary transition-colors" href="/design-showcase">Designs</a>
            <span className="material-symbols-outlined mx-2 text-gray-400">chevron_right</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-800 dark:text-white font-medium">{design.name}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;