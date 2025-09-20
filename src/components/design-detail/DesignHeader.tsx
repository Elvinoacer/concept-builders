const DesignHeader = ({ name, description }: { name: string, description: string }) => {
  return (
    <div className="mb-4 md:mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight dark:text-white">{name}</h1>
      <p className="mt-2 text-gray-600 max-w-3xl dark:text-gray-300">{description}</p>
    </div>
  );
};

export default DesignHeader;
