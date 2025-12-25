"use client";

import React, { useEffect, useMemo, useRef } from "react";
import useImage from "use-image";
import { Stage, Layer, Image as KImage, Rect, Transformer } from "react-konva";
import type Konva from "konva";
import type { ProductConfig, PrintArea } from "@/lib/products";

type TransformPayload = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  width: number;
  height: number;
};

type Props = {
  product: ProductConfig;
  mockupSrc: string;
  printArea?: PrintArea;
  designSrc: string | null;
  onDesignTransformChange: (t: TransformPayload) => void;
  stageSize: { w: number; h: number };
  showPrintArea: boolean;
  snapToCenterSignal: number; // increment to trigger snap
  resetSignal: number; // increment to trigger reset
  onStageRef?: (stage: Konva.Stage | null) => void;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function ProductStage({
  product,
  mockupSrc,
  printArea,
  designSrc,
  onDesignTransformChange,
  stageSize,
  showPrintArea,
  snapToCenterSignal,
  resetSignal,
  onStageRef,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const designRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const [mockupImg] = useImage(mockupSrc, "anonymous");
  const [designImg] = useImage(designSrc ?? "", "anonymous");

  const pa = printArea ?? { x: 0.33, y: 0.22, w: 0.34, h: 0.48 };

  const printPx = useMemo(() => {
    const { w, h } = stageSize;
    return {
      x: pa.x * w,
      y: pa.y * h,
      w: pa.w * w,
      h: pa.h * h,
    };
  }, [pa.x, pa.y, pa.w, pa.h, stageSize]);

  // Initialize design position when loaded OR when we switch area/mockup
  useEffect(() => {
    if (!designImg || !designRef.current) return;

    const node = designRef.current;

    const startW = Math.min(printPx.w * 0.55, 360);
    const ratio = designImg.width / designImg.height || 1;
    const startH = startW / ratio;

    node.width(startW);
    node.height(startH);

    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);

    node.x(printPx.x + (printPx.w - startW) / 2);
    node.y(printPx.y + (printPx.h - startH) / 2);

    node.getLayer()?.batchDraw();

    onDesignTransformChange({
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
      width: node.width(),
      height: node.height(),
    });
  }, [designImg, mockupSrc, printPx.x, printPx.y, printPx.w, printPx.h, onDesignTransformChange]);

  // Attach transformer
  useEffect(() => {
    if (!trRef.current) return;

    if (!designSrc || !designRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
      return;
    }

    trRef.current.nodes([designRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [designSrc]);

  // Provide stage ref upward
  useEffect(() => {
    onStageRef?.(stageRef.current);
    return () => onStageRef?.(null);
  }, [onStageRef]);

  // Snap to center trigger (centers inside print area)
  useEffect(() => {
    if (!designRef.current) return;
    const node = designRef.current;

    const bbox = node.getClientRect({ skipTransform: false });
    const targetX = printPx.x + (printPx.w - bbox.width) / 2;
    const targetY = printPx.y + (printPx.h - bbox.height) / 2;

    node.x(node.x() + (targetX - bbox.x));
    node.y(node.y() + (targetY - bbox.y));

    node.getLayer()?.batchDraw();

    onDesignTransformChange({
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
      width: node.width(),
      height: node.height(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapToCenterSignal]);

  // Reset trigger
  useEffect(() => {
    if (!designRef.current) return;
    const node = designRef.current;

    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);

    const bbox = node.getClientRect({ skipTransform: false });
    const targetX = printPx.x + (printPx.w - bbox.width) / 2;
    const targetY = printPx.y + (printPx.h - bbox.height) / 2;

    node.x(node.x() + (targetX - bbox.x));
    node.y(node.y() + (targetY - bbox.y));

    node.getLayer()?.batchDraw();

    onDesignTransformChange({
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
      width: node.width(),
      height: node.height(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const onSelectDesign = () => {
    if (!trRef.current || !designRef.current) return;
    trRef.current.nodes([designRef.current]);
    trRef.current.getLayer()?.batchDraw();
  };

  const onUpdateCursor = (cursor: string) => {
    const container = stageRef.current?.container();
    if (container) container.style.cursor = cursor;
  };

  const emitTransform = () => {
    if (!designRef.current) return;
    const node = designRef.current;

    onDesignTransformChange({
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
      width: node.width(),
      height: node.height(),
    });
  };

  const limitScale = () => {
    if (!designRef.current) return;
    const node = designRef.current;

    const sx = clamp(node.scaleX(), 0.05, 10);
    const sy = clamp(node.scaleY(), 0.05, 10);

    node.scaleX(sx);
    node.scaleY(sy);
  };

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
            if (clickedOnEmpty && trRef.current) trRef.current.nodes([]);
          }}
        >
          <Layer>
            {/* Mockup (cover full stage) */}
            {mockupImg && (
              <KImage
                image={mockupImg}
                x={0}
                y={0}
                width={stageSize.w}
                height={stageSize.h}
                listening={false}
              />
            )}

            {/* Print area overlay (recommended zone) */}
            {showPrintArea && (
              <>
                <Rect
                  x={printPx.x}
                  y={printPx.y}
                  width={printPx.w}
                  height={printPx.h}
                  stroke="rgba(255,255,255,0.8)"
                  dash={[10, 8]}
                  cornerRadius={12}
                  listening={false}
                />
                <Rect
                  x={printPx.x + 10}
                  y={printPx.y + 10}
                  width={Math.max(0, printPx.w - 20)}
                  height={Math.max(0, printPx.h - 20)}
                  stroke="rgba(255,255,255,0.35)"
                  dash={[6, 10]}
                  cornerRadius={10}
                  listening={false}
                />
              </>
            )}

            {/* Design */}
            {designImg && designSrc && (
              <KImage
                ref={designRef}
                image={designImg}
                draggable
                onClick={onSelectDesign}
                onTap={onSelectDesign}
                onMouseEnter={() => onUpdateCursor("move")}
                onMouseLeave={() => onUpdateCursor("default")}
                onDragStart={() => onUpdateCursor("grabbing")}
                onDragEnd={() => {
                  onUpdateCursor("move");
                  emitTransform();
                }}
                onTransformStart={() => onUpdateCursor("nwse-resize")}
                onTransformEnd={() => {
                  onUpdateCursor("move");
                  limitScale();
                  emitTransform();
                }}
              />
            )}

            <Transformer
              ref={trRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
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
