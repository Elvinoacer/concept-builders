import { designs } from "@/lib/designs";
import Image from "next/image";

const FloorPlan = ({ design }: { design: (typeof designs)[0] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Floor Plan</h2>
      <div className="relative w-full h-96">
        <Image src={design.floor_plan} alt={`${design.name} Floor Plan`} layout="fill" objectFit="contain" />
      </div>
    </div>
  );
};

export default FloorPlan;