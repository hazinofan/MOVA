"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import ProductStage from "./ProductStage";
import { PRODUCTS, type ProductType, type ProductColor, getProduct } from "@/lib/products";
import { downloadBlob, downloadJSON } from "@/lib/export";

type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  width: number;
  height: number;
};

// Keep aligned with lib/products.ts Area ids
type AreaId = "front" | "back" | "sleeve_right" | "sleeve_left" | "neck_label";

const COLORS: { id: ProductColor; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
];

// UI constraint: show only these parts
const UI_PARTS: AreaId[] = ["front", "back"];

export default function StudioShell() {
  const [productId, setProductId] = useState<ProductType>("tshirt");
  const product = useMemo(() => getProduct(productId), [productId]);

  const [areaId, setAreaId] = useState<AreaId>("front");
  const [color, setColor] = useState<ProductColor>("white");

  const [showPrintArea, setShowPrintArea] = useState(true);
  const [snapSignal, setSnapSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  type WorkspaceTheme = "light" | "dark";
  const [workspaceTheme, setWorkspaceTheme] = useState<WorkspaceTheme>("light");
  const isDark = workspaceTheme === "dark";

  const sidebar = {
    sectionTitle: isDark ? "text-white" : "text-neutral-900",
    hint: isDark ? "text-white/55" : "text-neutral-500",
    line: isDark ? "border-white/10" : "border-black/10",

    // surfaces
    surface: isDark ? "bg-neutral-950" : "bg-white",

    // buttons (idle)
    btnIdle: isDark
      ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
      : "border-black/10 bg-white text-neutral-900 hover:bg-black/[0.03]",

    // buttons (active)
    btnActive: isDark
      ? "border-white/20 bg-white/[0.10] text-white"
      : "border-black bg-black text-white",

    // little thumbnail boxes
    thumbIdle: isDark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-neutral-50",
    thumbActive: isDark ? "border-white/20 bg-white/[0.06]" : "border-white/20 bg-black/10",
  };

  const pageBg = isDark ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-900";
  const frameBg = isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10";
  const divider = isDark ? "border-black/10" : "border-white/10";
  const panelBg = isDark ? "bg-neutral-900" : "bg-white";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-black/[0.03]";
  const subtle = isDark ? "text-white/60" : "text-neutral-500";

  // per-area design (Printify style)
  const [designByArea, setDesignByArea] = useState<Record<string, string | null>>({});
  const designSrc = designByArea[areaId] ?? null;

  function setAreaDesign(src: string | null) {
    setDesignByArea((prev) => ({ ...prev, [areaId]: src }));
  }

  const onViewportWheel = useCallback((e: React.WheelEvent) => {
    // stop page from scrolling
    e.preventDefault();

    // smooth zoom factor
    const delta = e.deltaY;
    const step = 0.06; // feel free to tweak (0.04 to 0.10)

    setZoom((z) => {
      const next = delta > 0 ? z * (1 - step) : z * (1 + step);
      return Math.min(2.5, Math.max(0.15, +next.toFixed(3)));
    });
  }, []);

  // per-area transforms (each area remembers its position/scale)
  const [transformByArea, setTransformByArea] = useState<Record<string, Transform | null>>({});
  const currentTransform = transformByArea[areaId] ?? null;

  const stageRef = useRef<Konva.Stage | null>(null);

  // Stage export resolution
  const stageSize = { w: 900, h: 1125 };

  // Resolve current area config (fallback)
  const area = useMemo(() => {
    return (product as any).areas?.find((a: any) => a.id === areaId) ?? (product as any).areas?.[0];
  }, [product, areaId]);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  // user zoom (like Printify) - 15% to 250%
  const [zoom, setZoom] = useState(1);

  // base scale that fits the whole stage into available space
  const [fitScale, setFitScale] = useState(1);

  // final scale used for display only
  const displayScale = fitScale * zoom;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();

      // leave some breathing room (padding + toolbar)
      const pad = 24;
      const availableW = Math.max(100, rect.width - pad * 2);
      const availableH = Math.max(100, rect.height - pad * 2);

      const s = Math.min(availableW / stageSize.w, availableH / stageSize.h);
      setFitScale(s);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [stageSize.w, stageSize.h]);

  function fitToView() {
    setZoom(1);
  }


  // Only show Front/Back in UI if present on product
  const uiAreas = useMemo(() => {
    const areas = ((product as any).areas ?? []) as any[];
    const filtered = areas.filter((a) => UI_PARTS.includes(a.id));
    return filtered.length ? filtered : areas; // fallback if a product has no front/back
  }, [product]);

  // If product changes and current area doesn't exist OR not allowed in UI, reset to first UI area
  useEffect(() => {
    const exists = ((product as any).areas ?? []).some((a: any) => a.id === areaId);
    if (!exists) {
      if (uiAreas[0]?.id) setAreaId(uiAreas[0].id);
      return;
    }

    // If current area is sleeves/neck, push user to front/back (for UI)
    if (UI_PARTS.includes(areaId)) return;
    if (uiAreas[0]?.id) setAreaId(uiAreas[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, uiAreas]);

  const mockupSrc = useMemo(() => {
    if (!area) return "";
    return area.mockup(color);
  }, [area, color]);

  const handleDesignTransformChange = useCallback(
    (t: Transform) => {
      setTransformByArea((prev) => ({ ...prev, [areaId]: t }));
    },
    [areaId]
  );

  function onUpload(file: File) {
    if (
      !file.type.includes("png") &&
      !file.type.includes("svg") &&
      !file.type.includes("jpeg") &&
      !file.type.includes("jpg")
    ) {
      alert("Upload PNG, SVG, JPG, or JPEG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAreaDesign(String(reader.result));
    reader.readAsDataURL(file);
  }

  function applyToAllAreas() {
    const src = designByArea[areaId];
    if (!src) return;

    const next: Record<string, string | null> = {};
    for (const a of (product as any).areas ?? []) next[a.id] = src;
    setDesignByArea(next);
  }

  const STUDIO_H = "h-[calc(100vh-100px)]";

  // ---------- RIGHT PREVIEW (exact export crop) ----------
  const [exportPreviewSrc, setExportPreviewSrc] = useState<string | null>(null);

  const buildPrintDataUrl = useCallback(
    (pixelRatio: number) => {
      const stage = stageRef.current;
      if (!stage || !area) return null;

      const pa = area.printArea as { x: number; y: number; w: number; h: number };
      const x = pa.x * stageSize.w;
      const y = pa.y * stageSize.h;
      const w = pa.w * stageSize.w;
      const h = pa.h * stageSize.h;

      return stage.toDataURL({
        x,
        y,
        width: w,
        height: h,
        pixelRatio,
        mimeType: "image/png",
        quality: 1,
      });
    },
    [area, stageSize.h, stageSize.w]
  );

  const refreshPreview = useCallback(() => {
    if (!designSrc) {
      setExportPreviewSrc(null);
      return;
    }
    const url = buildPrintDataUrl(2); // crisp but fast
    setExportPreviewSrc(url);
  }, [buildPrintDataUrl, designSrc]);

  // keep preview in sync with edits
  useEffect(() => {
    refreshPreview();
  }, [refreshPreview, productId, areaId, color, snapSignal, resetSignal, showPrintArea, currentTransform, designSrc]);

  async function exportPrintPNG() {
    const dataUrl = buildPrintDataUrl(3); // best quality export
    if (!dataUrl) return;

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, `mova-${productId}-${areaId}-${color}-print.png`);
  }

  function exportJSON() {
    if (!designSrc || !currentTransform) return;

    downloadJSON(
      {
        product: productId,
        area: areaId,
        color,
        stage: stageSize,
        transform: currentTransform,
        designSrc,
        createdAt: new Date().toISOString(),
      },
      `mova-${productId}-${areaId}-${color}-meta.json`
    );
  }

  const bodyH = "h-[calc(100vh-64px-24px-24px-72px)]";

  return (
    <div className={`min-h-[calc(107vh-64px)] ${pageBg}`}>
      <div className="mx-auto max-w-[120rem] px-4 py-6">
        {/* Unified workspace frame */}
        <div className={`overflow-hidden rounded-3xl border ${frameBg} shadow-sm`}>
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-2 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <button className="h-10 rounded-xl border ${divider} ${panelBg} ${hoverBg} px-3 text-sm hover:bg-black/[0.03]">
                ←
              </button>

              <div className="flex flex-col leading-tight">
                <div className="text-base font-semibold">New product #1</div>
                <div className="text-xs text-neutral-500">MOVA Studio</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Workspace theme toggle */}
              <div className="flex items-center gap-1 rounded-xl border ${divider} ${panelBg} ${hoverBg} p-1">
                <button
                  onClick={() => setWorkspaceTheme("light")}
                  className={[
                    "h-9 rounded-lg px-3 text-sm transition",
                    workspaceTheme === "light"
                      ? "bg-black text-white"
                      : "hover:bg-black/[0.04] text-neutral-700",
                  ].join(" ")}
                >
                  Light
                </button>
                <button
                  onClick={() => setWorkspaceTheme("dark")}
                  className={[
                    "h-9 rounded-lg px-3 text-sm transition",
                    workspaceTheme === "dark"
                      ? "bg-black text-white"
                      : "hover:bg-black/[0.04] text-neutral-700",
                  ].join(" ")}
                >
                  Dark
                </button>
              </div>

              <button className="h-10 rounded-xl border ${divider} ${panelBg} ${hoverBg} px-4 text-sm hover:bg-black/[0.03]">
                Save & exit
              </button>

              <button className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white disabled:opacity-40">
                Checkout
              </button>
            </div>
          </div>

          {/* 3-panel body with ONLY dividers */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] border-t ${divider} ${STUDIO_H}`}
          >

            {/* LEFT PANEL */}
            <aside className={`h-full border-r ${sidebar.line} ${sidebar.surface}`}>
              <div className={`h-full flex flex-col`}>
                {/* Upload */}
                <div className="p-4">
                  <div className={`text-sm font-druk ${sidebar.sectionTitle}`}>Upload</div>

                  <label className={`mt-3 grid h-11 cursor-pointer place-items-center rounded-xl border text-sm font-semibold ${sidebar.btnIdle}`}>
                    Upload from device
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUpload(f);
                      }}
                    />
                  </label>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={applyToAllAreas}
                      disabled={!designSrc}
                      className={`h-10 rounded-xl border px-3 text-sm disabled:opacity-40 ${sidebar.btnIdle}`}
                    >
                      Apply to all
                    </button>

                    <button
                      onClick={() => setAreaDesign(null)}
                      disabled={!designSrc}
                      className={`h-10 rounded-xl border px-3 text-sm disabled:opacity-40 ${sidebar.btnIdle}`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className={`mt-3 text-xs ${sidebar.hint}`}>
                    Best: PNG with transparent background.
                  </div>
                </div>

                <div className={`border-t ${sidebar.line}`} />

                {/* Scroll content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Products */}
                  <div className="space-y-3">
                    <div className={`text-sm font-druk ${sidebar.sectionTitle}`}>Products</div>

                    <div className="grid gap-2">
                      {PRODUCTS.map((p) => {
                        const active = p.id === productId;
                        const thumb = (p as any).thumb ?? (p as any).thumbnail ?? null;

                        return (
                          <button
                            key={p.id}
                            onClick={() => setProductId(p.id)}
                            className={[
                              "w-full rounded-2xl border px-3 py-3 text-left transition",
                              active ? sidebar.btnActive : sidebar.btnIdle,
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={[
                                  "h-12 w-12 overflow-hidden rounded-xl border grid place-items-center",
                                  active ? sidebar.thumbActive : sidebar.thumbIdle,
                                ].join(" ")}
                              >
                                {thumb ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={thumb} alt={p.label} className="h-full w-full object-cover" />
                                ) : (
                                  <span className={active ? "text-white/70 text-xs" : `${sidebar.hint} text-xs`}>
                                    IMG
                                  </span>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="text-sm font-semibold leading-tight">{p.label}</div>
                                <div className={active ? "text-white/70 text-xs" : "text-neutral-500 text-xs"}>
                                  {(p as any).areas?.length ? `${(p as any).areas.length} areas` : "1 area"}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parts */}
                  <div className="space-y-3">
                    <div className={`text-sm font-druk ${sidebar.sectionTitle}`}>Part</div>
                    <div className="grid grid-cols-2 gap-2">
                      {uiAreas.map((a: any) => {
                        const active = a.id === areaId;
                        return (
                          <button
                            key={a.id}
                            onClick={() => setAreaId(a.id)}
                            className={[
                              "h-10 rounded-xl border text-sm transition",
                              active ? sidebar.btnActive : sidebar.btnIdle,
                            ].join(" ")}
                          >
                            {a.label ?? a.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-3">
                    <div className={`text-sm font-druk ${sidebar.sectionTitle}`}>Product color</div>

                    <div className="grid grid-cols-2 gap-2">
                      {COLORS.map((c) => {
                        const active = c.id === color;

                        // IMPORTANT: dot never disappears
                        const dotClass =
                          c.id === "white"
                            ? isDark
                              ? "bg-white border-white/30"
                              : "bg-white border-black/20"
                            : isDark
                              ? "bg-black border-white/20"
                              : "bg-black border-black/20";

                        return (
                          <button
                            key={c.id}
                            onClick={() => setColor(c.id)}
                            className={[
                              "h-10 rounded-xl border text-sm transition flex items-center justify-center gap-2",
                              active ? sidebar.btnActive : sidebar.btnIdle,
                            ].join(" ")}
                          >
                            <span className={`h-4 w-4 rounded-full border ${dotClass}`} />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="space-y-3">
                    <div className={`text-sm font-druk ${sidebar.sectionTitle}`}>Tools</div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowPrintArea((v) => !v)}
                        className={`h-10 rounded-xl border text-sm ${sidebar.btnIdle}`}
                      >
                        {showPrintArea ? "Hide area" : "Show area"}
                      </button>

                      <button
                        onClick={() => setSnapSignal((v) => v + 1)}
                        disabled={!designSrc}
                        className={`h-10 rounded-xl border text-sm disabled:opacity-40 ${sidebar.btnIdle}`}
                      >
                        Center
                      </button>

                      <button
                        onClick={() => setResetSignal((v) => v + 1)}
                        disabled={!designSrc}
                        className={`h-10 rounded-xl border text-sm disabled:opacity-40 col-span-2 ${sidebar.btnIdle}`}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>


            {/* MIDDLE PANEL */}
            <main className={`relative h-full overflow-hidden ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}>
              {/* top small icons row (optional) */}
              <div className="grid grid-cols-2 gap-2 mx-auto max-w-3xl pt-5 gap-16">
                {uiAreas.map((a: any) => {
                  const active = a.id === areaId;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setAreaId(a.id)}
                      className={[
                        "h-10 rounded-xl border text-sm transition",
                        active ? sidebar.btnActive : sidebar.btnIdle,
                      ].join(" ")}
                    >
                      {a.label ?? a.id}
                    </button>
                  );
                })}
              </div>

              {/* VIEWPORT AREA: takes all remaining height */}
              <div
                ref={viewportRef}
                onWheel={onViewportWheel}
                className="h-[calc(100%-64px)] px-4 pb-4 overflow-hidden"
              >
                <div className="h-full w-full flex items-center justify-center">
                  {/* This wrapper is the key: we render stage at real size, but SCALE it */}
                  <div
                    style={{
                      width: stageSize.w,
                      height: stageSize.h,
                      transform: `scale(${displayScale})`,
                      transformOrigin: "center center",
                    }}
                    className="will-change-transform"
                  >
                    <div className={`rounded-2xl border ${divider} ${panelBg} overflow-hidden`}>
                      <div className="p-3">
                        <ProductStage
                          product={product}
                          mockupSrc={mockupSrc}
                          printArea={area?.printArea?.[color] ?? area?.printArea}
                          designSrc={designSrc}
                          color={color}
                          stageSize={stageSize}
                          showPrintArea={showPrintArea}
                          snapToCenterSignal={snapSignal}
                          resetSignal={resetSignal}
                          onStageRef={(s) => (stageRef.current = s)}
                          onDesignTransformChange={handleDesignTransformChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </main>


            {/* RIGHT PANEL */}
            <aside className="border-t ${divider} lg:border-t-0">
              <div className="h-full border-l ${divider}">
                <div className="p-4">
                  <div className="text-sm font-semibold">Export preview</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    Exactly what you’ll download (transparent PNG).
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border ${divider} ${panelBg} ${hoverBg}">
                    <div className="aspect-square w-full grid place-items-center">
                      {exportPreviewSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={exportPreviewSrc} alt="Export preview" className="h-full w-full object-contain" />
                      ) : (
                        <div className="text-neutral-400 text-sm px-6 text-center">
                          Upload a design to generate preview
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <button
                      onClick={exportPrintPNG}
                      disabled={!designSrc}
                      className="h-11 w-full rounded-xl bg-black text-sm font-semibold text-white disabled:opacity-40"
                    >
                      Download PNG
                    </button>

                    <button
                      onClick={exportJSON}
                      disabled={!designSrc || !currentTransform}
                      className="h-11 w-full rounded-xl border ${divider} ${panelBg} ${hoverBg} text-sm hover:bg-black/[0.03] disabled:opacity-40"
                    >
                      Download JSON
                    </button>

                    <button
                      onClick={() => setAreaDesign(null)}
                      disabled={!designSrc}
                      className="h-11 w-full rounded-xl border ${divider} ${panelBg} ${hoverBg} text-sm hover:bg-black/[0.03] disabled:opacity-40"
                    >
                      Clear design
                    </button>
                  </div>

                  <h1 className=" font-druk mt-5 justify-self-center"> ZOOM CONTROLS </h1>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setZoom((z) => Math.max(0.15, +(z - 0.1).toFixed(2)))}
                      className={`h-10 rounded-xl border border-gray-400 px-4 text-sm ${hoverBg}`}
                    >
                      −
                    </button>

                    <div className={`h-10 rounded-xl border border-gray-400 px-4 text-sm grid place-items-center`}>
                      {Math.round(displayScale * 100)}%
                    </div>

                    <button
                      onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
                      className={`h-10 rounded-xl border border-gray-400 px-4 text-sm ${hoverBg}`}
                    >
                      +
                    </button>

                    <button
                      onClick={fitToView}
                      className={`h-10 rounded-xl border border-gray-400 px-4 text-sm ${hoverBg}`}
                    >
                      Fit
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );

  // small helper
  function ToolPill({ children }: { children: React.ReactNode }) {
    return (
      <button className="h-10 rounded-xl border ${divider} ${panelBg} ${hoverBg} px-4 text-sm hover:bg-black/[0.03]">
        {children}
      </button>
    );
  }
}
