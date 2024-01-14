import Link from "next/link";
import { draftMode } from "next/headers";

import MoreStories from "../../blog/more-stories";
import Avatar from "../../blog/avatar";
import Date from "../../blog/date";
import CoverImage from "../../blog/cover-image";
import Monogram from "../../../../index-portfolio/img/svg/monogram.min.svg";

import { Markdown } from "@/lib/markdown";
import { getAllPosts, getPostAndMorePosts } from "@/lib/api";
import { Footer } from "@/app/components/Footer";

export async function generateStaticParams() {
  const allPosts = await getAllPosts(false);

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled } = draftMode();
  const { post, morePosts } = await getPostAndMorePosts(params.slug, true);

  return (
    <div className="container mx-auto px-5">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-12 mt-8">
        <Link href="/blog" className="hover:underline">
          <img src={Monogram.src} width="48" alt="Blog home" />
        </Link>
      </h2>
      <article>
        <h1 className="text-6xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
          {post.title}
        </h1>
        <div className="hidden md:block md:mb-12">
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture} />
          )}
        </div>
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={post.title} url={post.coverImage.url} />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="block md:hidden mb-6">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <em className="block text-lg mb-8">
            <Date dateString={post.date} />
          </em>
          <div className="prose text-lg">
            <Markdown content={post.content} />
          </div>
        </div>
      </article>
      <hr className="border-accent-2 mt-28 mb-24" />
      <MoreStories morePosts={morePosts} />
      <Footer mainPage={false} />
    </div>
  );
}
