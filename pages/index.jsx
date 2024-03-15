import Image from "next/image";
import Layout from "@/src/components/ui/Layout";
import NavbarFixed from "@/src/components/sections/Navbar/NavbarFixed";
import Typography from "@/src/components/ui/Typography";
import Page from "@/src/components/pages";

const TITLE = "Welcome to CAPLAB";
const HEADLINE = "All your projects in one place!";
const DESCRIPTION = "A centralized repository designed to facilitate seamless collaboration on various projects, fostering a conducive environment for team members to work together effortlessly and efficiently";
const HERO_SRC = "/images/hero.png";
const FEATURES = [
  {
    title: "Status Tracking",
    description: "Keep track of the status of your projects and tasks",
    image: "/images/status-tracking-feature.png",
  },
  {
    title: "Project Description",
    description: "Add a description to your projects and tasks",
    image: "/images/project-description-feature.png",
  },
  {
    title: "File Sharing",
    description: "Share files and documents with your team members",
    image: "/images/status-tracking-feature.png",
  },
  {
    title: "Team Collaboration",
    description: "Collaborate with team members on projects and tasks",
    image: "/images/status-tracking-feature.png",
  },
];

export default function Home() {
  return (
    <Page title={TITLE}>
      <Layout.Col className="dark:bg-gradient-to-b from-white/5 via-primary/10 to-background-dark">
        <NavbarFixed withLogo={true} />
        <Layout.Container className="max-w-4xl">
          <Layout.Col className="py-24 text-center gap-4 justify-center items-center border-x dark:border-white/5">
            <Typography.Title className="text-center font-black lg:text-7xl">
              {HEADLINE}
            </Typography.Title>
            <Typography className="w-3/4 opacity-90">
              {DESCRIPTION}
            </Typography>
            <img src={HERO_SRC} />
          </Layout.Col>
          <Layout.Col className="mb-[500px]">
            {FEATURES.map((feature, featureIndex) => {
              return <Layout.Col className="sticky z-10 backdrop-blur-3xl top-1 gap-8 md:p-16 border dark:border-white/5" key={`feature-${featureIndex}`}>
                  <Layout.Col>
                    <Typography.Title className="font-bold">
                      {feature.title}
                    </Typography.Title>
                    <Typography className="opacity-80">
                      {feature.description}
                    </Typography>
                  </Layout.Col>
                  <img src={feature.image} className="brightness-125 rounded-xl shadow-xl"/>
                </Layout.Col>
            })}
          </Layout.Col>
        </Layout.Container>
      </Layout.Col>
    </Page>
  );
}
