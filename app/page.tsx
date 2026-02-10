import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#FFA902] mb-6">
              Welcome to My <br /> Local Service
            </h1>

            <p className="mt-4 max-w-lg text-xl leading-6 text-gray-700">
              Discover electricians, plumbers, mechanics, and different kinds of service providers rated and reviewed
              <br />by real clients.
            </p>

            <button className="mt-6 rounded-2xl bg-[#0065FF] px-6 py-4 text-lg  text-white hover:bg-[#FFA902] transition-colors">
              <Link href="/auth/signup">Get Started</Link>
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl">
              <Image
                src="/Home/Pic1.jfif"
                alt="pic1"
                width={700}
                height={450}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-800">How it Works?</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <HowCard
            img="/Home/Pic2.jfif"
            title="Search Local Providers"
            desc="Browse trusted providers in your area and compare ratings."
          />
          <HowCard
            img="/Home/Pic3.jfif"
            title="Hire & Rate"
            desc="Book a service and rate the provider based on performance."
          />
          <HowCard
            img="/Home/Pic4.jfif"
            title="Build Trust Together"
            desc="Trust grows when communities share real experiences."
          />
        </div>
      </section>
    </main>
  );
}

function HowCard({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white aspect-square flex flex-col justify-between">
      <div className="relative mb-4 overflow-hidden rounded-lg w-full" style={{height: '300px'}}>
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 px-4">{title}</h3>
      <p className="mt-2 text-gray-400 px-4 pb-6">{desc}</p>
    </div>
  );
}