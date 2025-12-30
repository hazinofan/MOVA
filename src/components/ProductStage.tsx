"use client";

import React, { useEffect, useMemo, useRef } from "react";
import useImage from "use-image";
import { Stage, Layer, Image as KImage, Rect, Transformer } from "react-konva";
import type Konva from "konva";
import type { ProductConfig, PrintArea, ProductColor } from "@/lib/products";

// This matches what StudioShell now uses for saving transforms
type Transform = {
  nx: number; // 0..1 relative to printArea
  ny: number;
  nw: number;
  nh: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

type Props = {
  product: ProductConfig;

  // ✅ multiple layers
  designLayers: { id: string; src: string }[];
  activeDesignId: string | null;
  onSelectDesign: (id: string | null) => void;

  // ✅ per-design transforms
  transformByDesignId: Record<string, Transform>;
  onDesignTransformChange: (designId: string, t: Transform) => void;

  mockupSrc: string;
  printArea?: PrintArea;
  stageSize: { w: number; h: number };
  showPrintArea: boolean;

  snapToCenterSignal: number; // increment to trigger snap
  resetSignal: number; // increment to trigger reset

  onStageRef?: (stage: Konva.Stage | null) => void;

  // border color depends on garment color
  color: ProductColor;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function fitRect(
  imgW: number,
  imgH: number,
  target: { x: number; y: number; w: number; h: number },
  mode: "contain" | "cover" = "contain"
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

export default function ProductStage({
  product,
  mockupSrc,
  printArea,
  designLayers,
  activeDesignId,
  onSelectDesign,
  transformByDesignId,
  onDesignTransformChange,
  stageSize,
  showPrintArea,
  snapToCenterSignal,
  resetSignal,
  onStageRef,
  color,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // Keep refs for each layer node
  const nodeRefs = useRef<Record<string, Konva.Image | null>>({});

  const [mockupImg] = useImage(mockupSrc, "anonymous");

  const pa = (printArea ?? { x: 0.33, y: 0.22, w: 0.34, h: 0.48 }) as {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  const normalizeNodeScale = (designId: string) => {
    const node = nodeRefs.current[designId];
    if (!node) return;

    const w = node.width() * node.scaleX();
    const h = node.height() * node.scaleY();

    node.width(w);
    node.height(h);
    node.scaleX(1);
    node.scaleY(1);
  };

  const printPx = useMemo(() => {
    const { w, h } = stageSize;
    return {
      x: pa.x * w,
      y: pa.y * h,
      w: pa.w * w,
      h: pa.h * h,
    };
  }, [pa.x, pa.y, pa.w, pa.h, stageSize]);

  // Border color (white garment => dark border, black garment => light border)
  const printStrokeOuter =
    color === "white" ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)";
  const printStrokeInner =
    color === "white" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";

  const stageRect = { x: 0, y: 0, w: stageSize.w, h: stageSize.h };
  const mockupDraw = mockupImg
    ? fitRect(mockupImg.width, mockupImg.height, stageRect, "contain")
    : { x: 0, y: 0, w: stageSize.w, h: stageSize.h };

  const onUpdateCursor = (cursor: string) => {
    const container = stageRef.current?.container();
    if (container) container.style.cursor = cursor;
  };

  const emitTransform = (designId: string) => {
    const node = nodeRefs.current[designId];
    if (!node) return;

    const paPx = printPx;

    const wEff = node.width() * node.scaleX();
    const hEff = node.height() * node.scaleY();

    onDesignTransformChange(designId, {
      nx: (node.x() - paPx.x) / paPx.w,
      ny: (node.y() - paPx.y) / paPx.h,
      nw: wEff / paPx.w,
      nh: hEff / paPx.h,

      scaleX: 1,
      scaleY: 1,
      rotation: node.rotation(),
    });
  };

  const applyTransformToNode = (designId: string) => {
    const node = nodeRefs.current[designId];
    if (!node) return;

    const t = transformByDesignId[designId];
    if (!t) return;

    node.x(printPx.x + t.nx * printPx.w);
    node.y(printPx.y + t.ny * printPx.h);
    node.width(t.nw * printPx.w);
    node.height(t.nh * printPx.h);

    node.scaleX(1);
    node.scaleY(1);
    node.rotation(t.rotation ?? 0);
  };


  const initNodeIfMissing = (designId: string, img: HTMLImageElement) => {
    const node = nodeRefs.current[designId];
    if (!node) return;

    // If a transform exists, just apply it
    const hasSaved = !!transformByDesignId[designId];
    if (hasSaved) {
      applyTransformToNode(designId);
      node.getLayer()?.batchDraw();
      return;
    }

    // Otherwise, initialize inside print area (left-ish like your current feel)
    const startW = Math.min(printPx.w * 0.55, 360);
    const ratio = img.width / img.height || 1;
    const startH = startW / ratio;

    node.width(startW);
    node.height(startH);

    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);

    node.x(printPx.x + (printPx.w - startW) / 2 - printPx.w * 0.35);
    node.y(printPx.y + (printPx.h - startH) / 2);

    node.getLayer()?.batchDraw();
    emitTransform(designId);
  };

  const limitScale = (designId: string) => {
    const node = nodeRefs.current[designId];
    if (!node) return;

    const sx = clamp(node.scaleX(), 0.05, 10);
    const sy = clamp(node.scaleY(), 0.05, 10);

    node.scaleX(sx);
    node.scaleY(sy);
  };

  // Provide stage ref upward
  useEffect(() => {
    onStageRef?.(stageRef.current);
    return () => onStageRef?.(null);
  }, [onStageRef]);

  // Attach transformer to active node
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;

    const node = activeDesignId ? nodeRefs.current[activeDesignId] : null;

    if (!node) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    tr.nodes([node]);
    tr.getLayer()?.batchDraw();
  }, [activeDesignId, designLayers.length]);

  // When print area changes (switch side/color), re-apply saved transforms
  useEffect(() => {
    for (const layer of designLayers) {
      if (transformByDesignId[layer.id]) {
        applyTransformToNode(layer.id);
      }
    }
    stageRef.current?.batchDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printPx.x, printPx.y, printPx.w, printPx.h]);

  // Snap to center (for active design)
  useEffect(() => {
    if (!activeDesignId) return;
    const node = nodeRefs.current[activeDesignId];
    if (!node) return;

    const bbox = node.getClientRect({ skipTransform: false });
    const targetX = printPx.x + (printPx.w - bbox.width) / 2;
    const targetY = printPx.y + (printPx.h - bbox.height) / 2;

    node.x(node.x() + (targetX - bbox.x));
    node.y(node.y() + (targetY - bbox.y));

    node.getLayer()?.batchDraw();
    emitTransform(activeDesignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapToCenterSignal]);

  // Reset (for active design)
  useEffect(() => {
    if (!activeDesignId) return;
    const node = nodeRefs.current[activeDesignId];
    if (!node) return;

    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);

    const bbox = node.getClientRect({ skipTransform: false });
    const targetX = printPx.x + (printPx.w - bbox.width) / 2;
    const targetY = printPx.y + (printPx.h - bbox.height) / 2;

    node.x(node.x() + (targetX - bbox.x));
    node.y(node.y() + (targetY - bbox.y));

    node.getLayer()?.batchDraw();
    emitTransform(activeDesignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  return (
    <div className="relative w-full">
      <div className="aspect-[4/5] w-full max-w-[920px] mx-auto">
        <Stage
          ref={stageRef}
          width={stageSize.w}
          height={stageSize.h}
          className="w-full h-full rounded-2xl bg-neutral-950/40 ring-1 ring-white/10"
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) onSelectDesign(null);
          }}
        >
          <Layer>
            {/* Mockup */}
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

            {/* Print area overlay */}
            {showPrintArea && (
              <>
                <Rect
                  x={printPx.x}
                  y={printPx.y}
                  width={printPx.w}
                  height={printPx.h}
                  stroke={printStrokeOuter}
                  dash={[10, 8]}
                  cornerRadius={12}
                  listening={false}
                />
                <Rect
                  x={printPx.x + 10}
                  y={printPx.y + 10}
                  width={Math.max(0, printPx.w - 20)}
                  height={Math.max(0, printPx.h - 20)}
                  stroke={printStrokeInner}
                  dash={[6, 10]}
                  cornerRadius={10}
                  listening={false}
                />
              </>
            )}

            {/* ✅ Designs (layers) */}
            {designLayers.map((layer) => (
              <DesignLayerNode
                key={layer.id}
                id={layer.id}
                src={layer.src}
                active={layer.id === activeDesignId}
                onSelect={() => onSelectDesign(layer.id)}
                registerNode={(id, node) => {
                  nodeRefs.current[id] = node;
                }}
                onInitIfMissing={initNodeIfMissing}
                onDragEndEmit={(id) => emitTransform(id)}
                onTransformEndEmit={(id) => {
                  normalizeNodeScale(id);
                  emitTransform(id);
                }}
                onCursor={onUpdateCursor}
              />
            ))}

            <Transformer
              ref={trRef}
              rotateEnabled
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              keepRatio
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 40 || newBox.height < 40) return oldBox;
                return newBox;
              }}
              onMouseEnter={() => onUpdateCursor("nwse-resize")}
              onMouseLeave={() => onUpdateCursor("default")}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

function DesignLayerNode({
  id,
  src,
  active,
  onSelect,
  registerNode,
  onInitIfMissing,
  onDragEndEmit,
  onTransformEndEmit,
  onCursor,
}: {
  id: string;
  src: string;
  active: boolean;
  onSelect: () => void;
  registerNode: (id: string, node: Konva.Image | null) => void;
  onInitIfMissing: (id: string, img: HTMLImageElement) => void;
  onDragEndEmit: (id: string) => void;
  onTransformEndEmit: (id: string) => void;
  onCursor: (c: string) => void;
}) {
  const [img] = useImage(src ?? "", "anonymous");

  useEffect(() => {
    if (!img) return;
    onInitIfMissing(id, img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, id]);

  if (!img) return null;

  return (
    <KImage
      ref={(node) => registerNode(id, node)}
      image={img}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onMouseEnter={() => onCursor("move")}
      onMouseLeave={() => onCursor("default")}
      onDragStart={() => onCursor("grabbing")}
      onDragEnd={() => {
        onCursor("move");
        onDragEndEmit(id);
      }}
      onTransformStart={() => onCursor("nwse-resize")}
      onTransformEnd={() => {
        onCursor("move");
        onTransformEndEmit(id);
      }}
    />
  );
}
