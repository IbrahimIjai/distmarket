import Image from "next/image";
import Link from "next/link";
export default function collection({ avatar }) {
  return (
    <div style={{ marginTop: "40px" }}>
      {avatar.map((anime) => {
        return (
          <div key={anime._id}>
            <Link href="/characters/">
              <a>
                <Image src={anime.photoUrl} width={200} height={200} />
              </a>
            </Link>
            <h1>{anime.name}</h1>
            <span>{anime.gender.substring(0, 1)}</span>
            <h4>{anime.profession}</h4>
            <h5>{anime.affiliation}</h5>
          </div>
        );
      })}
    </div>
  );
}
export async function getStaticProps() {
  const avatars = await fetch(
    "https://last-airbender-api.herokuapp.com/api/v1/characters/avatar"
  );
  const avatar = await avatars.json();
  console.log(avatar);
  return { props: { avatar } };
}
