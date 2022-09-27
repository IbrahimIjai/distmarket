import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/steffqing/721-clone";

export default function Test() {
  const addressQuery = `
  query addressQuery($address: ID){
    account(id: $address){
      id 
      tokens{
        identifier
        tokenURI
      }
    }
  }
  `;

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });
  const data = "0xeae38e8d41aecc027e1b68c31f7039ae95651d4d";
  client
    .query({
      query: gql(addressQuery),
      variables: {
        address: data,
      },
    })
    .then((data) => console.log("Subgraph data: ", data))
    .catch((err) => {
      console.log("Error fetching data: ", err);
    });
  return <div>Content</div>;
}
