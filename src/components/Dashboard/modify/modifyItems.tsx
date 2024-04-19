import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Items } from "~/dbTypes";
import { postAxiosAPI } from "~/server/postAPI";
import { putAxiosAPI } from "~/server/putAPI";

type Props = {
    itemData: Items;
    onUpdate: () => void;
}


function ModifyItems(props: Props) {
  const { data: session } = useSession();
  const [disable, setDisable] = useState(false);

  const modifyItemsSchema = z.object({
    
    name: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
    description: z
      .string()
      .min(2, "Must be longer then 2 characters")
      .max(255, "Must be shorter then 255 characters"),
  });

  type FormData = z.infer<typeof modifyItemsSchema>;
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors, touchedFields, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(modifyItemsSchema), defaultValues: { name: props.itemData.item.name, description: props.itemData.item.description }});

  const onSubmit = async (data: FormData) => {
    if (!isDirty) {
      toast.success("No changes detected", { duration: 5000 });
      return;
    }

    setDisable(true);
    // add in ID to the data
    const modifiedData = { ...data, id: props.itemData.item.id };
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

  return (
    <Grid item xs={12}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ width: "100%" }}
            id="item-name"
            label="Item Name"
            defaultValue={props.itemData.item.name}
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
            defaultValue={props.itemData.item.description}
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
            Modify item
          </Button>
        </form>
      </Box>
    </Grid>
  );
}

export default ModifyItems;
