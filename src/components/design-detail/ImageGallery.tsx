import { designs } from "@/lib/dummydata";
import Image from "next/image";
import { motion } from "framer-motion";

const ImageGallery = ({ design }: { design: any }) => {
  return (
    <div className="mt-8 sm:mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {design.images.map((image: string, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-cb-border shadow-xl hover:shadow-2xl transition-all duration-500 group"
          >
            <Image
              src={image}
              alt={`${design.name} Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;