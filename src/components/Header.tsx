import Link from "next/link";
import { getCollections, load } from "outstatic/server";

const Header = async () => {
  const { pages, collections } = await getData();

  return (
    <nav className="py-4 fixed bottom-0 border-t md:bottom-auto md:top-0 w-full bg-white z-10 border-b">
      <div className="max-w-6xl mx-auto px-5 w-full layout flex items-center justify-between">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ul className="flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
          {pages.map(({ title, slug }) => (
            <li key={slug}>
              <Link href={`/${slug}`} className="hover:underline capitalize">
                {title}
              </Link>
            </li>
          ))}
          {collections.map((collection) => (
            <li key={collection}>
              <Link
                href={`/${collection}`}
                className="hover:underline capitalize"
              >
                {collection}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

async function getData() {
  const db = await load();

  // get all pages
  const pages = await db
    .find(
      {
        collection: "pages",
        slug: { $nin: ["home"] },
        status: "published",
      },
      ["title", "slug"]
    )
    .toArray();

  const collections = getCollections().filter(
    (collection) => collection !== "pages"
  );

  return {
    pages,
    collections,
  };
}

export default Header;
