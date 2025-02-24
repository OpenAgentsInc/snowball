'use client';

import { Animator, Dots, GridLines } from "@arwes/react"

export const ArwesBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <Animator active>
        <GridLines
          lineColor="rgba(255, 255, 255, 0.03)"
          distance={40}
          lineWidth={1}
        />
        <Dots
          color="rgba(255, 255, 255, 0.3)"
          size={1}
          distance={40}
        />
      </Animator>
    </div>
  );
};
