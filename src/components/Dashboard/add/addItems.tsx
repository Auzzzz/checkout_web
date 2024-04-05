import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAPI, postAxiosAPI } from "~/server/postAPI";
import { useSession } from "next-auth/react";

export type Alert = {
  id: number;
  message: string;
};

function AddItems() {
  const { data: session } = useSession();
  const [alert, setAlert] = useState<Array<Alert>>([]);
  const [success, setSuccess] = useState<Array<Alert>>([]);

  const removeAlert = (index: number) => {
    const temp = [...alert];
    temp.splice(index, 1);
    setAlert(temp);
  };
  const removeSuccess = (index: number) => {
    const temp = [...success];
    temp.splice(index, 1);
    setSuccess(temp);
  };

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
    formState: { errors, touchedFields },
  } = useForm<FormData>({ resolver: zodResolver(addItemsSchema) });
  // const onSubmit = async (data: FormData) => {
  //   const test = await postAPI(
  //     "v1/item/",
  //     session!.user.raw.access_token,
  //     session!.user.id,
  //     data
  //   );

  const onSubmit = async (data: FormData) => {
    const post = await postAxiosAPI(
      "v1/item/",
      session!.user.raw.access_token,
      session!.user.id,
      data
    );

    post;
    if (post?.status != 200 || post === undefined) {
      setAlert([
        ...alert,
        { id: Math.random(), message: "Failed to add item - system issue" },
      ]);
    }
    if (post?.status == 200) {
      setSuccess([
        ...success,
        {
          id: Math.random(),
          message: "Item " + post.data.id + " added",
        },
      ]);
    }
  };

  return (
    <Box>
      {alert.map((alert) => (
        <Alert
          severity="error"
          onClose={() => {
            removeAlert(alert.id);
          }}
        >
          {alert.message}
        </Alert>
      ))}
      {success.map((success) => (
        <Alert
          severity="success"
          onClose={() => {
            removeSuccess(success.id);
          }}
        >
          {success.message}
        </Alert>
      ))}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add an Item
      </Typography>
      <Box sx={{ m: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="item-name"
            label="Item Name"
            defaultValue=""
            variant="standard"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            style={{ width: "100%", marginTop: 8 }}
            id="item-description"
            label="Item Description"
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
            Add item
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddItems;
