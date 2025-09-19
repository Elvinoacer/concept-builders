import React from 'react';
import { testimonials } from '@/lib/testimonials';
import Image from 'next/image';

const Testimonials = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border rounded-lg p-6 shadow-lg text-center dark:bg-gray-800 dark:border-gray-700">
              <Image src={testimonial.image} alt={testimonial.name} width={100} height={100} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <p className="text-gray-600 italic dark:text-gray-400">"{testimonial.testimonial}"</p>
              <p className="text-lg font-semibold mt-4 dark:text-white">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
