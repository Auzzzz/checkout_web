import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAPI } from "~/server/getAPI";
import { EntireGroup } from "~/dbTypes";
import ModifyGroups from "~/components/Dashboard/modify/modifyGroups";


export default function GroupsDetail() {
  const router = useRouter();
  //   const { id } = router.query;
  const [completed, setCompleted] = useState(false);
  const test = false
  const { data: session } = useSession();
  const [groupData, setGroupData] = useState<EntireGroup>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get id needs to be in useEffect
    const { id } = router.query;

    if (!id) {
      return;
    }

    const fetchData = async () => {
      const url = "v1/group/" + id;
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

        toast.dismiss();
        setGroupData(get);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data 2" + error, { duration: 1000 });
      }
    };
    fetchData();
  }, [router, session, completed]);

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

  if (!groupData || groupData.name === undefined || groupData.name === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        No Item found
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
          <Button onClick={() => router.back()}>Back</Button>
          <Box sx={{ m: 2, px: 3 }}>
            <h1>
              {groupData.name} #{groupData.id}
            </h1>
            <ModifyGroups GroupData={groupData} onUpdate={() => setCompleted(true)} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
