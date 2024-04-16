import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { get } from "node_modules/axios/index.cjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAPI } from "~/server/getAPI";
import { Items } from "~/dbTypes";

export default function ItemsDetail() {
  const router = useRouter();
const { id } = router.query;
const { data: session } = useSession();
const [itemData, setItemData] = useState<Items>();

useEffect(() => {
    const fetchData = async () => {
        const url = "v1/item/" + id;
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

            setItemData(get);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching data 2" + error, { duration: 5000 });
        }
    };
    fetchData();
}, []);

console.log(itemData?.item.id);

if (itemData === undefined ) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            No Item found with ID #{id}
        </Box>
    );
}

  return <div>Hello {id}</div>;
}
