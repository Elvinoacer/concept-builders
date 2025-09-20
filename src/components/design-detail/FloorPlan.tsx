const FloorPlan = ({ floorPlanUrl }: { floorPlanUrl: string }) => {
  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">Floor Plan Preview</h2>
      <div
        className="w-full h-[300px] md:h-[500px] bg-center bg-no-repeat bg-contain rounded-lg border border-gray-200 dark:border-gray-700"
        style={{ backgroundImage: `url(${floorPlanUrl})` }}
      ></div>
    </section>
  );
};

export default FloorPlan;