import React, { useEffect, useRef } from 'react';

const MOBILE_BREAKPOINT = 768;
const MAX_PARTICLES_MOBILE = 40;
const MAX_PARTICLES_DESKTOP = 70;
const CONNECTION_DISTANCE = 150;
const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

export const FinanceBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        const mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                const isGreen = Math.random() > 0.5;
                this.color = isGreen
                    ? `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.1})`
                    : `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < CONNECTION_DISTANCE_SQ && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (CONNECTION_DISTANCE - dist) / CONNECTION_DISTANCE;
                    this.vx -= (dx / dist) * force * 0.05;
                    this.vy -= (dy / dist) * force * 0.05;
                }

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        const maxParticles = width < MOBILE_BREAKPOINT
            ? MAX_PARTICLES_MOBILE
            : MAX_PARTICLES_DESKTOP;
        const particleCount = Math.min(Math.floor((width * height) / 15000), maxParticles);

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const renderFrame = (update: boolean) => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                if (update) p.update();
                p.draw();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < CONNECTION_DISTANCE_SQ) {
                        const distance = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 * (1 - distance / CONNECTION_DISTANCE)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
        };

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let animationFrameId: number | null = null;

        const stop = () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        const start = () => {
            if (reducedMotion || animationFrameId !== null) return;

            const animate = () => {
                renderFrame(true);
                animationFrameId = requestAnimationFrame(animate);
            };
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const handleResize = () => {
            if (reducedMotion) renderFrame(false);
        };
        window.addEventListener('resize', handleResize);

        if (reducedMotion) {
            renderFrame(false);
        } else {
            start();
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            stop();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-0 pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
};
