import { values } from "@/lib/dummydata";
import Image from "next/image";

const OurValues = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 xs:mb-5 sm:mb-6 md:gap-8 lg:mb-10 text-gold text-center w-full">
        Our Values
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-card rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-cb-border group"
          >
            <div className="relative w-full h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
              <Image
                src={value.image}
                alt={value.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4 xs:p-5 sm:p-6">
              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 xs:mb-3 text-cream leading-tight">
                {value.title}
              </h3>
              <p className="text-cream-dim text-sm xs:text-base leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurValues;
