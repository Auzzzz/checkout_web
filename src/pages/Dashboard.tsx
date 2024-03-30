import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import DataTable from "../components/dataTable";
import AddItems from "~/components/Dashboard/add/addItems";
import DashDataTable from "~/components/Dashboard/dashDataTable";
import { getToken } from "next-auth/jwt";

const Dashboard = () => {
  const signedout = [{ id: 1, name: "John Doe", date: "12/1/1" }];
  const actionButtons = [
    { id: 0, name: "Configure Users" },
    { id: 1, name: "Configure Items" },
    { id: 2, name: "Configure Venues" },
    { id: 3, name: "Configure Groups" },
  ];
  const show = useState();



  return (
    <Grid item xs={12} container sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        {actionButtons.map((action) => (
          <Button sx={{ m: 1 }} variant="contained" color="primary">
            {action.name}
          </Button>
        ))}
      </Grid>
      <Grid item md={4} xs={12} container sx={{ textAlign: "center", mt: 1 }}>
        <Box sx={{ mx: 4 }}>
          <AddItems />
        </Box>
      </Grid>
      <Grid item md={7} xs={12} container sx={{ textAlign: "center", mt: 2 }}>
        <DashDataTable />
      </Grid>
    </Grid>
  );
};



export default Dashboard;
