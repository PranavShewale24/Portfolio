import { useRef, useState } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import './FlipCard.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function FlipCard({ front, back, onFlipChange, axis = 'y', flipOnClick = true, draggable = true, tilt = true, tiltMax = 12, glare = true, glareOpacity = 0.22, hoverScale = 1.03, perspective = 1100, stiffness = 170, damping = 20, width = 300, height = 400, radius = 22, background = '#27272a', color = '#f5f5f5', shadow = true, disabled = false, ariaLabel = 'Flip card', className = '' }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);
  const turn = useMotionValue(0);
  const tiltX = useSpring(0, { stiffness: 240, damping: 24 });
  const tiltY = useSpring(0, { stiffness: 240, damping: 24 });
  const lift = useSpring(1, { stiffness: 320, damping: 26 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateX(${tiltX}deg) rotateY(${turn}deg)`;
  const rotateY = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateY(${tiltY}deg) rotateX(${turn}deg)`;
  const gxPercent = useMotionTemplate`${gx}%`;
  const gyPercent = useMotionTemplate`${gy}%`;

  const setFace = next => {
    setFlipped(next);
    onFlipChange?.(next);
    if (reduced) turn.jump(next ? 180 : 0);
    else animate(turn, next ? 180 : 0, { type: 'spring', stiffness, damping });
  };
  const flip = () => setFace(!flipped);
  const reset = () => { tiltX.set(0); tiltY.set(0); lift.set(1); };
  const pointerMove = event => {
    if (start.current) {
      const distance = axis === 'x' ? event.clientY - start.current.y : event.clientX - start.current.x;
      if (!start.current.moved && Math.abs(distance) > 5 && draggable && !reduced) { start.current.moved = true; setDragging(true); }
      if (start.current.moved) turn.set((flipped ? 180 : 0) + (distance / (axis === 'x' ? height : width)) * 180);
      return;
    }
    if (!tilt || reduced || disabled || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const py = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    gx.set(px * 100); gy.set(py * 100); tiltX.set((0.5 - py) * 2 * tiltMax); tiltY.set((px - 0.5) * 2 * tiltMax);
  };
  const release = event => {
    if (!start.current) return;
    const moved = start.current.moved;
    start.current = null;
    setDragging(false);
    reset();
    if (!moved && flipOnClick && event.type === 'pointerup') flip();
    else animate(turn, flipped ? 180 : 0, { type: 'spring', stiffness, damping });
  };

  return <div className={`flip-card${className ? ` ${className}` : ''}`} role="button" tabIndex={disabled ? -1 : 0} aria-pressed={flipped} aria-label={ariaLabel} onPointerDown={event => { if (!disabled && event.button === 0) { start.current = { x: event.clientX, y: event.clientY, moved: false }; lift.set(hoverScale); } }} onPointerMove={pointerMove} onPointerUp={release} onPointerCancel={release} onPointerLeave={() => { if (!start.current) reset(); }} onKeyDown={event => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); flip(); } }} style={{ '--fc-w': `${width}px`, '--fc-h': `${height}px`, '--fc-radius': `${radius}px`, '--fc-bg': background, '--fc-ink': color, '--fc-glare': glareOpacity }} data-axis={axis} data-dragging={dragging ? '' : undefined}>
    {shadow && <span className="flip-card__shadow" aria-hidden="true" />}
    <motion.div className="flip-card__rotor" style={reduced ? undefined : { transform: axis === 'x' ? rotateY : rotateX, '--fc-gx': gxPercent, '--fc-gy': gyPercent }}>
      <div className="flip-card__face flip-card__face--front" aria-hidden={flipped}>{front}{glare && <span className="flip-card__glare" aria-hidden="true" />}</div>
      <div className="flip-card__face flip-card__face--back" aria-hidden={!flipped}>{back}{glare && <span className="flip-card__glare" aria-hidden="true" />}</div>
    </motion.div>
  </div>;
}
