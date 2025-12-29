"use client";

import React, { useMemo, useState, useEffect } from "react";
import useImage from "use-image";
import { Stage, Layer, Image as KImage, Group } from "react-konva";
import type {
  ProductColor,
  PrintArea as ProductPrintArea,
} from "@/lib/products";

/** Rect in 0..1 coordinates */
type Rect01 = { x: number; y: number; w: number; h: number };

export type NormalizedTransform = {
  // normalized relative to the SOURCE print area (the one used in editor for that side)
  nx: number;
  ny: number;
  nw: number;
  nh: number;

  // actual konva scale + rotation
  scaleX: number;
  scaleY: number;
  rotation: number;
};

export type MockupView = {
  id: string;
  label: string;
  mockup: string | ((c: ProductColor) => string);
  printArea?: ProductPrintArea;
  frame?: Rect01;
  fit?: "contain" | "cover";
  sourceAreaId?: "front" | "back";
  designScale?: number;
  designOpacity?: number;
  blendMode?: GlobalCompositeOperation;

  // ✅ NEW: preview-only tweak (relative to printArea)
  previewAdjust?: {
    dx?: number; // +right, -left (as % of printArea width)
    dy?: number; // +down,  -up   (as % of printArea height)
    s?: number;  // scale multiplier
    r?: number;  // extra rotation deg
  };
};


type Props = {
  views: MockupView[];
  color?: ProductColor;
  sourcePrintAreaBySide?: Partial<Record<"front" | "back", Rect01>>;

  // backward compatible single design/transform
  designSrc?: string | null;
  transform?: NormalizedTransform | null;

  // recommended
  designByArea?: Partial<Record<"front" | "back", string | null>>;
  transformByArea?: Partial<
    Record<"front" | "back", NormalizedTransform | null>
  >;

  stageSize: { w: number; h: number };
  className?: string;
};

function resolveMockupSrc(mockup: MockupView["mockup"], color: ProductColor) {
  return typeof mockup === "function" ? mockup(color) : mockup;
}

function resolvePrintAreaRect(
  printArea: ProductPrintArea | undefined,
  color: ProductColor,
  fallback: Rect01
): Rect01 {
  if (!printArea) return fallback;

  // direct rect
  if (typeof (printArea as any).x === "number") {
    return printArea as Rect01;
  }

  // per-color map
  const map = printArea as Record<ProductColor, Rect01>;
  return map[color] ?? fallback;
}

export default function MockupPreviews({
  views,
  color = "white",
  designSrc = null,
  transform = null,
  designByArea,
  transformByArea,
  stageSize,
  className,
}: Props) {
  const [activeId, setActiveId] = useState<MockupView["id"]>(
    views[0]?.id ?? "front"
  );

  useEffect(() => {
    if (!views.some((v) => v.id === activeId))
      setActiveId(views[0]?.id ?? "front");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);

  const active = useMemo(
    () => views.find((v) => v.id === activeId) ?? views[0],
    [views, activeId]
  );

  const sourceSide: "front" | "back" = active?.sourceAreaId ?? "front";

  const activeDesignSrc =
    (designByArea ? designByArea[sourceSide] : undefined) ?? designSrc;

  const activeTransform =
    (transformByArea ? transformByArea[sourceSide] : undefined) ?? transform;

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="text-sm font-semibold">Mockup view</div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {views.map((v) => {
            const src = resolveMockupSrc(v.mockup, color);
            const isActive = v.id === activeId;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveId(v.id)}
                className={[
                  "min-w-[104px] rounded-xl border p-2 text-left transition",
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white hover:border-black/25",
                ].join(" ")}
                title={v.label}
              >
                <Thumb src={src} />
                <div className="mt-1 text-[11px] font-medium leading-none">
                  {v.label}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-500">
          Using <span className="font-semibold">{sourceSide}</span> design for
          this mockup.
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3">
        {active ? (
          <MockupStage
            key={active.id}
            view={active}
            color={color}
            designSrc={activeDesignSrc}
            transform={activeTransform}
            stageSize={stageSize}
          />
        ) : (
          <div className="text-sm text-neutral-500">No views configured.</div>
        )}
      </div>
    </div>
  );
}

function Thumb({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-14 w-full rounded-lg object-cover border border-black/10"
      draggable={false}
    />
  );
}

/**
 * ✅ Fit image inside a target rect WITHOUT stretching:
 * - contain: letterbox/pillarbox if needed
 * - cover:   fills rect, may crop
 */
function fitRect(
  imgW: number,
  imgH: number,
  target: { x: number; y: number; w: number; h: number },
  mode: "contain" | "cover"
) {
  const scale =
    mode === "cover"
      ? Math.max(target.w / imgW, target.h / imgH)
      : Math.min(target.w / imgW, target.h / imgH);

  const w = imgW * scale;
  const h = imgH * scale;

  const x = target.x + (target.w - w) / 2;
  const y = target.y + (target.h - h) / 2;

  return { x, y, w, h, scale };
}

function MockupStage({
  view,
  color,
  designSrc,
  transform,
  stageSize,
  sourcePrintAreaBySide,
}: {
  view: MockupView;
  color: ProductColor;
  designSrc: string | null;
  transform: NormalizedTransform | null;
  stageSize: { w: number; h: number };
  sourcePrintAreaBySide?: Partial<Record<"front" | "back", Rect01>>;
}) {
  const mockupSrc = useMemo(
    () => resolveMockupSrc(view.mockup, color),
    [view.mockup, color]
  );

  const [mockupImg] = useImage(mockupSrc, "anonymous");
  const [designImg] = useImage(designSrc ?? "", "anonymous");

  // ✅ PREVIEW CAMERA (frame). Default = full stage
  const frame = view.frame ?? { x: 0, y: 0, w: 1, h: 1 };
  const fitMode = view.fit ?? "contain";

  const framePx = useMemo(() => {
    return {
      x: frame.x * stageSize.w,
      y: frame.y * stageSize.h,
      w: frame.w * stageSize.w,
      h: frame.h * stageSize.h,
    };
  }, [frame.x, frame.y, frame.w, frame.h, stageSize.w, stageSize.h]);

  // resolve printArea for THIS view (0..1 relative to ORIGINAL mockup image)
  const dstPA01 = useMemo(() => {
    const fallback: Rect01 = { x: 0.28, y: 0.25, w: 0.44, h: 0.5 };
    return resolvePrintAreaRect(view.printArea, color, fallback);
  }, [view.printArea, color]);

  // ✅ source print area used when transform was created (editor side)
  const sourceSide: "front" | "back" = view.sourceAreaId ?? "front";
  const srcPA01: Rect01 = useMemo(() => {
    // if not provided, fallback to dstPA01 (no conversion)
    return sourcePrintAreaBySide?.[sourceSide] ?? dstPA01;
  }, [sourcePrintAreaBySide, sourceSide, dstPA01]);

  const scaleFix = view.designScale ?? 1;
  const opacity = view.designOpacity ?? 0.95;
  const blend =
  view.blendMode ??
  (color === "black" ? "source-over" : "multiply");


  // ✅ compute where the mockup image is actually drawn (no stretching)
  const mockupDraw = useMemo(() => {
    if (!mockupImg) {
      return {
        x: framePx.x,
        y: framePx.y,
        w: framePx.w,
        h: framePx.h,
        scale: 1,
      };
    }
    return fitRect(mockupImg.width, mockupImg.height, framePx, fitMode);
  }, [mockupImg, framePx, fitMode]);

  // ✅ destination print area in STAGE px based on the DRAWN mockup rect
  const dstPAPx = useMemo(() => {
    return {
      x: mockupDraw.x + dstPA01.x * mockupDraw.w,
      y: mockupDraw.y + dstPA01.y * mockupDraw.h,
      w: dstPA01.w * mockupDraw.w,
      h: dstPA01.h * mockupDraw.h,
    };
  }, [mockupDraw.x, mockupDraw.y, mockupDraw.w, mockupDraw.h, dstPA01]);

  // --- Convert transform from SOURCE printArea -> DESTINATION printArea (both in 0..1 mockup coords)
  const tMapped = useMemo<NormalizedTransform | null>(() => {
    if (!transform) return null;

    // If same rect (or no source provided), no need to convert
    const same =
      srcPA01.x === dstPA01.x &&
      srcPA01.y === dstPA01.y &&
      srcPA01.w === dstPA01.w &&
      srcPA01.h === dstPA01.h;

    if (same) return transform;

    // absolute coords in 0..1 of SOURCE mockup
    const ax = srcPA01.x + transform.nx * srcPA01.w;
    const ay = srcPA01.y + transform.ny * srcPA01.h;
    const aw = transform.nw * srcPA01.w;
    const ah = transform.nh * srcPA01.h;

    // re-normalize into DESTINATION print area
    return {
      nx: (ax - dstPA01.x) / dstPA01.w,
      ny: (ay - dstPA01.y) / dstPA01.h,
      nw: aw / dstPA01.w,
      nh: ah / dstPA01.h,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation,
    };
  }, [transform, srcPA01, dstPA01]);

  // ✅ Convert mapped transform to stage pixels
  const placement = useMemo(() => {
  if (!tMapped || !designImg) return null;

  const adj = view.previewAdjust ?? {};
  const dx = adj.dx ?? 0;
  const dy = adj.dy ?? 0;
  const s = adj.s ?? 1;

  const x = dstPAPx.x + (tMapped.nx + dx) * dstPAPx.w;
  const y = dstPAPx.y + (tMapped.ny + dy) * dstPAPx.h;

  const w = tMapped.nw * dstPAPx.w * scaleFix * (tMapped.scaleX ?? 1) * s;
  const h = tMapped.nh * dstPAPx.h * scaleFix * (tMapped.scaleY ?? 1) * s;

  return { x, y, w, h };
}, [tMapped, designImg, dstPAPx, scaleFix, view.previewAdjust]);


  // clip region = destination print area in stage px
  const clip = useMemo(() => {
    return { x: dstPAPx.x, y: dstPAPx.y, w: dstPAPx.w, h: dstPAPx.h };
  }, [dstPAPx.x, dstPAPx.y, dstPAPx.w, dstPAPx.h]);

  return (
    <Stage width={stageSize.w} height={stageSize.h}>
      <Layer>
        {/* ✅ base mockup drawn inside frame WITHOUT stretching */}
        {mockupImg && (
          <KImage
            image={mockupImg}
            x={mockupDraw.x}
            y={mockupDraw.y}
            width={mockupDraw.w}
            height={mockupDraw.h}
            rotation={(tMapped?.rotation ?? 0) + (view.previewAdjust?.r ?? 0)}
            listening={false}
          />
        )}

        {/* design clipped to print area */}
        <Group
          clipX={clip.x}
          clipY={clip.y}
          clipWidth={clip.w}
          clipHeight={clip.h}
          listening={false}
        >
          {designImg && placement && (
            <KImage
              image={designImg}
              x={placement.x}
              y={placement.y}
              width={placement.w}
              height={placement.h}
              rotation={tMapped?.rotation ?? 0}
              opacity={opacity}
              globalCompositeOperation={blend}
              listening={false}
            />
          )}
        </Group>
      </Layer>
    </Stage>
  );
}

