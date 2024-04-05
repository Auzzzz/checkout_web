import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAPI, postAxiosAPI } from "~/server/postAPI";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

function AddGroups() {
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
      "v1/group/",
      session!.user.raw.access_token,
      session!.user.id,
      data
    );
    reset();
    post;
    if (post?.status != 200 || post === undefined) {
      toast.error("Error adding group", { duration: 5000 });
    }
    if (post?.status == 200) {
      toast.success("Successfully created group #" + post.data.id + " =)", {
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Create a Group
      </Typography>
      <Box sx={{ m: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="group-name"
            label="Group Name"
            defaultValue=""
            variant="standard"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            style={{ width: "100%", marginTop: 8 }}
            id="group-description"
            label="Group Description"
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
            Add Group
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddGroups;
