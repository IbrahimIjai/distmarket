import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { mediaByIndex } from "../components/media/caroselMedia/index";
import { media } from "../components/media/caroselMedia/index";
import Image from "next/image";
import Link from "next/link";
import styles  from "../styles/carosel.module.css"
import { DotButton } from "../components/caroselBtn";


export default function Carosel() {
    const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
  
    const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
      embla
    ]);
  
    const onSelect = useCallback(() => {
      if (!embla) return;
      setSelectedIndex(embla.selectedScrollSnap());
    }, [embla, setSelectedIndex]);
  
    useEffect(() => {
      if (!embla) return;
      onSelect();
      setScrollSnaps(embla.scrollSnapList());
      embla.on("select", onSelect);
    }, [embla, setScrollSnaps, onSelect]);

    const SLIDE_COUNT = 5;
    const slides = Array.from(Array(SLIDE_COUNT).keys());

    console.log(slides)
    console.log(slides[1])
 

  return (
    
  <div className={styles.embody}>

    <div className={styles.embla}>
        <div className={styles.embla__viewport} ref={viewportRef}>
          <div className={styles.embla__container}>
            {slides.map((index) => (
                <Link  
                href={`/collection/${mediaByIndex(index).collectionAddress}/${mediaByIndex(index).tokenId}`}
                
                >
                <div className={styles.embla__slide} key={index}>
                <div className={styles.embla__slide__inner}>
                {/* ${"../Frontpage/caroselMedia/media-"}${mediaByIndex(index)}${".jpeg"} */}
                  <Image
                    className="embla__slide__img"
                    src={mediaByIndex(index).image}
                    alt="A cool cat."
                    
                  />
                  <div className={styles.caroselText}>
                  <h3>{mediaByIndex(index).name}</h3>
                            <p>
                              {mediaByIndex(index).collection}{" "}
                              <span>Price: ${mediaByIndex(index).price}</span>
                            </p>
                  </div>
                </div>
              </div>
                </Link>
              
            ))}
          </div>
        </div>
        
      </div>
      <div className={styles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
  </div>
  
  );
}
