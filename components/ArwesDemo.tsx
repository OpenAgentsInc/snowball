'use client';

import { useState } from "react"
import { Animator, FrameCorners, Text } from "@arwes/react"

export const ArwesDemo = () => {
  const [active, setActive] = useState(true);

  return (
    <div className="p-8 space-y-8">
      <Animator active={active} manager="stagger">
        <div className="relative p-6 backdrop-blur-sm bg-white/5">
          <FrameCorners
            className="absolute inset-0"
            strokeWidth={2}
            style={{
              color: 'rgb(255, 255, 255)',
            }}
          />
          <div className="relative">
            <Text as="h1" className="text-3xl font-bold mb-2 text-white/90">
              Welcome to Snowball + Arwes
            </Text>
            <Text className="text-white/70">
              A futuristic sci-fi UI framework integration
            </Text>
          </div>
        </div>
      </Animator>

      <Animator active={active} manager="stagger">
        <div className="relative p-8 backdrop-blur-sm bg-white/5">
          <FrameCorners
            className="absolute inset-0"
            strokeWidth={2}
            style={{
              color: 'rgb(255, 255, 255)',
            }}
          />
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <Text as="h2" className="text-2xl font-bold text-white/90">
                Interactive Demo
              </Text>
              <button
                onClick={() => setActive(!active)}
                className="px-6 py-2 bg-white/5 border border-white/30 rounded-lg
                         hover:bg-white/10 hover:border-white/50 transition-all text-white/70
                         hover:text-white/90 backdrop-blur-sm"
              >
                Toggle Animation
              </button>
            </div>
            <Text className="text-white/70 leading-relaxed">
              This is a demo of Arwes components. The elements above are animated
              and interactive. Try clicking the button to toggle animations!
              The background features dynamic grid lines, moving particles,
              and a sci-fi inspired design.
            </Text>
          </div>
        </div>
      </Animator>
    </div>
  );
};
