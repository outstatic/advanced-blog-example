import ContentGrid from "@/components/ContentGrid";
import DateFormatter from "@/components/DateFormatter";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import markdownToHtml from "@/lib/markdownToHtml";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OstDocument } from "outstatic";
import { getCollections, load } from "outstatic/server";

type Post = {
  tags: { value: string; label: string }[];
} & OstDocument;

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata(params: Params): Promise<Metadata> {
  const { post } = await getData(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(`/${post.collection}/${post.slug}`),
      images: [
        {
          url: absoluteUrl(post?.coverImage || `/api/og?title=${post.title}`),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: absoluteUrl(post?.coverImage || `/api/og?title=${post.title}`),
    },
  };
}

export default async function Post(params: Params) {
  const { post, moreDocs } = await getData(params);

  if (!post) {
    const { docs, collection } = moreDocs;
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-5">
          <Header />
          <div className="mb-16">
            {docs.length > 0 && (
              <ContentGrid
                title={`All ${collection}`}
                items={docs}
                collection={collection}
              />
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        <article className="mb-32">
          <div className="relative mb-2 md:mb-4 sm:mx-0 w-full h-52 md:h-96">
            <Image
              alt={post.title}
              src={post.coverImage || `/api/og?title=${post.title}`}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {Array.isArray(post?.tags)
            ? post.tags.map(({ label }) => (
                <span
                  key="label"
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {label}
                </span>
              ))
            : null}
          <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
            {post.title}
          </h1>
          <div className="hidden md:block md:mb-12 text-slate-600">
            Written on <DateFormatter dateString={post.publishedAt} /> by{" "}
            {post?.author?.name || ""}.
          </div>
          <hr className="border-neutral-200 mt-10 mb-10" />
          <div className="max-w-2xl mx-auto">
            <div
              className="prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
        <div className="mb-16">
          {moreDocs.length > 0 && (
            <ContentGrid
              title={`More ${post.collection}`}
              items={moreDocs}
              collection={post.collection}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

async function getData({ params }: Params) {
  const db = await load();

  if (!params.slug || params.slug.length !== 2) {
    const docs = await db
      .find({ collection: params.slug[0] }, ["title", "slug", "coverImage"])
      .toArray();

    if (!docs.length) {
      notFound();
    }

    return {
      moreDocs: {
        docs,
        collection: params.slug[0],
      },
    };
  }

  const post = await db
    .find<Post>({ collection: params.slug[0], slug: params.slug[1] }, [
      "collection",
      "title",
      "publishedAt",
      "description",
      "slug",
      "author",
      "content",
      "coverImage",
      "tags",
    ])
    .first();

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content);

  const moreDocs = await db
    .find({ collection: params.slug[0], slug: { $ne: params.slug[1] } }, [
      "title",
      "slug",
      "coverImage",
    ])
    .toArray();

  return {
    post: {
      ...post,
      content,
    },
    moreDocs,
  };
}

export async function generateStaticParams() {
  const db = await load();
  const collections = getCollections();
  // get all posts, except those in the pages and posts collection
  const items = await db
    .find(
      {
        $nor: [{ collection: "posts" }, { collection: "pages" }],
        status: "published",
      },
      ["collection", "slug"]
    )
    .toArray();

  const slugs = items.map(({ collection, slug }) => ({
    slug: [collection, slug],
  }));

  collections.forEach((collection) => {
    if (collection === "posts" || collection === "pages") return;
    slugs.push({
      slug: [collection],
    });
  });

  return slugs;
}
