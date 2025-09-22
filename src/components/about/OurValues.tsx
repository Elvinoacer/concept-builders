
import { values } from "@/lib/values-data";
import Image from "next/image";

const OurValues = () => {
  return (
    <div className="text-center">
      <h2
        className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter mb-6 md:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
      >
        Our Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {values.map((value, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm dark:bg-gray-800 overflow-hidden">
            <Image
              src={value.image}
              alt={value.title}
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurValues;
