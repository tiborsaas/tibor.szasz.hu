import Shader from "../components/Shader";
import WorkEntry from "../components/WorkEntry";
import { LogoFun } from "../components/LogoFun";
import { Footer } from "../components/Footer";

import Monogram from "../../index-portfolio/img/svg/monogram.min.svg";
import StunnPic from "../../index-portfolio/img/works/stunn_app.jpg";
import CloudDeckPic from "../../index-portfolio/img/works/clouddeck.jpg";
import SpeaklekPic from "../../index-portfolio/img/works/speakle.jpg";
import InstartPic from "../../index-portfolio/img/works/instart.jpg";
import HumuPic from "../../index-portfolio/img/works/humanmusic.jpg";
import SlideshowPic from "../../index-portfolio/img/works/image2slideshow.jpg";
import Link from "next/link";

export default function Page() {
  return (
    <section className="container mx-auto px-5">
      <h1 className="flex font-bold text-5xl tracking-tighter leading-tight mt-6 mb-5">
        <img src={Monogram.src} width="48" className="mr-4" /> Tibor Szász
      </h1>
      <p className="mb-8">
        Organic stochastic autonomous agent oscillating between frontend and
        backend.
        <br /> Check out{" "}
        <Link href="/blog" className="underline">
          my blog
        </Link>
        .
      </p>
      <div className="relative flex justify-end bg-white mb-16 overflow-hidden">
        <p className="absolute left-0 top-8 w-2/3 text-4xl font-bold mix-blend-difference text-white">
          I'm a software engineer who enjoys building unique products. The web
          is my playground where I feel home.
          <br />
          <br />I find beauty when my work solves problems by design.
        </p>
        <Shader />
      </div>
      <article className="mb-32">
        <h1 className="font-bold text-5xl tracking-tighter mb-8">
          Active projects
        </h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <WorkEntry
            image={SpeaklekPic}
            title="Speakle"
            description="This is a fun take on the Wordle game."
            buttonText="Visit project"
            link="https://speakle.app"
          />
          <WorkEntry
            image={InstartPic}
            title="Instart design"
            description="A generative art project based on AI image generators."
            buttonText="Visit project"
            link="https://instart.design"
          />
          <WorkEntry
            image={HumuPic}
            title="Human music TV"
            description="A 24/7 playing online music TV featuring indie music artists."
            buttonText="Visit project"
            link="https://humanmusic.tv"
          />
          <WorkEntry
            image={SlideshowPic}
            title="Image2slideshow"
            description="A utility app to help people create slideshows. Built in a day."
            buttonText="Visit project"
            link="https://image2slideshow.com"
          />
        </div>
      </article>
      <article className="mb-32">
        <h1 className="font-bold text-5xl tracking-tighter mb-8">
          Past projects
        </h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <WorkEntry
            image={StunnPic}
            grayscale
            title="Stunn video editor"
            description="Stunn Editor was a great project to explore the possibilities of video editing in the browser. My part was to create the front-end side of the app from the landing page to the editor. I also researched a way to render video server side with simply using HTML and CSS animations."
          />
          <WorkEntry
            image={CloudDeckPic}
            grayscale
            title="CloudDeck desktop music player"
            description="This was one of my first large scale projects. The idea was to bring online music streaming to the desktop."
          />
        </div>
      </article>
      <article className="mb-32 py-64 flex flex-col jusify-center">
        <div className="text-center flex-col flex m-auto items-center">
          <LogoFun />
        </div>
      </article>
      <Footer />
    </section>
  );
}
