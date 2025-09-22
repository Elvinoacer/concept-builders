import { staticStyles, staticHtmlContent } from '@/lib/blog-content';

const BlogPostPage = () => {
    return (
        <>
            <style>{staticStyles}</style>
            <div dangerouslySetInnerHTML={{ __html: staticHtmlContent }} />
        </>
    )
}

export default BlogPostPage;
