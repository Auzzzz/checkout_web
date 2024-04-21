import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddItems from "~/components/Dashboard/add/addItems";

import { useSession } from "next-auth/react";
import { getAPI } from "~/server/getAPI";

import AddUsers from "~/components/Dashboard/add/addUsers";
import AddVenues from "~/components/Dashboard/add/addVenues";
import AddGroups from "~/components/Dashboard/add/addGroups";
import toast from "react-hot-toast";
import { set } from "zod";


function Dashboard() {
  const { data: session } = useSession();
  const [option, setOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState([]);
  const error = useState(false);
  const router = useRouter();
  const actionButtons = [
    { id: 0, name: "Configure Users", ep: "v1/user", idv: "Users" },
    { id: 1, name: "Configure Items", ep: "v1/item", idv: "Items" },
    { id: 2, name: "Configure Venues", ep: "v1/venue", idv: "Venues" },
    { id: 3, name: "Configure Groups", ep: "v1/group", idv: "Groups" },
  ];

  const selectionGetter = async (id: number) => {
    setLoading(true);
    const url = actionButtons[id]!.ep + "/all";

    try {
      const get = await getAPI(
        url,
        session!.user.raw.access_token,
        session!.user.id
      );

      if (get.length === 0 || get === undefined || get === null) {
        toast.error("Error fetching data 1", { duration: 5000 });
        setLoading(false);
        return;
      }
      setLoading(false);
      setValues(get);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error fetching data 2" + error, { duration: 5000 });
    }
  };

  const buttonOnPress = (id: number) => {
    setValues([]);
    setOption(id);
    selectionGetter(id);
  };

  const handleEdit = (id: number) => {
    router.push(actionButtons[option]!.idv + "/" + id);
  }

  return (
    <Grid
      item
      xs={12}
      container
      alignItems="stretch"
      sx={{ textAlign: "center" }}
    >
      <Grid item xs={12}>
        {actionButtons.map((action) => (
          <Button
            sx={{ m: 1 }}
            variant="contained"
            color="primary"
            key={action.id}
            onClick={() => buttonOnPress(action.id)}
            disabled={loading}
          >
            {action.name}
          </Button>
        ))}
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
        container
        display="flex"
        sx={{ textAlign: "center", mt: 1 }}
      >
        <Box height="100%" sx={{ mx: 4 }}>
          {option === 0 && <AddUsers />}
          {option === 1 && <AddItems />}
          {option === 2 && <AddVenues />}
          {option === 3 && <AddGroups />}
        </Box>
      </Grid>

      {values.length && values.map(
        (value: { id: number; name: string; description: string }) => (
          // <Typography key={value.id}>{value.name}</Typography>

          <>
            <Grid
              key={value.id}
              item
              md={7}
              xs={12}
              container
              sx={{ mt: 2, px: 3, bgcolor: "red", p: 2 }}
              display="flex"
              wrap="nowrap"
            >
              <Grid
                key={value.id}
                item
                style={{ overflowWrap: "break-word" }}
                xs={9}
                md={7}
                sx={{ mr: 1 }}
              >
                {value.id}
                {value.name}
                {value.description}1
              </Grid>

              <Grid item xs={3} md={4}>
                <Button
                key={value.id}
                  variant="contained"
                  color="primary"
                  sx={{ m: 1 }}
                  onClick={() => handleEdit(value.id)}
                >
                  Modify {value.id}
                </Button>
              </Grid>
            </Grid>
          </>
        )
      )}
    </Grid>
  );
}

export default Dashboard;
