import React from "react";
import Layout from "../ui/Layout";
import Head from "next/head";
import { DEFAULT_METADATA, LOGOTEXT } from "@/src/constants";

const Page = (props) => {
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/logo.png" /> 
        <title>
          {props.page.toString()} | {props.title.toString()}
        </title>
        {props.meta.map((item,index) => (
          <meta {...item} key={index} />
        ))}
      </Head>
      {props.children}
    </Layout>
  );
};

Page.defaultProps = {
  title: LOGOTEXT,
  page: LOGOTEXT,
  meta: DEFAULT_METADATA,
};

export default Page;