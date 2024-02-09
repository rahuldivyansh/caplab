import Image from "next/image";
import Layout from "@/src/components/ui/Layout";
import NavbarFixed from "@/src/components/sections/Navbar/NavbarFixed";
import Typography from "@/src/components/ui/Typography";

export default function Home() {
  return (
    <Layout.Col>
      <NavbarFixed withLogo={true}/>
      <Layout.Container className="max-w-4xl">
        <Layout.Col className="py-24 text-center gap-4 justify-center items-center">
          <Typography.Title className="text-center font-black lg:text-5xl">
            Welcome to caplab
          </Typography.Title>
          <Typography>
            A centralized repository designed to facilitate seamless
            collaboration on various projects, fostering a conducive environment
            for team members to work together effortlessly and efficiently
          </Typography>
          <Image src="https://illustrations.popsy.co/blue/home-office.svg" width={360} height={360}/>
        </Layout.Col>
      </Layout.Container>
    </Layout.Col>
  );
}
