import PodcastCreator from "@/components/PodcastCreator";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-7xl pt-24 pb-6 sm:px-6 lg:px-8">
        <h1 className="display-1">Welcome to my chat app</h1>
        <PodcastCreator />
      </div>
    </main>
  );
}
