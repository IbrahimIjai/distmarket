import { createClient } from "redis";
import { contracts } from "../../constants/ABIs";

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
export default async function handler(req, res) {
  const redislabs = createClient({
    url: contracts.redis,
  });
  await redislabs.connect();
  const response = await redislabs.get("key");
  if (response) {
    let data = JSON.parse(response);
    console.log("Cache Hit");
    res.json(data);
  } else {
    let data = fetchData();
    await stall(6000);
    await redislabs.setEx("key", 2000, JSON.stringify(data));
    console.log("Cache Miss");
    res.json(data);
  }
  await redislabs.disconnect();
}
