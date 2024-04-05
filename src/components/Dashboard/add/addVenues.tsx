import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAPI, postAxiosAPI } from "~/server/postAPI";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

function AddVenues() {
  const { data: session } = useSession();

  const addItemsSchema = z.object({
    name: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
    description: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
  });

  type FormData = z.infer<typeof addItemsSchema>;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormData>({ resolver: zodResolver(addItemsSchema) });

  const onSubmit = async (data: FormData) => {
    const post = await postAxiosAPI(
      "v1/venue/",
      session!.user.raw.access_token,
      session!.user.id,
      data
    );

    reset();

    if (post?.status != 200 || post === undefined) {
      toast.error("Error adding venue", { duration: 5000 });
    }
    if (post?.status == 200) {
      toast.success("Successfully created venue #" + post.data.id + " =)", {
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add a Venue
      </Typography>
      <Box sx={{ m: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="venue-name"
            label="Venue Name"
            defaultValue=""
            variant="standard"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            style={{ width: "100%", marginTop: 8 }}
            id="venue-description"
            label="Venue Description"
            defaultValue=""
            variant="standard"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 6 }}
          >
            Add Venue
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddVenues;
