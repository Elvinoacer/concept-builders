
import { location } from "@/lib/contact-data";
import Image from "next/image";

const Location = () => {
  return (
    <div className="mt-8 md:mt-12">
      <h3
        className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
      >
        Our Location
      </h3>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-cover bg-center">
        <Image
          src={location.image}
          alt="Our Location"
          width={300}
          height={200}
          className="rounded-lg w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Location;
