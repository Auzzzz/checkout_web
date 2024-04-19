import axios from "axios";
import { json } from "stream/consumers";

//TODO: Error Logging x2
export async function putAPI(url: string, token: string, uid: string, data: any) {
  try {
    let res: Response;
    try {
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL + url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
          uid: uid,
        },
        body: JSON.stringify(data),
      });
      console.log(res);
      return { status: res.status, data: res };
    } catch (err) {
      console.log(err);
      return { error: err, status: 500 };
    }

    return res;
  } catch (error) {
    return { error: error, status: 500 };
  }
}

export async function putAxiosAPI(url: string, token: string, uid: string, data: any) {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL + url}`, data, {
      headers: {
        "Content-Type": "application/json",
        token: token,
        uid: uid,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
