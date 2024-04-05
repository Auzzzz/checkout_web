import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import "~/styles/globals.css";
import Navbar from "../components/navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={inter.className}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster position="bottom-center" />
      </main>
    </SessionProvider>
  );
};

export default MyApp;
