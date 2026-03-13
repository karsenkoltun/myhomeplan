'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroDashboardMockup } from '@/components/hero/hero-dashboard-mockup'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <section className="overflow-hidden">
            <div
                aria-hidden
                className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>
            <div className="relative pt-20 md:pt-28">
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    delayChildren: 1,
                                },
                            },
                        },
                        item: {
                            hidden: {
                                opacity: 0,
                                y: 20,
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    type: 'spring',
                                    bounce: 0.3,
                                    duration: 2,
                                },
                            },
                        },
                    }}
                    className="absolute inset-0 -z-20">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=3276&q=80&auto=format&fit=crop"
                        alt="background"
                        className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                        width="3276"
                        height="4095"
                    />
                </AnimatedGroup>
                <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                        <AnimatedGroup variants={transitionVariants}>
                            <Link
                                href="/homeowners"
                                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                <span className="text-foreground text-sm">Now Serving the Okanagan Valley</span>
                                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <h1
                                className="mt-6 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:mt-10 xl:text-7xl font-bold tracking-tight">
                                Every home service.{' '}
                                <span className="animated-gradient-text">One simple plan.</span>
                            </h1>
                            <p
                                className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
                                No more chasing contractors, surprise bills, or juggling quotes. Every service your home needs, bundled into one predictable plan built around you.
                            </p>
                        </AnimatedGroup>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row">
                            <div
                                key={1}
                                className="bg-foreground/10 rounded-[14px] border p-0.5">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-xl px-5 text-base">
                                    <Link href="/onboarding">
                                        <span className="text-nowrap">Build Your Plan</span>
                                        <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </Button>
                            </div>
                            <Button
                                key={2}
                                asChild
                                size="lg"
                                variant="ghost"
                                className="h-10 rounded-xl px-5">
                                <Link href="/how-it-works">
                                    <span className="text-nowrap">See How It Works</span>
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                        </AnimatedGroup>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-4">
                            <p className="text-sm text-muted-foreground/70">
                                Plans starting at $89/month &middot; Cancel anytime
                            </p>
                        </AnimatedGroup>
                    </div>
                </div>

                <div className="relative mt-4 sm:mt-8 md:mt-10">
                    <div
                        aria-hidden
                        className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-55% pointer-events-none"
                    />
                    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 origin-top scale-[0.78] sm:scale-[0.85] lg:scale-[0.90] xl:scale-[0.95]">
                        <HeroDashboardMockup />
                    </div>
                </div>
            </div>
        </section>
    )
}
