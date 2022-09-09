import Image from "next/image";
export default function Character({ character }) {
  return (
    <div key={character._id} style={{ marginTop: "40px" }}>
      <Image src={character.photoUrl} width={200} height={200} />
      <h1>{character.name}</h1>
      {character.allies.length > 0 && (
        <p>
          {character.allies.map((ally) => (
            <span>{ally}</span>
          ))}
        </p>
      )}
      <p>{character.affiliation}</p>
    </div>
  );
}
export async function getStaticProps({ params }) {
  const result = await fetch(
    `https://last-airbender-api.herokuapp.com/api/v1/characters?name=${params.characterId.replace(
      /\-/g,
      "+"
    )}`
  ).then((r) => r.json());
  const character = result[0];
  return { props: { character } };
}

export async function getStaticPaths() {
  const characters = await fetch(
    "https://last-airbender-api.herokuapp.com/api/v1/characters?perPage=500"
  ).then((r) => r.json());
  return {
    paths: characters.map((character) => {
      const characterId = character.name.toLowerCase().replace(/ /g, "-");
      return {
        params: { characterId },
      };
    }),
    fallback: false,
  };
}
