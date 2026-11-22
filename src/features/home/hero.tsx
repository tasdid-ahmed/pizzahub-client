"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: "easeOut" as const } };

  return (
    <section
      className="relative isolate overflow-hidden border-b-2 border-[color:var(--hard)] bg-[#fff1d6] bg-cover bg-right text-[#2b1b14]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,241,214,0.97) 0%, rgba(255,241,214,0.75) 45%, rgba(255,241,214,0) 80%), url('/pizzahub-hero.png')",
      }}
    >
      <div className="mx-auto flex min-h-[28rem] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[34rem]">
        <div className="max-w-xl">
          <motion.p
            {...enter(0)}
            className="mb-4 inline-block -rotate-2 rounded border-2 border-[#2b1b14] bg-[#f28c28] px-3 py-1 text-xs font-black uppercase tracking-widest"
          >
            Fresh from local ovens
          </motion.p>
          <motion.h1 {...enter(0.1)} className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </motion.h1>
          <motion.p {...enter(0.2)} className="mt-5 max-w-md text-lg text-[#5a4033]">
            Discover pizza shops near you, browse their menus and order in a few taps. Real restaurants, real ovens, no
            long waits.
          </motion.p>
          <motion.div {...enter(0.3)} className="mt-8">
            <Button asChild size="lg">
              <Link href="/menu">
                Explore Pizza Menu <ArrowRight />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}