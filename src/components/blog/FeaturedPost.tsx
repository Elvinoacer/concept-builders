import Image from "next/image";
import Link from "next/link";
import { Post } from "@/generated/prisma/browser";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui-premium/gold-button";
import GlassCard from "@/components/ui-premium/glass-card";
import { Calendar, User, ArrowRight } from "lucide-react";

const FeaturedPost = ({ post }: { post: Post }) => {
  if (!post) {
    return null; 
  }

  const description = post.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 180) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-12 sm:mb-20"
    >
      <Link href={`/blog/${post.id}`}>
        <GlassCard className="p-0 sm:p-0 md:p-0 overflow-hidden group" hover>
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-3/5 relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden">
              <Image
                src={post.image || ''}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:w-2/5 relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20">
                  Featured Article
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight uppercase tracking-tight group-hover:text-gold transition-colors duration-500">
                {post.title}
              </h2>

              <p className="text-cream-dim text-base sm:text-lg mb-8 line-clamp-3 font-medium leading-relaxed">
                {description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-10 text-xs font-black text-gold/60 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author || "Concept Builders"}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>

              <GoldButton 
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-fit"
              >
                Read Article
              </GoldButton>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

export const FeaturedPostSkeleton = () => {
    return (
        <div className="mb-12 sm:mb-20 overflow-hidden rounded-3xl border-2 border-cb-border bg-card shadow-2xl animate-pulse">
            <div className="lg:flex">
                <div className="h-64 lg:h-[450px] w-full lg:w-3/5 bg-surface relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="p-8 sm:p-12 lg:w-2/5 space-y-8">
                    <div className="h-6 w-32 bg-surface rounded-full"></div>
                    <div className="space-y-4">
                      <div className="h-10 w-full bg-surface rounded-xl"></div>
                      <div className="h-10 w-4/5 bg-surface rounded-xl"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-surface rounded-md"></div>
                      <div className="h-4 w-full bg-surface rounded-md"></div>
                      <div className="h-4 w-3/4 bg-surface rounded-md"></div>
                    </div>
                    <div className="h-14 w-40 bg-surface rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedPost;
