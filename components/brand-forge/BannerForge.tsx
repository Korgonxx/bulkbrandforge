"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
  Download,
  Upload,
  Trash2,
  Layers,
  Type,
  Image as ImageIcon,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Palette,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  Group,
  Ungroup,
} from "lucide-react";
import { SketchPicker } from "react-color";

export function BannerForge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [bgColor, setBgColor] = useState<string>("#04070d");

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isHistoryActionRef = useRef<boolean>(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const saveHistory = useCallback(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas || isHistoryActionRef.current) return;
    const json = JSON.stringify(currentCanvas.toJSON());
    
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
    
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const undo = useCallback(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas || historyIndexRef.current <= 0) return;
    isHistoryActionRef.current = true;
    historyIndexRef.current -= 1;
    currentCanvas.loadFromJSON(historyRef.current[historyIndexRef.current]).then(() => {
      currentCanvas.requestRenderAll();
      isHistoryActionRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  const redo = useCallback(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas || historyIndexRef.current >= historyRef.current.length - 1) return;
    isHistoryActionRef.current = true;
    historyIndexRef.current += 1;
    currentCanvas.loadFromJSON(historyRef.current[historyIndexRef.current]).then(() => {
      currentCanvas.requestRenderAll();
      isHistoryActionRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 400,
      backgroundColor: "#04070d",
    });
    
    fabricCanvasRef.current = initCanvas;

    // Add a default text
    const text = new fabric.IText("BULK TRADE", {
      left: 400,
      top: 200,
      fontFamily: "Plus Jakarta Sans",
      fill: "#FFFFFF",
      fontSize: 60,
      originX: "center",
      originY: "center",
      shadow: new fabric.Shadow({
        color: "#0099ff",
        blur: 20,
        offsetX: 0,
        offsetY: 0,
      }),
    });

    initCanvas.add(text);
    initCanvas.setActiveObject(text);

    initCanvas.on("selection:created", (e) =>
      setActiveObject(e.selected?.[0] || null),
    );
    initCanvas.on("selection:updated", (e) =>
      setActiveObject(e.selected?.[0] || null),
    );
    initCanvas.on("selection:cleared", () => setActiveObject(null));

    // History events
    initCanvas.on("object:modified", saveHistory);
    initCanvas.on("object:added", saveHistory);
    initCanvas.on("object:removed", saveHistory);

    setCanvas(initCanvas);

    // Initial save
    setTimeout(() => {
      if (initCanvas) {
        historyRef.current = [JSON.stringify(initCanvas.toJSON())];
        historyIndexRef.current = 0;
      }
    }, 100);

    return () => {
      initCanvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const applyTextEffect = (effect: string) => {
    if (!canvas || !activeObject || activeObject.type !== "i-text") return;
    const textObj = activeObject as fabric.IText;
    
    const currentFill = textObj.fill === "transparent" ? "#FFFFFF" : textObj.fill;
    
    textObj.set({
      shadow: null,
      stroke: null,
      strokeWidth: 0,
      fill: currentFill,
    });

    switch (effect) {
      case "None":
        break;
      case "3D":
        textObj.set("shadow", new fabric.Shadow({ color: "#0099ff", blur: 0, offsetX: 4, offsetY: 4 }));
        break;
      case "Neon":
        textObj.set("shadow", new fabric.Shadow({ color: "#0099ff", blur: 20, offsetX: 0, offsetY: 0 }));
        break;
      case "Outline":
        textObj.set({ fill: "transparent", stroke: "#FFFFFF", strokeWidth: 2 });
        break;
      case "Drop Shadow":
        textObj.set("shadow", new fabric.Shadow({ color: "rgba(0,0,0,0.8)", blur: 10, offsetX: 5, offsetY: 5 }));
        break;
      case "Glitch":
        textObj.set("shadow", new fabric.Shadow({ color: "#00ffff", blur: 0, offsetX: -3, offsetY: 0 }));
        break;
      case "Vintage":
        textObj.set({ fill: "#d5dbe6", shadow: new fabric.Shadow({ color: "#2a2a2a", blur: 0, offsetX: 6, offsetY: 6 }) });
        break;
    }
    canvas.requestRenderAll();
    saveHistory();
  };

  const changeFontFamily = (fontFamily: string) => {
    if (!canvas || !activeObject || activeObject.type !== "i-text") return;
    activeObject.set("fontFamily", fontFamily);
    canvas.requestRenderAll();
    saveHistory();
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    if (canvas) {
      canvas.set("backgroundColor", color);
      canvas.requestRenderAll();
      saveHistory();
    }
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText("NEW TEXT", {
      left: 400,
      top: 200,
      fontFamily: "Plus Jakarta Sans",
      fill: "#FFFFFF",
      fontSize: 40,
      originX: "center",
      originY: "center",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      if (typeof data !== "string") return;
      fabric.Image.fromURL(data).then((img) => {
        img.scaleToWidth(200);
        img.set({
          left: 400,
          top: 200,
          originX: "center",
          originY: "center",
        });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const addSticker = () => {
    if (!canvas) return;
    const randomSeed = Math.floor(Math.random() * 1000);
    const url = `https://api.dicebear.com/7.x/bottts/svg?seed=sticker${randomSeed}&backgroundColor=transparent`;
    
    fabric.Image.fromURL(url).then((img) => {
      img.scaleToWidth(100);
      img.set({
        left: 400,
        top: 200,
        originX: "center",
        originY: "center",
      });
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };

  const deleteSelected = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
  };

  const applyGlow = (color: string) => {
    if (!canvas || !activeObject) return;
    activeObject.set(
      "shadow",
      new fabric.Shadow({
        color: color,
        blur: 20,
        offsetX: 0,
        offsetY: 0,
      }),
    );
    canvas.requestRenderAll();
    saveHistory();
  };

  const changeTextColor = (color: string) => {
    if (!canvas || !activeObject || activeObject.type !== "i-text") return;
    activeObject.set("fill", color);
    canvas.requestRenderAll();
    saveHistory();
  };

  const toggleLock = () => {
    if (!canvas || !activeObject) return;
    const isLocked = activeObject.lockMovementX;
    activeObject.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      hasControls: isLocked,
    });
    canvas.requestRenderAll();
    saveHistory();
  };

  const groupSelected = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "activeSelection") return;
    
    const activeSelection = activeObj as fabric.ActiveSelection;
    const group = new fabric.Group(activeSelection.getObjects());
    canvas.remove(...activeSelection.getObjects());
    canvas.discardActiveObject();
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    saveHistory();
  };

  const ungroupSelected = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "group") return;
    
    const group = activeObj as fabric.Group;
    const items = group.getObjects();
    canvas.remove(group);
    canvas.add(...items);
    const selection = new fabric.ActiveSelection(items, { canvas });
    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
    saveHistory();
  };

  const bringForward = () => {
    if (!canvas || !activeObject) return;
    canvas.bringObjectForward(activeObject);
    canvas.requestRenderAll();
    saveHistory();
  };

  const sendBackward = () => {
    if (!canvas || !activeObject) return;
    canvas.sendObjectBackwards(activeObject);
    canvas.requestRenderAll();
    saveHistory();
  };

  const downloadBanner = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // High res
    });
    const link = document.createElement("a");
    link.download = "bulk-banner.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-72 flex flex-col gap-6">
        <div className="border border-border bg-background p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-xl uppercase tracking-tighter">
              TOOLS
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              Add elements
            </p>
          </div>

          <div className="space-y-3">
            <button
              className="w-full py-3 px-4 bg-muted border border-border hover:border-primary hover:text-primary transition-colors flex items-center text-xs font-mono uppercase tracking-widest"
              onClick={addText}
            >
              <Type className="mr-3 h-4 w-4" /> Add Text
            </button>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              <button className="w-full py-3 px-4 bg-muted border border-border hover:border-[#d5dbe6] hover:text-secondary transition-colors flex items-center text-xs font-mono uppercase tracking-widest">
                <Upload className="mr-3 h-4 w-4" /> Upload Image
              </button>
            </div>

            <button 
              className="w-full py-3 px-4 bg-muted border border-border hover:border-primary hover:text-primary transition-colors flex items-center text-xs font-mono uppercase tracking-widest"
              onClick={addSticker}
            >
              <Layers className="mr-3 h-4 w-4" /> Add Sticker
            </button>
          </div>
        </div>

        <div className="border border-border bg-background p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-xl uppercase tracking-tighter">
              PROPERTIES
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              Edit selected
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center"><Palette className="w-3 h-3 mr-1" /> CANVAS BG</span>
                <button 
                  onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                  className="text-primary hover:text-primary/80"
                >
                  Custom
                </button>
              </label>
              {showBgColorPicker && (
                <div className="absolute z-50 mt-2">
                  <div className="fixed inset-0" onClick={() => setShowBgColorPicker(false)} />
                  <div className="relative">
                    <SketchPicker color={bgColor} onChange={(color) => handleBgColorChange(color.hex)} />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {["#04070d", "#1b1a14", "#2a2a2a", "#0099ff", "#d5dbe6", "#ffffff"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-none border transition-all ${bgColor === color ? 'border-white scale-110' : 'border-transparent hover:border-gray-500'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleBgColorChange(color)}
                  />
                ))}
              </div>
            </div>

            {activeObject && activeObject.type === "i-text" && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    FONT FAMILY
                  </label>
                  <select 
                    className="w-full bg-muted border border-border text-foreground text-xs p-2 font-mono outline-none focus:border-primary"
                    onChange={(e) => changeFontFamily(e.target.value)}
                    value={(activeObject as fabric.IText).fontFamily || "Plus Jakarta Sans"}
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="IBM Plex Mono">IBM Plex Mono</option>
                    <option value="Anton">Anton</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="Outfit">Outfit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    TEXT EFFECTS
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["None", "3D", "Neon", "Outline", "Drop Shadow", "Glitch", "Vintage"].map((effect) => (
                      <button
                        key={effect}
                        className="py-2 px-2 bg-muted border border-border hover:border-white transition-colors text-[10px] font-mono uppercase tracking-widest"
                        onClick={() => applyTextEffect(effect)}
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest flex items-center justify-between">
                    <span>TEXT COLOR</span>
                    <button 
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="text-primary hover:text-primary/80"
                    >
                      Custom
                    </button>
                  </label>
                  {showColorPicker && (
                    <div className="absolute z-50 mt-2">
                      <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                      <div className="relative">
                        <SketchPicker 
                          color={(activeObject as fabric.IText).fill as string || "#ffffff"} 
                          onChange={(color) => changeTextColor(color.hex)} 
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {["#ffffff", "#0099ff", "#d5dbe6", "#04070d"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-none border border-transparent hover:border-white transition-all shadow-sm"
                        style={{ backgroundColor: color }}
                        onClick={() => changeTextColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                NEON GLOW
              </label>
              <div className="flex gap-3">
                <button
                  className="w-10 h-10 rounded-none bg-primary border border-transparent hover:border-white transition-all shadow-[0_0_15px_rgba(0,153,255,0.5)]"
                  onClick={() => applyGlow("#0099ff")}
                />
                <button
                  className="w-10 h-10 rounded-none bg-secondary border border-transparent hover:border-white transition-all shadow-[0_0_15px_rgba(213,219,230,0.5)]"
                  onClick={() => applyGlow("#d5dbe6")}
                />
                <button
                  className="w-10 h-10 rounded-none bg-foreground border border-transparent hover:border-gray-400 transition-all shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  onClick={() => applyGlow("#FFFFFF")}
                />
                <button
                  className="w-10 h-10 rounded-none bg-transparent border border-border hover:border-white transition-all flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (activeObject) {
                      activeObject.set("shadow", null);
                      canvas?.requestRenderAll();
                      saveHistory();
                    }
                  }}
                >
                  Ø
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={bringForward}
                title="Bring Forward"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={sendBackward}
                title="Send Backward"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={toggleLock}
                title={activeObject?.lockMovementX ? "Unlock" : "Lock"}
              >
                {activeObject?.lockMovementX ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject || activeObject.type !== "activeSelection"}
                onClick={groupSelected}
                title="Group Selected"
              >
                <Group className="mr-1 h-3 w-3" /> Group
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject || activeObject.type !== "group"}
                onClick={ungroupSelected}
                title="Ungroup Selected"
              >
                <Ungroup className="mr-1 h-3 w-3" /> Ungroup
              </button>
            </div>

            <button
              className="w-full py-3 px-4 bg-transparent border border-border text-foreground hover:border-[#d5dbe6] hover:text-secondary transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!activeObject || activeObject.type !== "image"}
              onClick={() => {
                if (!canvas) return;
                const obj = canvas.getActiveObject();
                if (!obj || obj.type !== "image") return;
                const img = obj as fabric.Image;
                // Simple grayscale/contrast filter to simulate dither for now
                img.filters = [
                  new fabric.filters.Grayscale(),
                  new fabric.filters.Contrast({ contrast: 0.5 }),
                ];
                img.applyFilters();
                canvas.requestRenderAll();
                saveHistory();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Apply Dither (B&W)
            </button>

            <button
              className="w-full py-3 px-4 bg-transparent border border-[#FF4444] text-[#FF4444] hover:bg-[#FF4444] hover:text-foreground transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!activeObject}
              onClick={deleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col items-center gap-6">
        <div className="w-full max-w-[800px] border border-border bg-background p-2 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="aspect-[2/1] relative flex items-center justify-center bg-muted overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="flex w-full max-w-[800px] justify-between items-center">
          <div className="flex gap-2">
            <button
              className="p-3 bg-muted border border-border hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-5 w-5" />
            </button>
            <button
              className="p-3 bg-muted border border-border hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-5 w-5" />
            </button>
          </div>
          <button
            className="px-8 py-4 bg-secondary text-background font-bold uppercase tracking-widest text-sm hover:bg-[#ffffff] transition-colors shadow-[0_0_20px_rgba(213,219,230,0.3)] flex items-center"
            onClick={downloadBanner}
          >
            <Download className="mr-3 h-5 w-5" /> Download Banner
          </button>
        </div>
      </div>
    </div>
  );
}
