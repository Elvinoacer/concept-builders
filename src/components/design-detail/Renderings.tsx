import { designs } from "@/lib/designs";
import Image from "next/image";

const Renderings = ({ design }: { design: (typeof designs)[0] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Renderings</h2>
      <div className="grid grid-cols-1 gap-4">
        {design.renderings.map((rendering, index) => (
          <div key={index} className="relative w-full h-96">
            <Image src={rendering} alt={`${design.name} Rendering ${index + 1}`} layout="fill" objectFit="contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Renderings;