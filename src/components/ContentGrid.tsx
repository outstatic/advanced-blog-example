import Image from "next/image";
import Link from "next/link";
import type { OstDocument } from "outstatic";

type Item = {
  tags?: { value: string; label: string }[];
} & OstDocument;

type Props = {
  collection: string;
  title?: string;
  items: Item[];
  priority?: boolean;
  viewAll?: boolean;
};

const ContentGrid = ({
  title = "More",
  items,
  collection,
  priority = false,
  viewAll = false,
}: Props) => {
  return (
    <section id={collection}>
      <div className="flex gap-8 items-center">
        <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight capitalize">
          {title}
        </h2>
        {viewAll ? <Link href={`/${collection}`}>View all</Link> : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mb-8">
        {items.map((item, id) => (
          <Link key={item.slug} href={`/${collection}/${item.slug}`}>
            <div className="cursor-pointer border rounded-md md:w-full scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 hover:shadow overflow-hidden">
              <div className="sm:mx-0">
                <Image
                  src={item.coverImage || `/api/og?title=${item.title}`}
                  alt=""
                  className="object-cover object-center w-full h-auto"
                  width={0}
                  height={0}
                  sizes="(min-width: 768px) 347px, 192px"
                  priority={priority && id <= 2}
                />
              </div>
              <div className="p-4">
                {Array.isArray(item?.tags)
                  ? item.tags.map(({ label }) => (
                      <span
                        key={label}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {label}
                      </span>
                    ))
                  : null}
                <h3 className="text-xl mb-2 leading-snug font-bold hover:underline">
                  {item.title}
                </h3>
                <div className="text-md mb-4 text-slate-700"></div>
                <p className="text-lg leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContentGrid;
