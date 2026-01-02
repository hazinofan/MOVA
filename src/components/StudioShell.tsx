"use client";
import MockupPreviews, { type MockupView } from "./MockupPreviews";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import ProductStage from "./ProductStage";
import { downloadBlob, downloadJSON } from "@/lib/export";
import { PreviewTab } from "./PreviewTab";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import type { ProductConfig, ProductColor } from "@/lib/products";

type Transform = {
  nx: number; // 0..1 relative to printArea
  ny: number;
  nw: number;
  nh: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

type DesignLayer = {
  id: string;
  src: string;
  name?: string;
};

type TransformByDesign = Record<string, Transform>;

type NormalizedTransform = {
  nx: number;
  ny: number;
  nw: number;
  nh: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

// Keep aligned with lib/products.ts Area ids
type AreaId = "front" | "back" | "sleeve_right" | "sleeve_left" | "neck_label";

const COLORS: { id: ProductColor; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
];

// UI constraint: show only these parts
const UI_PARTS: AreaId[] = ["front", "back"];

export default function StudioShell({ product }: { product: ProductConfig }) {
  const productId = product.id;
  useEffect(() => {
  console.log("🧠 StudioShell product", product);
  console.log("🧱 areas mockup type sample", product.areas?.[0]?.id, typeof (product.areas?.[0] as any)?.mockup);
  console.log("🖼️ views mockup type sample", product.views?.[0]?.id, typeof (product.views?.[0] as any)?.mockup);

  // also check current computed mockupSrc (if area exists)
  const a0: any = product.areas?.find((a: any) => a.id === "front") ?? product.areas?.[0];
  try {
    if (a0?.mockup) console.log("🧪 front mockup('white')", a0.mockup("white"));
  } catch (e) {
    console.error("💥 front mockup call failed", e);
  }
}, [product]);

  type StudioTab = "customize" | "preview";
  const [tab, setTab] = useState<StudioTab>("customize");
  const [areaId, setAreaId] = useState<AreaId>("front");
  const [color, setColor] = useState<ProductColor>("white");
  const views = product.views ?? [];

  const [previewViewId, setPreviewViewId] = useState<string>(
    () => views[0]?.id ?? "front"
  );

  // keep it valid when product changes
  useEffect(() => {
    const next = (product.views?.[0]?.id ?? "front") as string;
    setPreviewViewId(next);
  }, [product]);

  const previewView = useMemo(() => {
    return (
      (product.views ?? []).find((v: any) => v.id === previewViewId) ??
      (product.views ?? [])[0]
    );
  }, [product, previewViewId]);

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
    thumbIdle: isDark
      ? "border-white/10 bg-white/[0.03]"
      : "border-black/10 bg-neutral-50",
    thumbActive: isDark
      ? "border-white/20 bg-white/[0.06]"
      : "border-white/20 bg-black/10",
  };

  const pageBg = isDark
    ? "bg-neutral-950 text-white"
    : "bg-neutral-100 text-neutral-900";
  const frameBg = isDark
    ? "bg-neutral-900 border-white/10"
    : "bg-white border-black/10";
  const divider = isDark ? "border-black/10" : "border-white/10";
  const panelBg = isDark ? "bg-neutral-900" : "bg-white";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-black/[0.03]";
  const subtle = isDark ? "text-white/60" : "text-neutral-500";

  // per-area design (Printify style)
  const [designLayersByArea, setDesignLayersByArea] = useState<
    Record<string, DesignLayer[]>
  >({});

  const layers = designLayersByArea[areaId] ?? [];

  const [activeDesignIdByArea, setActiveDesignIdByArea] = useState<
    Record<string, string | null>
  >({});

  const hasAnyDesign = layers.length > 0;
  const activeDesignId = activeDesignIdByArea[areaId] ?? layers[0]?.id ?? null;

  function setActiveDesignId(id: string | null) {
    setActiveDesignIdByArea((prev) => ({ ...prev, [areaId]: id }));
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
  const [transformByArea, setTransformByArea] = useState<
    Record<string, TransformByDesign>
  >({});

  const transformsForArea = transformByArea[areaId] ?? {};
  const currentTransform = activeDesignId
    ? transformsForArea[activeDesignId] ?? null
    : null;

  const stageRef = useRef<Konva.Stage | null>(null);

  // Stage export resolution
  const stageSize = { w: 900, h: 1125 };

  // Resolve current area config (fallback)
  const area = useMemo(() => {
    return (
      (product as any).areas?.find((a: any) => a.id === areaId) ??
      (product as any).areas?.[0]
    );
  }, [product, areaId]);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const previewStageRef = useRef<Konva.Stage | null>(null);

  // user zoom (like Printify) - 15% to 250%
  const [zoom, setZoom] = useState(1);

  // base scale that fits the whole stage into available space
  const [fitScale, setFitScale] = useState(1);

  // final scale used for display only
  const displayScale = fitScale * zoom;

  useEffect(() => {
    if (tab !== "customize") return; // ✅ only compute for customize

    const el = viewportRef.current;
    if (!el) return;

    let raf = 0;

    const compute = () => {
      const rect = el.getBoundingClientRect();

      // ✅ if hidden / not laid out yet, ignore
      if (rect.width < 50 || rect.height < 50) return;

      const pad = 24;
      const availableW = Math.max(100, rect.width - pad * 2);
      const availableH = Math.max(100, rect.height - pad * 2);

      const s = Math.min(availableW / stageSize.w, availableH / stageSize.h);

      // ✅ clamp (prevents micro-scale)
      const clamped = Math.min(2.5, Math.max(0.15, s));
      setFitScale(clamped);
    };

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    });

    ro.observe(el);

    // ✅ compute once AFTER layout settles
    raf = requestAnimationFrame(compute);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tab, stageSize.w, stageSize.h]);

  useEffect(() => {
    if (tab !== "customize") return;
    setZoom(1); // optional: reset zoom when returning
    // fitScale will recompute by the observer now
  }, [tab]);

  function fitToView() {
    setZoom(1);
  }

  // Only show Front/Back in UI if present on product
  const uiAreas = useMemo(() => {
    const areas = ((product as any).areas ?? []) as any[];
    const filtered = areas.filter((a) => UI_PARTS.includes(a.id));
    return filtered.length ? filtered : areas;
  }, [product]);

  useEffect(() => {
    const exists = ((product as any).areas ?? []).some(
      (a: any) => a.id === areaId
    );
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

  const previewViews = useMemo(() => {
    return (product.views ?? []) as any; // already in products.ts
  }, [product]);

  const handleDesignTransformChange = useCallback(
    (designId: string, t: Transform) => {
      setTransformByArea((prev) => ({
        ...prev,
        [areaId]: {
          ...(prev[areaId] ?? {}),
          [designId]: t,
        },
      }));
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
    reader.onload = () => {
      const src = String(reader.result);
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      const layer: DesignLayer = {
        id,
        src,
        name: file.name,
      };

      setDesignLayersByArea((prev) => ({
        ...prev,
        [areaId]: [...(prev[areaId] ?? []), layer],
      }));

      // make the new one selected (so Transformer attaches)
      setActiveDesignId(id);
    };
    reader.readAsDataURL(file);
  }

  const STUDIO_H = "h-[calc(100vh-100px)]";

  // ---------- RIGHT PREVIEW (exact export crop) ----------
  const [exportPreviewSrc, setExportPreviewSrc] = useState<string | null>(null);

  const buildPrintDataUrl = useCallback(
    (pixelRatio: number) => {
      const stage = stageRef.current;
      if (!stage || !area) return null;

      const pa = area.printArea as {
        x: number;
        y: number;
        w: number;
        h: number;
      };
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
    if (!hasAnyDesign) {
      setExportPreviewSrc(null);
      return;
    }
    const url = buildPrintDataUrl(2);
    setExportPreviewSrc(url);
  }, [buildPrintDataUrl, hasAnyDesign]);

  // keep preview in sync with edits
  useEffect(() => {
    refreshPreview();
  }, [
    refreshPreview,
    productId,
    areaId,
    color,
    snapSignal,
    resetSignal,
    showPrintArea,
    activeDesignId,
    layers,
    transformsForArea,
  ]);

  async function exportPrintPNG() {
    const dataUrl = buildPrintDataUrl(3); // best quality export
    if (!dataUrl) return;

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, `mova-${productId}-${areaId}-${color}-print.png`);
  }

  function exportJSON() {
    const areaLayers = designLayersByArea[areaId] ?? [];
    if (!areaLayers.length) return;

    downloadJSON(
      {
        product: productId,
        area: areaId,
        color,
        stage: stageSize,
        layers: areaLayers,
        transforms: transformByArea[areaId] ?? {},
        createdAt: new Date().toISOString(),
      },
      `mova-${productId}-${areaId}-${color}-meta.json`
    );
  }

  // When switching to Preview, try to match the preview view with the current area
  useEffect(() => {
    if (tab !== "preview") return;

    // If your product.views ids match your area ids (front/back), this keeps it aligned
    const want = areaId;
    const has = (product.views ?? []).some((v: any) => v.id === want);
    if (has) setPreviewViewId(want);

    // force Konva re-render so it doesn't stay blank until a transform happens
    setPreviewRenderTick((t) => t + 1);
  }, [tab, areaId, product]);

  // Also refresh preview tick when color/design/transform changes while in preview
  useEffect(() => {
    if (tab !== "preview") return;
    setPreviewRenderTick((t) => t + 1);
  }, [tab, color, layers, transformsForArea]);

  const buildMockupPreviewDataUrl = useCallback((pixelRatio: number) => {
    const stage = previewStageRef.current;
    if (!stage) return null;

    // full mockup export
    return stage.toDataURL({
      pixelRatio,
      mimeType: "image/png",
      quality: 1,
    });
  }, []);

  function applyToAllAreas() {
    const srcLayers = designLayersByArea[areaId] ?? [];
    if (!srcLayers.length) return;

    setDesignLayersByArea((prev) => ({
      ...prev,
      front: srcLayers,
      back: srcLayers,
    }));

    // also copy transforms so it looks identical
    const srcTransforms = transformByArea[areaId] ?? {};
    setTransformByArea((prev) => ({
      ...prev,
      front: srcTransforms,
      back: srcTransforms,
    }));
  }

  const [previewRenderTick, setPreviewRenderTick] = useState(0);

  useEffect(() => {
    if (!hasAnyDesign) {
      setExportPreviewSrc(null);
      return;
    }
    const url = buildMockupPreviewDataUrl(2);
    setExportPreviewSrc(url);
  }, [previewRenderTick, buildMockupPreviewDataUrl, hasAnyDesign]);

  return (
    <div className={`min-h-[calc(107vh-64px)] ${pageBg}`}>
      <div className="mx-auto max-w-[120rem] px-4 py-6">
        {/* Unified workspace frame */}
        <div
          className={`overflow-hidden rounded-3xl border ${frameBg} shadow-sm`}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-2 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <Link href="/creative">
                <button className="h-10 rounded-xl cursor-pointer border ${divider} ${panelBg} ${hoverBg} px-3 text-sm hover:bg-black/[0.03]">
                  <MoveLeft />
                </button>
              </Link>

              <div className="flex flex-row items-end gap-2 leading-tight">
                <img
                  src="/assets/mova-minilogo.webp"
                  alt="studio mini logo"
                  className="w-36 ml-5"
                />
                <span
                  className=" uppercase"
                  style={{ fontFamily: "Haas Grot Disp" }}
                >
                  {" "}
                  Studio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Workspace theme toggle */}
              <div
                className={`flex items-center gap-1 rounded-xl border border-gray-300 p-1`}
              >
                <button
                  onClick={() => setTab("customize")}
                  className={[
                    "h-9 rounded-lg px-3 text-base font-druk transition cursor-pointer",
                    tab === "customize"
                      ? "bg-black text-white"
                      : isDark
                      ? "text-white/70 hover:bg-white/[0.06]"
                      : "text-neutral-700 hover:bg-black/[0.04]",
                  ].join(" ")}
                >
                  Customize
                </button>

                <button
                  onClick={() => setTab("preview")}
                  disabled={!hasAnyDesign}
                  className={[
                    "h-9 rounded-lg px-3 text-base font-druk transition cursor-pointer disabled:opacity-40",
                    tab === "preview"
                      ? "bg-black text-white"
                      : isDark
                      ? "text-white/70 hover:bg-white/[0.06]"
                      : "text-neutral-700 hover:bg-black/[0.04]",
                  ].join(" ")}
                >
                  Preview
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-xl border ${divider} ${panelBg} ${hoverBg} p-1">
                <button
                  onClick={() => setWorkspaceTheme("light")}
                  className={[
                    "h-9 rounded-lg px-3 cursor-pointer text-sm transition hover:bg-black/85",
                    workspaceTheme === "light"
                      ? "bg-black text-white"
                      : "hover:bg-black/[0.04] text-white-700",
                  ].join(" ")}
                >
                  Light
                </button>
                <button
                  onClick={() => setWorkspaceTheme("dark")}
                  className={[
                    "h-9 rounded-lg px-3 cursor-pointer text-sm transition",
                    workspaceTheme === "dark"
                      ? "bg-black text-white"
                      : "hover:bg-black/[0.04] text-neutral-700",
                  ].join(" ")}
                >
                  Dark
                </button>
              </div>

              <button className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white disabled:opacity-40">
                Checkout
              </button>
            </div>
          </div>

          {/* 3-panel body with ONLY dividers */}
          <div
            className={[
              "border-t",
              divider,
              STUDIO_H,
              tab === "customize"
                ? "grid grid-cols-1 lg:grid-cols-[320px_1fr]"
                : "grid grid-cols-1 lg:grid-cols-[1fr_360px]",
            ].join(" ")}
          >
            {/* LEFT PANEL */}
            {tab === "customize" && (
              <aside
                className={`h-full border-r ${sidebar.line} ${sidebar.surface}`}
              >
                <div className={`h-full flex flex-col`}>
                  {/* Upload */}
                  <div className="p-4">
                    <div
                      className={`text-sm font-druk ${sidebar.sectionTitle}`}
                    >
                      Upload
                    </div>

                    <label
                      className={`mt-3 grid h-11 cursor-pointer place-items-center rounded-xl border text-sm font-semibold ${sidebar.btnIdle}`}
                    >
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

                    <div className="mt-3 flex flex-wrap gap-2 w-full justify-center">
                      <button
                        onClick={applyToAllAreas}
                        disabled={!hasAnyDesign}
                        className={`h-10 rounded-xl border px-3 cursor-pointer text-sm disabled:opacity-40 ${sidebar.btnIdle}`}
                      >
                        Apply to all
                      </button>

                      <button
                        onClick={() => {
                          if (!activeDesignId) return;

                          setDesignLayersByArea((prev) => {
                            const next = (prev[areaId] ?? []).filter(
                              (l) => l.id !== activeDesignId
                            );
                            return { ...prev, [areaId]: next };
                          });

                          setTransformByArea((prev) => {
                            const copy = { ...(prev[areaId] ?? {}) };
                            delete copy[activeDesignId];
                            return { ...prev, [areaId]: copy };
                          });

                          // pick another active layer if exists
                          const nextActive =
                            layers.filter((l) => l.id !== activeDesignId)[0]
                              ?.id ?? null;
                          setActiveDesignId(nextActive);
                        }}
                        disabled={!activeDesignId}
                        className={`h-10 rounded-xl border px-3 text-sm disabled:opacity-40 bg-red-500/50 hover:bg-red-600/50 cursor-pointer`}
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
                      <div
                        className={`text-sm font-druk ${sidebar.sectionTitle}`}
                      >
                        Product
                      </div>

                      <div className="space-y-3">
                        <div
                          className={`rounded-2xl border px-3 py-3 ${sidebar.btnIdle}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-12 w-12 overflow-hidden rounded-xl border ${sidebar.thumbIdle}`}
                            >
                              <img
                                src={product.thumbnail}
                                alt={product.label}
                                className="h-full w-full object-cover"
                                draggable={false}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="text-sm font-semibold leading-tight">
                                {product.label}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {(product as any).areas?.length ?? 0} areas
                              </div>
                            </div>
                          </div>

                          {/* optional: "change product" link */}
                          <a
                            href="/studio"
                            className="mt-3 inline-flex text-xs underline text-neutral-500 hover:text-neutral-900"
                          >
                            Change product
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Parts */}
                    <div className="space-y-3">
                      <div
                        className={`text-sm font-druk ${sidebar.sectionTitle}`}
                      >
                        Part
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {uiAreas.map((a: any) => {
                          const active = a.id === areaId;
                          return (
                            <button
                              key={a.id}
                              onClick={() => setAreaId(a.id)}
                              className={[
                                "h-10 rounded-xl cursor-pointer border text-sm transition",
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
                      <div
                        className={`text-sm font-druk ${sidebar.sectionTitle}`}
                      >
                        Product color
                      </div>

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
                                "h-10 rounded-xl cursor-pointer border text-sm transition flex items-center justify-center gap-2",
                                active ? sidebar.btnActive : sidebar.btnIdle,
                              ].join(" ")}
                            >
                              <span
                                className={`h-4 w-4 rounded-full border ${dotClass}`}
                              />
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="space-y-3">
                      <div
                        className={`text-sm font-druk ${sidebar.sectionTitle}`}
                      >
                        Tools
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowPrintArea((v) => !v)}
                          className={`h-10 rounded-xl border text-sm ${sidebar.btnIdle}`}
                        >
                          {showPrintArea ? "Hide area" : "Show area"}
                        </button>

                        <button
                          onClick={() => setSnapSignal((v) => v + 1)}
                          disabled={!hasAnyDesign}
                          className={`h-10 rounded-xl border cursor-pointer text-sm disabled:opacity-40 ${sidebar.btnIdle}`}
                        >
                          Center
                        </button>

                        <button
                          onClick={() => setResetSignal((v) => v + 1)}
                          disabled={!hasAnyDesign}
                          className={`h-10 rounded-xl cursor-pointer bg-gray-700 border text-sm disabled:opacity-40 col-span-2 ${sidebar.btnIdle}`}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* MIDDLE PANEL */}
            {tab === "customize" ? (
              <main
                className={`relative h-full overflow-hidden ${
                  isDark ? "bg-neutral-950" : "bg-neutral-50"
                }`}
              >
                {/* top row */}
                <div className="mx-auto max-w-3xl pt-5 px-4"></div>

                {/* VIEWPORT AREA */}
                <div
                  ref={viewportRef}
                  onWheel={tab === "customize" ? onViewportWheel : undefined}
                  className="h-[calc(100%-140px)] px-4 pb-4 overflow-hidden"
                >
                  {tab === "customize" ? (
                    // ✅ Customize keeps the fixed stage + zoom scaling
                    <div className="h-full w-full flex items-center justify-center">
                      <div
                        style={{
                          width: stageSize.w,
                          height: stageSize.h,
                          transform: `scale(${displayScale})`,
                          transformOrigin: "center center",
                        }}
                        className="will-change-transform"
                      >
                        <div
                          className={`rounded-2xl border ${divider} ${panelBg} overflow-hidden`}
                        >
                          <div className="p-3">
                            <ProductStage
                              product={product}
                              mockupSrc={mockupSrc}
                              printArea={
                                area?.printArea?.[color] ?? area?.printArea
                              }
                              designLayers={layers}
                              activeDesignId={activeDesignId}
                              onSelectDesign={setActiveDesignId}
                              transformByDesignId={transformsForArea}
                              color={color}
                              stageSize={stageSize}
                              showPrintArea={showPrintArea}
                              snapToCenterSignal={snapSignal}
                              resetSignal={resetSignal}
                              onStageRef={(s) => (stageRef.current = s)}
                              onDesignTransformChange={
                                handleDesignTransformChange
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // ✅ Preview takes full available space (no fixed 900x1125 wrapper!)
                    <div className="h-full w-full">
                      <PreviewTab
                        views={previewViews}
                        color={color}
                        designLayersByArea={designLayersByArea}
                        transformByArea={transformByArea}
                        stageSize={stageSize}
                        sourcePrintAreaBySide={{
                          front:
                            (product as any).areas.find(
                              (a: any) => a.id === "front"
                            )?.printArea?.[color] ??
                            (product as any).areas.find(
                              (a: any) => a.id === "front"
                            )?.printArea,
                          back:
                            (product as any).areas.find(
                              (a: any) => a.id === "back"
                            )?.printArea?.[color] ??
                            (product as any).areas.find(
                              (a: any) => a.id === "back"
                            )?.printArea,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* bottom toolbar */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fitToView}
                      className={`h-10 rounded-xl border px-4 text-sm ${sidebar.btnIdle}`}
                    >
                      Fit
                    </button>
                    <button
                      onClick={() => {
                        if (!activeDesignId) return;

                        setDesignLayersByArea((prev) => {
                          const next = (prev[areaId] ?? []).filter(
                            (l) => l.id !== activeDesignId
                          );
                          return { ...prev, [areaId]: next };
                        });

                        setTransformByArea((prev) => {
                          const copy = { ...(prev[areaId] ?? {}) };
                          delete copy[activeDesignId];
                          return { ...prev, [areaId]: copy };
                        });

                        // pick another active layer if exists
                        const nextActive =
                          layers.filter((l) => l.id !== activeDesignId)[0]
                            ?.id ?? null;
                        setActiveDesignId(nextActive);
                      }}
                      disabled={!activeDesignId}
                      className={`h-10 rounded-xl border px-3 text-sm disabled:opacity-40 bg-red-700 hover:bg-red-800 text-white border-gray-400 cursor-pointer`}
                    >
                      Remove Design
                    </button>

                    {tab === "customize" && (
                      <div className={subtle}>
                        Zoom {(zoom * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              </main>
            ) : (
              <>
                <main
                  className={`${
                    isDark ? "bg-neutral-950" : "bg-neutral-50"
                  } h-full overflow-hidden`}
                >
                  <div className="h-full p-6">
                    <div className="h-full rounded-3xl border border-black/10 bg-white overflow-hidden">
                      <div className="h-full p-4">
                        <PreviewTab
                          views={previewViews}
                          color={color}
                          designLayersByArea={designLayersByArea}
                          transformByArea={transformByArea}
                          stageSize={stageSize}
                          sourcePrintAreaBySide={{
                            front:
                              (product as any).areas.find(
                                (a: any) => a.id === "front"
                              )?.printArea?.[color] ??
                              (product as any).areas.find(
                                (a: any) => a.id === "front"
                              )?.printArea,
                            back:
                              (product as any).areas.find(
                                (a: any) => a.id === "back"
                              )?.printArea?.[color] ??
                              (product as any).areas.find(
                                (a: any) => a.id === "back"
                              )?.printArea,
                          }}
                          // 👇 NEW: drive selection from StudioShell sidebar
                          activeViewId={previewViewId}
                          onChangeViewId={setPreviewViewId}
                        />
                      </div>
                    </div>
                  </div>
                </main>

                <aside className="h-full border-l border-black/10 bg-white">
                  <PreviewRightSidebar
                    views={previewViews}
                    color={color}
                    setColor={setColor}
                    activeViewId={previewViewId}
                    setActiveViewId={setPreviewViewId}
                    isDark={isDark}
                  />
                </aside>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRightSidebar({
  views,
  color,
  setColor,
  activeViewId,
  setActiveViewId,
  isDark,
}: {
  views: any[];
  color: ProductColor;
  setColor: (c: ProductColor) => void;
  activeViewId: string;
  setActiveViewId: (id: string) => void;
  isDark: boolean;
}) {
  const COLORS: { id: ProductColor; label: string }[] = [
    { id: "white", label: "White" },
    { id: "black", label: "Black" },
  ];

  return (
    <div className="h-full p-5 flex flex-col gap-6">
      <div>
        <div className="text-2xl font-druk">Mockup view</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {views.map((v: any) => {
            const src =
              typeof v.mockup === "function" ? v.mockup(color) : v.mockup;
            const active = v.id === activeViewId;

            return (
              <button
                key={v.id}
                onClick={() => setActiveViewId(v.id)}
                className={[
                  "rounded-xl border p-2 text-left transition cursor-pointer",
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-gray-100/50 hover:border-black/25",
                ].join(" ")}
                title={v.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-28 w-full rounded-lg object-cover border border-black/10"
                  draggable={false}
                />
                <div className="mt-1 text-xl font-medium leading-none">
                  {v.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-black/10 pt-5">
        {/* <div className="text-base font-semibold">Mockup color</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {COLORS.map((c) => {
            const active = c.id === color;

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
                  "h-11 rounded-xl border text-sm transition flex items-center justify-center gap-2",
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white hover:border-black/25",
                ].join(" ")}
              >
                <span className={`h-4 w-4 rounded-full border ${dotClass}`} />
                {c.label}
              </button>
            );
          })}
        </div> */}

        <div className="text-lg text-neutral-500 mt-10 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          The actual products are much better quality than these mockups. this
          is just previews for reference.
        </div>
      </div>

      <div className="mt-auto text-xs text-neutral-500">
        Preview is non-editable (export-like)
      </div>
    </div>
  );
}
