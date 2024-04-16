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

import AddItems from "~/components/Dashboard/add/addItems";

import { useSession } from "next-auth/react";
import { getAPI } from "~/server/getAPI";

import AddUsers from "~/components/Dashboard/add/addUsers";
import AddVenues from "~/components/Dashboard/add/addVenues";
import AddGroups from "~/components/Dashboard/add/addGroups";
import toast from "react-hot-toast";

function Dashboard() {
  const { data: session } = useSession();
  const [option, setOption] = useState(0);
  const [values, setValues] = useState([]);
  const error = useState(false);
  const actionButtons = [
    { id: 0, name: "Configure Users", ep: "v1/user" },
    { id: 1, name: "Configure Items", ep: "v1/item" },
    { id: 2, name: "Configure Venues", ep: "v1/venue" },
    { id: 3, name: "Configure Groups", ep: "v1/group" },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const selectionGetter = async (id: number) => {
    const url = actionButtons[id]!.ep + "/all/f";

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

      setValues(get);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data 2" + error, { duration: 5000 });
    }
  };

  const buttonOnPress = (id: number) => {
    console.log("Button Pressed");
    setOption(id);
    selectionGetter(id);
  };

  const model = (id: number) => {
   
      return (
        <div>
          <Button onClick={handleOpen}>Open modal</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
        </div>
      );
    
  }

  const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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



      {values.map(
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
                  variant="contained"
                  color="primary"
                  sx={{ m: 1 }}
                  onClick={() => handleOpen()}
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
