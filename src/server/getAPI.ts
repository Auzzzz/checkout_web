 //TODO: Error Logging x2
 export async function getAPI(url: string, token: string, uid: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL + url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
        uid: uid,
      },
    }).then((res) => res.json()).catch((err) => console.log(err));
    
    return res;
    
  } catch (error) {
    console.log(error);
  }
}
