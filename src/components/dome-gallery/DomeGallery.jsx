"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import "./DomeGallery.css";

const DEFAULT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80", alt: "Server infrastructure" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80", alt: "Data dashboard" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", alt: "Computer circuit board" },
  { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80", alt: "Developer workspace" },
  { src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=900&q=80", alt: "Robotics project" },
  { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80", alt: "Source code" },
  { src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80", alt: "Open laptop" },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const wrapAngle = (degrees) => {
  const angle = (((degrees + 180) % 360) + 360) % 360;
  return angle - 180;
};

function buildItems(images, segments) {
  const normalized = images.map((image) =>
    typeof image === "string"
      ? { src: image, alt: "" }
      : { src: image.src || "", alt: image.alt || "" },
  );
  const columns = Array.from({ length: segments }, (_, index) => -37 + index * 2);
  const coordinates = columns.flatMap((x, column) =>
    (column % 2 === 0 ? [-4, -2, 0, 2, 4] : [-3, -1, 1, 3, 5]).map(
      (y) => ({ x, y, sizeX: 2, sizeY: 2 }),
    ),
  );

  return coordinates.map((coordinate, index) => ({
    ...coordinate,
    ...(normalized[index % normalized.length] || { src: "", alt: "" }),
  }));
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#120F17",
  maxVerticalRotationDeg = 5,
  dragSensitivity = 20,
  enlargeTransitionMs = 300,
  segments = 35,
  dragDampening = 0.6,
  openedImageWidth = "250px",
  openedImageHeight = "350px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale = true,
}) {
  const rootRef = useRef(null);
  const interactionRef = useRef(null);
  const sphereRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotationRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef(null);
  const [openedImage, setOpenedImage] = useState(null);
  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = useCallback((x, y) => {
    if (sphereRef.current) {
      sphereRef.current.style.transform = `translateZ(calc(var(--dg-radius) * -1)) rotateX(${x}deg) rotateY(${y}deg)`;
    }
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    inertiaRef.current = null;
  }, []);

  const startInertia = useCallback(
    (velocityX, velocityY) => {
      let vx = clamp(velocityX, -1.4, 1.4) * 70;
      let vy = clamp(velocityY, -1.4, 1.4) * 70;
      const friction = 0.93 + clamp(dragDampening, 0, 1) * 0.055;
      let frames = 0;
      const step = () => {
        vx *= friction;
        vy *= friction;
        if ((Math.abs(vx) < 0.02 && Math.abs(vy) < 0.02) || frames++ > 240) {
          inertiaRef.current = null;
          return;
        }
        const x = clamp(
          rotationRef.current.x - vy / 180,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg,
        );
        const y = wrapAngle(rotationRef.current.y + vx / 180);
        rotationRef.current = { x, y };
        applyTransform(x, y);
        inertiaRef.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRef.current = requestAnimationFrame(step);
    },
    [applyTransform, dragDampening, maxVerticalRotationDeg, stopInertia],
  );

  useGesture(
    {
      onDragStart: () => {
        stopInertia();
        startRotationRef.current = { ...rotationRef.current };
      },
      onDrag: ({ movement: [mx, my], last, velocity: [vx, vy], direction: [dx, dy] }) => {
        const x = clamp(
          startRotationRef.current.x - my / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg,
        );
        const y = wrapAngle(startRotationRef.current.y + mx / dragSensitivity);
        rotationRef.current = { x, y };
        applyTransform(x, y);
        if (last) startInertia(vx * dx, vy * dy);
      },
    },
    { target: interactionRef, eventOptions: { passive: true } },
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const minimum = Math.min(width, height);
      const maximum = Math.max(width, height);
      let basis = minimum;
      if (fitBasis === "max") basis = maximum;
      if (fitBasis === "width") basis = width;
      if (fitBasis === "height") basis = height;
      if (fitBasis === "auto") basis = width / height >= 1.3 ? width : minimum;
      const radius = clamp(Math.min(basis * fit, height * 1.35), minRadius, maxRadius);
      root.style.setProperty("--dg-radius", `${Math.round(radius)}px`);
      root.style.setProperty("--dg-viewer-pad", `${Math.max(8, Math.round(minimum * padFactor))}px`);
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [applyTransform, fit, fitBasis, maxRadius, minRadius, padFactor]);

  useEffect(() => () => stopInertia(), [stopInertia]);
  useEffect(() => {
    if (!openedImage) return;
    const close = (event) => event.key === "Escape" && setOpenedImage(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [openedImage]);

  return (
    <div
      ref={rootRef}
      className="dg-root"
      style={{
        "--dg-segments-x": segments,
        "--dg-segments-y": segments,
        "--dg-overlay-color": overlayBlurColor,
        "--dg-tile-radius": imageBorderRadius,
        "--dg-open-radius": openedImageBorderRadius,
        "--dg-image-filter": grayscale ? "grayscale(1)" : "none",
        "--dg-transition": `${enlargeTransitionMs}ms`,
      }}
    >
      <div ref={interactionRef} className="dg-main">
        <div className="dg-stage">
          <div ref={sphereRef} className="dg-sphere">
            {items.map((item, index) => (
              <div
                key={`${item.x}-${item.y}-${index}`}
                className="dg-item"
                style={{
                  "--dg-offset-x": item.x,
                  "--dg-offset-y": item.y,
                  "--dg-item-size-x": item.sizeX,
                  "--dg-item-size-y": item.sizeY,
                }}
              >
                <button
                  type="button"
                  className="dg-image"
                  aria-label={item.alt || "Open project image"}
                  onClick={() => setOpenedImage(item)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} draggable={false} alt={item.alt} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="dg-overlay" />
        <div className="dg-overlay dg-overlay-blur" />
        <div className="dg-edge dg-edge-top" />
        <div className="dg-edge dg-edge-bottom" />
      </div>
      {openedImage && (
        <div className="dg-viewer" role="dialog" aria-modal="true" aria-label={openedImage.alt || "Project image"}>
          <button className="dg-scrim" type="button" onClick={() => setOpenedImage(null)} aria-label="Close image" />
          <div
            className="dg-enlarge"
            style={{ width: openedImageWidth, height: openedImageHeight }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={openedImage.src} alt={openedImage.alt} />
          </div>
        </div>
      )}
    </div>
  );
}
