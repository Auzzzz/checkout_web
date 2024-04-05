import { Box, Button, Grid, Typography } from "@mui/material";
import React, { use, useState } from "react";
import DataTable from "../components/dataTable";
import AddItems from "~/components/Dashboard/add/addItems";
import DashDataTable from "~/components/Dashboard/dashDataTable";
import { getToken } from "next-auth/jwt";
import { signIn, signOut, useSession } from "next-auth/react";
import { getAPI } from "~/server/getAPI";
import { get } from "http";
import { set } from "zod";
import AddUsers from "~/components/Dashboard/add/addUsers";
import AddVenues from "~/components/Dashboard/add/addVenues";
import AddGroups from "~/components/Dashboard/add/addGroups";



function Dashboard() {
  const { data: session } = useSession();
  const [option, setOption] = useState(0);
  const actionButtons = [
    { id: 0, name: "Configure Users", call: "/users"},
    { id: 1, name: "Configure Items", call: "v1/item/all/f"},
    { id: 2, name: "Configure Venues", call: "/items" },
    { id: 3, name: "Configure Groups", call: "/items" },
  ];

  const buttonOnPress = (id: number) => {
    setOption(id);
  }

  // getAPI("v1/item/all/f", session?.user.raw.access_token || "", session?.user.id || "");

  return (
    <Grid item xs={12} container sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        {actionButtons.map((action) => (
          <Button
            sx={{ m: 1 }}
            variant="contained"
            color="primary"
            key={action.id}
            onClick={() => buttonOnPress(action.id)}
          >
            {action.name}
          </Button>
        ))}
      </Grid>
      <Grid item md={4} xs={12} container sx={{ textAlign: "center", mt: 1 }}>
        <Box sx={{ mx: 4 }}>
          {option === 0 && <AddUsers />}
          {option === 1 && <AddItems />}
          {option === 2 && <AddVenues />}
          {option === 3 && <AddGroups />}
        </Box>
      </Grid>
      <Grid item md={7} xs={12} container sx={{ textAlign: "center", mt: 2 }}>
        <DashDataTable />
      </Grid>
    </Grid>
  );
};


export default Dashboard;
