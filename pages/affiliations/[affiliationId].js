import Image from "next/image";
import Link from "next/link";
export default function Affiliatons({ characters, affiliationId }) {
  const affiliation = affiliationId.replace(/\+/g, " ");
  return (
    <div style={{ marginTop: "40px" }}>
      <h1>Affiliation matching {affiliation}</h1>
      {characters.map((character) => {
        return (
          <div key={character._id}>
            <Link href="/characters/">
              <a>
                <Image src={character.photoUrl} width={200} height={200} />
              </a>
            </Link>
            <h1>{character.name}</h1>
            <h4>{character.profession}</h4>
            <h5>{character.affiliation}</h5>
          </div>
        );
      })}
    </div>
  );
}
export async function getServerSideProps({ params }) {
  const affiliationId = params.affiliationId.replace(/\-/g, "+");
  const characters = await fetch(
    `https://last-airbender-api.herokuapp.com/api/v1/characters?affiliation=${affiliationId}`
  )
    .then((r) => r.json())
    .catch((e) => console.log(e));
  return {
    props: { characters, affiliationId },
  };
}
