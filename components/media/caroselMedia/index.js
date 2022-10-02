import media1 from "./5951.png";
import media2 from "./2818.png";
import media3 from "./1960.jpeg";
import media4 from "./6190.png";
import media5 from "./5346.png";

export const mediaByIndex = (index) => media[index % media.length];

export const media = [
  {
    image: media1,
    name: "Cross Boss #5951",
    collection: "Cross Boss",
    tokenId: 4,
    collectionAddress: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee",
    price: 188,
  },
  {
    image: media2,
    name: "Cross Boss #2818",
    collection: "Cross Boss",
    tokenId: 2,
    collectionAddress: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee",
    price: 22,
  },
  {
    image: media3,
    name: "Lomen #1960",
    collection: "Lomen",
    tokenId: 1,
    collectionAddress: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee",
    price: 102,
  },
  {
    image: media4,
    name: "Lomen #6190",
    collection: "Lomen",
    tokenId: 3,
    collectionAddress: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee",
    price: 132,
  },
  {
    image: media5,
    name: "Cross Boss #5346",
    collection: "Cross Boss",
    tokenId: 5,
    collectionAddress: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee",
    price: 45,
  },
];
