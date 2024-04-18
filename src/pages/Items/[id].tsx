import { Box, CircularProgress, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { get } from "node_modules/axios/index.cjs";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAPI } from "~/server/getAPI";
import { Items } from "~/dbTypes";
import { set } from "zod";
import { error } from "console";

export default function ItemsDetail() {
  const router = useRouter();
//   const { id } = router.query;
  const { data: session } = useSession();
  const [itemData, setItemData] = useState<Items>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get id needs to be in useEffect
    const {id} = router.query

    if(!id) {
        return;
      }

    const fetchData = async () => {
        const url = "v1/item/" + id;
        try {
            const get = await getAPI(
            url,
            session!.user.raw.access_token,
            session!.user.id
            );
    
            if (get === undefined || get.length === 0) {
            toast.error("Error fetching data 1", { duration: 5000 });
            return;
            }

            setItemData(get);
            setLoading(false);
        } catch (error) {

            toast.error("Error fetching data 2" + error, { duration: 5000 });
        }
    }
    fetchData();

  }, [router]);


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!itemData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        No Item found with ID #
      </Box>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          minHeight="100vh"
        >
          <Box>
            <h1>{itemData.item.name}</h1>
            <p>{itemData.item.description}</p>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
