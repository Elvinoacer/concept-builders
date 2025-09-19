import { designs } from "@/lib/designs";
import Image from "next/image";

const ImageGallery = ({ design }: { design: (typeof designs)[0] }) => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-4">
        {design.images.map((image, index) => (
          <div key={index} className="relative w-full h-64">
            <Image src={image} alt={`${design.name} Image ${index + 1}`} layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;