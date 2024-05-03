import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Venue } from "~/dbTypes";
import { postAxiosAPI } from "~/server/postAPI";
import { putAxiosAPI } from "~/server/putAPI";

type Props = {
  data: Venue;
  onUpdate: () => void;
};

function ModifyVenues(props: Props) {
  const { data: session } = useSession();
  const [disable, setDisable] = useState(false);

  const modifySchema = z.object({
    name: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
    description: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
  });

  type FormData = z.infer<typeof modifySchema>;
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors, touchedFields, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(modifySchema),
    defaultValues: {
      name: props.data.venue.name,
      description: props.data.venue.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!isDirty) {
      toast.success("No changes detected", { duration: 5000 });
      return;
    }

    setDisable(true);
    // add in ID to the data
    const modifiedData = { ...data, id: props.data.venue.id };
    const post = await putAxiosAPI(
      "v1/item/",
      session!.user.raw.access_token,
      session!.user.id,
      modifiedData
    );
    post;
    if (post?.status !== 200 || post === undefined) {
      toast.error("Error modifying item", { duration: 5000 });
      setDisable(false);
    }
    if (post?.status == 200) {
      toast.success("Successfully modified " + post.data.id + " =)", {
        duration: 5000,
      });
      props.onUpdate();
      setDisable(false);
    }
  };

  props.data.venue.GroupVenues?.map((group) => (console.log(group.group.id)));

  return (
    <Grid item xs={12}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="item-name"
            label="Item Name"
            defaultValue={props.data.venue.name}
            variant="standard"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={disable}
          />

          <TextField
            style={{ width: "100%", marginTop: 8 }}
            id="item-description"
            label="Item Description"
            defaultValue={props.data.venue.description}
            variant="standard"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={disable}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 6 }}
          >
            Modify Venue
          </Button>
        </form>

        <Divider sx={{ mt: 4 }} />
        <Box>
          {props.data.venue.GroupVenues?.length! < 1 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No groups assigned
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Item {props.data.venue.name} is in the following groups:
            </Typography>
          )}

          {props.data.venue.GroupVenues?.length! >= 1 ? (
           props.data.venue.GroupVenues?.map((group) => (
               
            <Box key={group.group.id}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                #{group.group.id} - {group.group.name}
                {/* TODO: Add a button to take to the group page */}
              </Typography>
            </Box>
            ))
          ) : (
            <p> No groups assigned</p>
          )}

        </Box>
      </Box>
    </Grid>
  );
}

export default ModifyVenues;
