import PodcastCreator from "@/components/PodcastCreator";
import ShowPodcast from "@/components/ShowPodcast";
import Image from "next/image";

export default function Home() {
  return (
    <main className="px-4">
      <div className="lg:flex lg:flex-cols-2 mx-auto max-w-7xl pt-24 pb-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="display-1">Welcome to my chat app</h1>
          <PodcastCreator />
        </div>
        <ShowPodcast />
      </div>
    </main>
  );
}
