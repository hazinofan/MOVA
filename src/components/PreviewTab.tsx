"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Image as KImage, Group } from "react-konva";
import type { ProductColor, PrintArea as ProductPrintArea } from "@/lib/products";

/** Rect in 0..1 coordinates */
type Rect01 = { x: number; y: number; w: number; h: number };

type DesignLayer = { id: string; src: string; name?: string };

// normalized relative to SOURCE print area (front/back)
export type NormalizedTransform = {
  nx: number;
  ny: number;
  nw: number;
  nh: number;
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
  previewAdjust?: { dx?: number; dy?: number; s?: number };
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
  if (typeof (printArea as any).x === "number") return printArea as Rect01;
  const map = printArea as Record<ProductColor, Rect01>;
  return map[color] ?? fallback;
}

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

function mapTransformBetweenPrintAreas(
  t: NormalizedTransform,
  srcPA: Rect01,
  dstPA: Rect01
): NormalizedTransform {
  const ax = srcPA.x + t.nx * srcPA.w;
  const ay = srcPA.y + t.ny * srcPA.h;
  const aw = t.nw * srcPA.w;
  const ah = t.nh * srcPA.h;

  return {
    nx: (ax - dstPA.x) / dstPA.w,
    ny: (ay - dstPA.y) / dstPA.h,
    nw: aw / dstPA.w,
    nh: ah / dstPA.h,
    scaleX: t.scaleX,
    scaleY: t.scaleY,
    rotation: t.rotation,
  };
}

export function PreviewTab({
  views,
  activeViewId,
  onChangeViewId,
  color,

  // ✅ NEW
  designLayersByArea,
  transformByArea,

  stageSize,
  sourcePrintAreaBySide,
}: {
  views: MockupView[];
  activeViewId?: string;
  onChangeViewId?: (id: string) => void;
  color: ProductColor;

  // ✅ multi-layer inputs
  designLayersByArea: Record<string, DesignLayer[]>;
  transformByArea: Record<string, Record<string, NormalizedTransform>>;

  stageSize: { w: number; h: number };
  sourcePrintAreaBySide?: Partial<Record<"front" | "back", Rect01>>;
}) {
  // controlled/uncontrolled active view
  const [internalId, setInternalId] = useState<string>(
    () => views[0]?.id ?? "front"
  );
  const id = activeViewId ?? internalId;
  const setId = onChangeViewId ?? setInternalId;

  useEffect(() => {
    if (!views.some((v) => v.id === id)) setId(views[0]?.id ?? "front");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);

  const active = useMemo(
    () => views.find((v) => v.id === id) ?? views[0],
    [views, id]
  );

  const sourceSide: "front" | "back" = (active?.sourceAreaId ?? "front") as any;

  // ✅ get all layers for that side
  const layers = designLayersByArea?.[sourceSide] ?? [];

  // ✅ transforms for that side: designId -> transform
  const transformsById = transformByArea?.[sourceSide] ?? {};

  // fit stage to available space
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const pad = 24;
      const availableW = Math.max(100, r.width - pad * 2);
      const availableH = Math.max(100, r.height - pad * 2);
      setFitScale(Math.min(availableW / stageSize.w, availableH / stageSize.h));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [stageSize.w, stageSize.h]);

  return (
    <div ref={viewportRef} className="h-full w-full overflow-hidden">
      <div
        className="h-full w-full flex items-center justify-center rounded-xl"
        style={{ background: "#f9f9f9" }}
      >
        <div
          style={{
            width: stageSize.w,
            height: stageSize.h,
            transform: `scale(${fitScale})`,
            transformOrigin: "center center",
          }}
          className="will-change-transform"
        >
          <BigMockupStage
            key={`${active.id}-${color}-${layers.length}`}
            view={active}
            color={color}
            layers={layers}
            transformsById={transformsById}
            stageSize={stageSize}
            sourcePrintAreaBySide={sourcePrintAreaBySide}
          />
        </div>
      </div>
    </div>
  );
}

function BigMockupStage({
  view,
  color,
  layers,
  transformsById,
  stageSize,
  sourcePrintAreaBySide,
}: {
  view: MockupView;
  color: ProductColor;
  layers: DesignLayer[];
  transformsById: Record<string, NormalizedTransform>;
  stageSize: { w: number; h: number };
  sourcePrintAreaBySide?: Partial<Record<"front" | "back", Rect01>>;
}) {
  const mockupSrc = useMemo(
    () => resolveMockupSrc(view.mockup, color),
    [view.mockup, color]
  );
  const [mockupImg] = useImage(mockupSrc, "anonymous");

  // ⚠️ Same note as ProductStage: hooks inside map.
  // If you want hook-safe structure, I can give a child component version.
  const layerImgs = layers.map((l) => ({
    id: l.id,
    img: useImage(l.src ?? "", "anonymous")[0] as HTMLImageElement | undefined,
  }));

  const frame = view.frame ?? { x: 0, y: 0, w: 1, h: 1 };
  const fitMode = view.fit ?? "contain";

  const framePx = useMemo(
    () => ({
      x: frame.x * stageSize.w,
      y: frame.y * stageSize.h,
      w: frame.w * stageSize.w,
      h: frame.h * stageSize.h,
    }),
    [frame, stageSize]
  );

  const dstPA01 = useMemo(() => {
    const fallback: Rect01 = { x: 0.28, y: 0.25, w: 0.44, h: 0.5 };
    return resolvePrintAreaRect(view.printArea, color, fallback);
  }, [view.printArea, color]);

  const mockupDraw = useMemo(() => {
    if (!mockupImg)
      return {
        x: framePx.x,
        y: framePx.y,
        w: framePx.w,
        h: framePx.h,
        scale: 1,
      };
    return fitRect(mockupImg.width, mockupImg.height, framePx, fitMode);
  }, [mockupImg, framePx, fitMode]);

  const dstPAPx = useMemo(
    () => ({
      x: mockupDraw.x + dstPA01.x * mockupDraw.w,
      y: mockupDraw.y + dstPA01.y * mockupDraw.h,
      w: dstPA01.w * mockupDraw.w,
      h: dstPA01.h * mockupDraw.h,
    }),
    [mockupDraw, dstPA01]
  );

  const scaleFix = view.designScale ?? 1;
  const opacity = view.designOpacity ?? 0.95;
  const blend = view.blendMode ?? (color === "black" ? "source-over" : "multiply");

  const sourceSide: "front" | "back" = (view.sourceAreaId ?? "front") as any;
  const srcPA01 = useMemo(
    () => sourcePrintAreaBySide?.[sourceSide] ?? dstPA01,
    [sourcePrintAreaBySide, sourceSide, dstPA01]
  );

  const clip = useMemo(
    () => ({ x: dstPAPx.x, y: dstPAPx.y, w: dstPAPx.w, h: dstPAPx.h }),
    [dstPAPx]
  );

  return (
    <Stage width={stageSize.w} height={stageSize.h}>
      <Layer>
        {mockupImg && (
          <KImage
            image={mockupImg}
            x={mockupDraw.x}
            y={mockupDraw.y}
            width={mockupDraw.w}
            height={mockupDraw.h}
            listening={false}
          />
        )}

        <Group
          clipX={clip.x}
          clipY={clip.y}
          clipWidth={clip.w}
          clipHeight={clip.h}
          listening={false}
        >
          {layers.map((layer) => {
            const t = transformsById[layer.id];
            const img = layerImgs.find((x) => x.id === layer.id)?.img;

            if (!img || !t) return null;

            const same =
              srcPA01.x === dstPA01.x &&
              srcPA01.y === dstPA01.y &&
              srcPA01.w === dstPA01.w &&
              srcPA01.h === dstPA01.h;

            const tMapped = same ? t : mapTransformBetweenPrintAreas(t, srcPA01, dstPA01);

            const adj = view.previewAdjust ?? {};
            const dx = adj.dx ?? 0;
            const dy = adj.dy ?? 0;
            const s = adj.s ?? 1;

            const x = dstPAPx.x + (tMapped.nx + dx) * dstPAPx.w;
            const y = dstPAPx.y + (tMapped.ny + dy) * dstPAPx.h;

            const w = tMapped.nw * dstPAPx.w * scaleFix * s;
            const h = tMapped.nh * dstPAPx.h * scaleFix * s;

            return (
              <KImage
                key={layer.id}
                image={img}
                x={x}
                y={y}
                width={w}
                height={h}
                rotation={tMapped.rotation ?? 0}
                opacity={opacity}
                globalCompositeOperation={blend}
                listening={false}
              />
            );
          })}
        </Group>
      </Layer>
    </Stage>
  );
}
