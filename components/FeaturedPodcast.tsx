import Image from "next/image";

function FeaturedPodcast() {
  return (
    <div className="grid grid-cols-2 gap-4 content-center">
      <div className="flex flex-col justify-around">
        <h2 className="text-xl font-bold">Featured Podcast</h2>
        <div>
          It's a show about the life of the digital nomads all over the world
          and what they struggle with or what happens to them when they travel.
        </div>
      </div>
      <div className="relative mx-auto text-center">
        <Image
          alt="Featured Podcast"
          src="/images/james-clarkson-show.jpg"
          height={500}
          width={500}
          className="rounded-3xl"
        />
      </div>
    </div>
  );
}

export default FeaturedPodcast;
