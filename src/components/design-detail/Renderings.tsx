import { designDetailPageData } from "@/lib/dummydata/designDetailPage";

const Renderings = ({ renderings }: { renderings: { url: string }[] }) => {
  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">{designDetailPageData.renderings.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderings && renderings.map((rendering, index) => (
          <div
            key={index}
            className="h-48 md:h-64 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${rendering.url})` }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Renderings;