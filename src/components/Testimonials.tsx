import React from "react";
import { testimonials } from "@/lib/testimonials";
import Image from "next/image";

const Testimonials = () => {
  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 dark:text-white">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border rounded-lg p-4 md:p-6 shadow-lg text-center dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
              <p className="text-gray-600 italic dark:text-gray-400 text-sm md:text-base line-clamp-4">
                &quot;{testimonial.testimonial}&quot;
              </p>
              <p className="text-lg font-semibold mt-4 dark:text-white">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
