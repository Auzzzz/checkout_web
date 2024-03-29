import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

function AddItems() {
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
  } = useForm<FormData>({resolver: zodResolver(addItemsSchema)});
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Box>
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

          <Button type="submit" variant="contained" color="primary" sx={{mt: 6}}>
            Add item
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddItems;

