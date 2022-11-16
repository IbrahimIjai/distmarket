import { createClient } from "redis";

// const redis = createClient({
//   url: `redis://default:${process.env.REACT_REDISKEY}@redis-19871.c258.us-east-1-4.ec2.cloud.redislabs.com:19871`,
// });
// export async function (req, res) {
// redis.on("error", (err) => console.log("Redis Client Error", err));
//   await redis.connect();
//   await redis.set("newName", req.body.name);
//   await redis.disconnect();
//   res.json(req.body.name);
// }
const scheme = {
  story: "Tales of the fox",
  author: "Chinua Achebe",
  title: "Black Panther",
  fans: 84,
  reviews: 31,
  rating: 4.55,
};
const stall = async (stallTime = 3000) =>
  await new Promise((res) => setTimeout(res, stallTime));
const fetchData = () => {
  let data;
  data = scheme;
  return data;
};
export default async function (req, res) {
  const redislabs = createClient();
  await redislabs.connect();
  const response = await redislabs.get("key");
  if (response) {
    let data = JSON.parse(response);
    res.json(data);
  } else {
    let data = fetchData();
    await stall(6000);
    await redislabs.setEx("key", 2000, JSON.stringify(data));
    res.json(data);
  }
  await redislabs.disconnect();
}
