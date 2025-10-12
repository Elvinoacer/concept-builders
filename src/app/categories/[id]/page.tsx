import { notFound } from 'next/navigation';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

async function getCategory(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`);
  if (!res.ok) {
    return notFound();
  }
  return res.json();
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.id);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">{category.name} Designs</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.designs.length === 0 ? (
            <div className="text-center text-muted-foreground col-span-3">
              <p>No designs found in this category.</p>
            </div>
          ) : (
            category.designs.map((design: any) => (
              <div key={design.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={design.files.find((file: any) => file.type === 'IMAGE')?.url || '/images/placeholder.png'}
                    alt={design.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{design.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{design.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${design.basePrice}</span>
                    <a href={`/designs/${design.id}`} className="text-indigo-600 hover:text-indigo-500 font-semibold">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
