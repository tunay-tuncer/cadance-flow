import { useEffect, useRef } from 'react';

const CursorGlow = () => {
    const glowRef = useRef(null);
    const pos = useRef({
        current: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        target: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    });
    const rafRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            pos.current.target = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const STIFFNESS = 0.05; // lower = laggier spring, higher = snappier

        const tick = () => {
            const { current, target } = pos.current;

            // Exponential smoothing — mimics a spring without any library
            current.x += (target.x - current.x) * STIFFNESS;
            current.y += (target.y - current.y) * STIFFNESS;

            if (glowRef.current) {
                glowRef.current.style.transform =
                    `translate(${current.x - 200}px, ${current.y - 200}px)`;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(64, 109, 231, 0.15) 0%, transparent 95%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                zIndex: 9999,
                willChange: 'transform',
            }}
        />
    );
};

export default CursorGlow;