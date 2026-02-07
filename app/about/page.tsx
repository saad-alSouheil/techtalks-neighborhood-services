import Image from "next/image";
import { CheckCircle } from "@mui/icons-material";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[350px] md:h-[400px] w-full rounded-xl overflow-hidden order-2 md:order-1">
              <Image
                src="/About/Pic1.jfif"
                alt="Collaboration - hands connecting like puzzle pieces"
                fill
                className="object-contain"
                priority
              />
          </div>
          <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0d9488] mb-6">
                Finding Reliable Help Shouldn&apos;t Be a Gamble
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Most people rely on word of mouth to find reliable service providers. 
                Online reviews are often fake, outdated, or unreliable. One bad choice 
                can cost time, money, and trust. Luckily, you don&apos;t have to worry 
                about this issue now!
              </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16 md:mt-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#dc2626] mb-6">
              A Trust System Built on Real Work
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-800">
                <CheckCircle sx={{ color: "#171717", fontSize: 22, flexShrink: 0, mt: 0.25 }} />
                <span>Reviews only after completed services</span>
              </li>
              <li className="flex items-start gap-3 text-gray-800">
                <CheckCircle sx={{ color: "#171717", fontSize: 22, flexShrink: 0, mt: 0.25 }} />
                <span>Ratings based on reliability, punctuality, and fair pricing</span>
              </li>
              <li className="flex items-start gap-3 text-gray-800">
                <CheckCircle sx={{ color: "#171717", fontSize: 22, flexShrink: 0, mt: 0.25 }} />
                <span>Trust scores that grow over time</span>
              </li>
              <li className="flex items-start gap-3 text-gray-800">
                <CheckCircle sx={{ color: "#171717", fontSize: 22, flexShrink: 0, mt: 0.25 }} />
                <span>Neighbourhood-based recommendations</span>
              </li>
            </ul>
          </div>
          <div className="relative h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden">
            <Image
              src="/About/Pic2.jfif"
              alt="Ideas and innovation - hands holding lightbulb"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
