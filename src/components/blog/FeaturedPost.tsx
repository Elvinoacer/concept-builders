
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Post } from "@/generated/prisma";

const FeaturedPost = ({ post }: { post: Post }) => {
  if (!post) {
    return null; 
  }

  const description = post.content.replace(/<[^>]*>?/gm, '').trim().substring(0, 150) + '...';

  return (
    <div className="group mb-8 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/10">
      <Link href={`/blog/${post.id}`}>
        <div className="md:flex">
          <div className="md:w-1/2 lg:w-3/5">
            <Image
              src={post.image || ''}
              alt={post.title}
              width={600}
              height={360}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:w-1/2 lg:w-2/5 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Post
            </p>
            <h2 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tighter text-foreground md:text-3xl">
              {post.title}
            </h2>
            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
              {description}
            </p>
            <div className="mt-6">
                <Button variant="outline">Read More</Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const FeaturedPostSkeleton = () => {
    return (
        <div className="mb-8 overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="md:flex">
                <div className="h-64 w-full animate-pulse bg-muted md:h-auto md:w-1/2 lg:w-3/5"></div>
                <div className="p-6 md:w-1/2 lg:w-2/5 md:p-8">
                    <div className="h-4 w-1/4 animate-pulse rounded-md bg-muted"></div>
                    <div className="mt-4 h-8 w-full animate-pulse rounded-md bg-muted md:h-10"></div>
                    <div className="mt-1 h-8 w-3/4 animate-pulse rounded-md bg-muted md:h-10"></div>
                    <div className="mt-6 h-5 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="mt-2 h-5 w-5/6 animate-pulse rounded-md bg-muted"></div>
                    <div className="mt-2 h-5 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="mt-8 h-12 w-32 animate-pulse rounded-md bg-muted"></div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedPost;
