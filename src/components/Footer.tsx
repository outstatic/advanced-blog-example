import { GithubIcon, LinkedinIcon } from "lucide-react";
import Link from "next/link";
import { BuiltWithOutstatic } from "./BuiltWithOutstatic";

const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full bg-foreground text-gray-400 py-10">
      <footer className="max-w-6xl container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-6">
        <div className="flex flex-col md:flex-row items-center">
          <p className="text-sm mt-4 md:mt-0">
            © Andre Vitorio {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Link
            className="group text-gray-400 hover:text-white mr-2 px-2"
            href="https://x.com/andrevitorio"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
            >
              <title>X</title>
              <path
                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                className="fill-current text-gray-400 group-hover:text-white mr-4"
              />
            </svg>
          </Link>
          <Link
            className="text-gray-400 hover:text-white mr-4"
            href="https://github.com/avitorio"
            target="_blank"
          >
            <GithubIcon className="h-6 w-6" aria-label="Github" />
          </Link>
          <Link
            className="text-gray-400 hover:text-white"
            href="https://linkedin.com/in/andrevitorio"
            target="_blank"
          >
            <LinkedinIcon className="h-6 w-6" />
          </Link>
        </div>
        <BuiltWithOutstatic />
      </footer>
    </div>
  );
};

export default Footer;
