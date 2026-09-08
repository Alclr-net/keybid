"use client";
import React from 'react'
import Container from './Container'
import ScrollReveal from './ui/ScrollReveal'
import KeyboardDemo from './keyboard-demo'
import MacDisplay from './MacDisplay'

function MacDisplaySection() {
    return (
        <section className="w-full py-8 sm:py-16 md:py-24 bg-zinc-50/60 dark:bg-zinc-950/40 border-y border-zinc-200/70 dark:border-white/5">
            <Container className="w-full px-2 sm:px-6 lg:px-8">
                <ScrollReveal delay={0.2} blurAmount={6}>
                    <MacDisplay />
                </ScrollReveal>

                <ScrollReveal delay={0.15} blurAmount={6}>
                    <KeyboardDemo />
                </ScrollReveal>
            </Container>
        </section>
    )
}

export default MacDisplaySection