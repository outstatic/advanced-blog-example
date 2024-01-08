import ContentGrid from "@/components/content-grid";
import DateFormatter from "@/components/date-formatter";
import markdownToHtml from "@/lib/markdownToHtml";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OstDocument } from "outstatic";
import { getCollections, load } from "outstatic/server";

type Document = {
  tags: { value: string; label: string }[];
} & OstDocument;

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata(params: Params): Promise<Metadata> {
  const { doc } = await getData(params);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(`/${doc.collection}/${doc.slug}`),
      images: [
        {
          url: absoluteUrl(doc?.coverImage || `/api/og?title=${doc.title}`),
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: absoluteUrl(doc?.coverImage || `/api/og?title=${doc.title}`),
    },
  };
}

export default async function Document(params: Params) {
  const { doc, moreDocs } = await getData(params);

  if (!doc) {
    const { docs, collection } = moreDocs;
    return (
      <div className="mb-16">
        {docs.length > 0 && (
          <ContentGrid
            title={`All ${collection}`}
            items={docs}
            collection={collection}
          />
        )}
      </div>
    );
  }

  if (doc.collection === "pages") {
    return (
      <article className="mb-32">
        <div
          className="prose lg:prose-2xl prose-outstatic"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </article>
    );
  }

  return (
    <>
      <article className="mb-32">
        <div className="relative mb-2 md:mb-4 sm:mx-0 w-full h-52 md:h-96">
          <Image
            alt={doc.title}
            src={doc.coverImage || `/api/og?title=${doc.title}`}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {Array.isArray(doc?.tags)
          ? doc.tags.map(({ label }) => (
              <span
                key="label"
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {label}
              </span>
            ))
          : null}
        <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
          {doc.title}
        </h1>
        <div className="hidden md:block md:mb-12 text-slate-600">
          Written on <DateFormatter dateString={doc.publishedAt} /> by{" "}
          {doc?.author?.name || ""}.
        </div>
        <hr className="border-neutral-200 mt-10 mb-10" />
        <div className="max-w-2xl mx-auto">
          <div
            className="prose lg:prose-xl prose-outstatic"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </div>
      </article>
      <div className="mb-16">
        {moreDocs.length > 0 && (
          <ContentGrid
            title={`More ${doc.collection}`}
            items={moreDocs}
            collection={doc.collection}
          />
        )}
      </div>
    </>
  );
}

async function getData({ params }: Params) {
  const db = await load();
  let slug = params.slug[1];
  let collection = params.slug[0];

  // check if we have two slugs, if not, we are on a collection archive or a page
  if (!params.slug || params.slug.length !== 2) {
    if (collection !== "pages") {
      const docs = await db
        .find({ collection }, ["title", "slug", "coverImage", "description"])
        .toArray();

      // if we have docs, we are on a collection archive
      if (docs.length) {
        return {
          moreDocs: {
            docs,
            collection,
          },
        };
      }
    }

    // if we don't have docs, we are on a page
    slug = params.slug[0];
    collection = "pages";
  }

  // get the document
  const doc = await db
    .find<Document>({ collection, slug }, [
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

  if (!doc) {
    notFound();
  }

  const content = await markdownToHtml(doc.content);

  const moreDocs =
    collection === "pages"
      ? []
      : await db
          .find({ collection: params.slug[0], slug: { $ne: params.slug[1] } }, [
            "title",
            "slug",
            "coverImage",
            "description",
          ])
          .toArray();

  return {
    doc: {
      ...doc,
      content,
    },
    moreDocs,
  };
}

export async function generateStaticParams() {
  const db = await load();
  const collections = getCollections().filter(
    (collection) => collection !== "pages"
  );

  // get all documents, except those in the posts collection and the home page
  // as we have a specific route for them (/posts)
  const items = await db
    .find(
      {
        $nor: [{ collection: "posts" }, { collection: "pages", slug: "home" }],
        status: "published",
      },
      ["collection", "slug"]
    )
    .toArray();

  // pages should be at the root level
  const slugs = items.map(({ collection, slug }) => ({
    slug: collection === "pages" ? [slug] : [collection, slug],
  }));

  collections.forEach((collection) => {
    slugs.push({
      slug: [collection],
    });
  });

  return slugs;
}
