'use client';

import { Animator, GridLines } from "@arwes/react"

export const ArwesBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#030711]/95" />
      <Animator active>
        <GridLines
          lineColor="rgba(255, 255, 255, 0.1)"
          distance={40}
          lineWidth={1}
        />
      </Animator>
    </div>
  );
};
