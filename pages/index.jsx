import Image from "next/image";
import Layout from "@/src/components/ui/Layout";
import NavbarFixed from "@/src/components/sections/Navbar/NavbarFixed";
import Typography from "@/src/components/ui/Typography";
import Page from "@/src/components/pages";
import { File, Info, ListTodo, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

const TITLE = "Welcome to CAPLAB";
const HEADLINE = "All your projects in one place!";
const DESCRIPTION = "A centralized repository designed to facilitate seamless collaboration on various projects, fostering a conducive environment for team members to work together effortlessly and efficiently";
const HERO_SRC = "/images/hero.png";
const FEATURES = [
  {
    title: "Status Tracking",
    description: "Keep track of the status of your projects and tasks.",
    image: "/images/status-tracking-feature.png",
    badgeColor: "bg-purple-500",
    Icon: <ListTodo />
  },
  {
    title: "Project Description",
    description: "Add a description to your projects and tasks.",
    image: "/images/project-description-feature.png",
    badgeColor: "bg-red-500",
    Icon: <Info />
  },
  {
    title: "File Sharing",
    description: "Share files and documents with your team members.",
    image: "/images/file-sharing-feature.png",
    badgeColor: "bg-orange-500",
    Icon: <File />
  },
  {
    title: "Team Collaboration",
    description: "Collaborate with team members on projects and discuss realtime.",
    image: "/images/team-collaboration-feature.png",
    badgeColor: "bg-green-500",
    Icon: <MessageCircle />
  },
];

export default function Home() {
  return (
    <Page title={TITLE}>
      <Layout.Col className="dark:bg-gradient-to-b from-white/5  via-fuchsia-900/40 to-background-dark">
        <NavbarFixed withLogo={true} />
        <Layout.Container className="max-w-4xl">
          <Layout.Col className="py-24 bg-[url('/images/grid-pattern-dark.svg')] dark:bg-[url('/images/grid-pattern-light.svg')] bg-opacity-10 bg-center text-center gap-4 justify-center items-center border-x dark:border-white/5">
            <Typography.Title className="text-center font-black lg:text-7xl">
              {HEADLINE}
            </Typography.Title>
            <Typography className="w-3/4 opacity-75">
              {DESCRIPTION}
            </Typography>
            <img src={HERO_SRC} />
          </Layout.Col>
          <Layout.Col className="mb-[500px] gap-12 md:gap-0">
            {FEATURES.map((feature, featureIndex) => {
              return <Layout.Col className="sticky rounded-md bg-background-light dark:bg-background-dark/50 z-10 backdrop-blur-3xl top-10 gap-8 p-4 md:p-16 border dark:border-white/5" key={`feature-${featureIndex}`}>
                <Layout.Col>
                  <Layout.Row className={twMerge("absolute -top-8 right-4 text-white p-2 md:p-4 rounded-full",feature.badgeColor)}>
                    {feature.Icon}
                  </Layout.Row>
                  <Typography.Title className="font-bold text-lg md:text-2xl">
                    {feature.title}
                  </Typography.Title>
                  <Typography className="opacity-80">
                    {feature.description}
                  </Typography>
                </Layout.Col>
                <img src={feature.image} className="brightness-125 rounded-xl shadow-xl" />
              </Layout.Col>
            })}
          </Layout.Col>
        </Layout.Container>
      </Layout.Col>
      <footer className="bg-background-light dark:bg-background-dark border-t dark:border-white/5">
        <Layout.Container className="py-8">
          <Typography className="text-center opacity-75">
            &copy; 2022 CAPLAB. All rights reserved.
          </Typography>
        </Layout.Container>
      </footer>
    </Page>
  );
}
