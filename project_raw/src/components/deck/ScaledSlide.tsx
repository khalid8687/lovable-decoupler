import { useEffect, useRef, useState, type ReactNode } from 'react';

export function ScaledSlide({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="scaled-slide"><div className="slide-wrapper" style={{ transform: `scale(${scale})` }}>{children}</div></div>;
}