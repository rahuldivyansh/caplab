import React from 'react'
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import '@/styles/globals.css'
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "next/router"
import nProgress from 'nprogress';
import AuthProvider from '@/src/providers/Auth';
import { ToastContainer } from 'react-toastify';

Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

export default function App({ Component, pageProps }) {

  return <AuthProvider>
    <Component {...pageProps} />
    <ToastContainer position='bottom-right'/>
  </AuthProvider>
}