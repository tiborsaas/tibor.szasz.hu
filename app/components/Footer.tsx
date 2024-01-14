import { outlineButton } from "@/lib/tailwind-classes";

export function Footer({ mainPage = true }: { mainPage?: boolean }) {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <div className="container mx-auto px-5">
        <div className="py-8 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl font-bold lg:text-5xl tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Stalk me
          </h3>
          <div className="flex flex-col lg:flex-row justify-end items-center lg:pl-4 lg:w-1/2">
            {mainPage && (
              <a href="/blog" className={outlineButton}>
                Blog
              </a>
            )}
            {!mainPage && (
              <a href="/" className={outlineButton}>
                Main page
              </a>
            )}
            <a href="https://github.com/tiborsaas" className={outlineButton}>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/tiborszasz/"
              className={outlineButton}
            >
              In
            </a>
            <a href="https://twitter.com/tiborsaas" className={outlineButton}>
              X
            </a>
            <a
              href="https://mastodon.social/@tiborsaas"
              className={outlineButton}
              rel="me"
            >
              M
            </a>
            <a href="mailto:tibor@szasz.hu" className={outlineButton}>
              @
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
