import Head from "next/head";
import Link from "next/link";

import styles from "./index.module.css";

import { Grid } from "@mui/material";

export default function Home() {
  return (
    <>
      <Head>
        <title>Checkout App</title>
        <meta name="description" content="Check-it-out" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1 className={styles.title}>Welcome to the Checkout App</h1>
        </Grid>
      </Grid>
    </>
  );
}
