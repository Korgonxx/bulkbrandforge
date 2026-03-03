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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  ChevronDown,
  X,
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
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#0046FF");
  const [gradientColor2, setGradientColor2] = useState("#04070d");
  const [showStickers, setShowStickers] = useState(false);
  const [stickerList, setStickerList] = useState<string[]>([]);
  const [backgroundList, setBackgroundList] = useState<string[]>([]);
  const [threeDList, setThreeDList] = useState<string[]>([]);

  // fetch available assets from server
  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json())
      .then((data) => {
        setStickerList(data.stickers || []);
        setBackgroundList(data.backgrounds || []);
        setThreeDList(data['3d-assets'] || []);
      })
      .catch((err) => console.error('failed to load assets', err));
  }, []);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [show3DAssets, setShow3DAssets] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [grainIntensity, setGrainIntensity] = useState<number>(0);
  const [bgBlurIntensity, setBgBlurIntensity] = useState<number>(0);
  const [imageBlurIntensity, setImageBlurIntensity] = useState<number>(0);

  const STANDARD_FONTS = [
    "Plus Jakarta Sans", "IBM Plex Mono", "Anton", "Space Grotesk", 
    "Outfit", "Inter", "Roboto", "Playfair Display", 
    "Cormorant Garamond", "Libre Baskerville",
    "Bebas Neue", "Oswald", "Righteous", "Cinzel", "Lobster",
    "Pacifico", "Dancing Script", "Caveat", "Permanent Marker",
    "Fredoka", "Bangers", "Press Start 2P", "Creepster",
    "Russo One", "Orbitron", "Syncopate", "Monoton",
    "Audiowide", "Silkscreen", "Chakra Petch", "Syne"
  ];

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
      fill: "#ffffff",
      fontSize: 60,
      originX: "center",
      originY: "center",
      shadow: new fabric.Shadow({
        color: "#0046FF",
        blur: 20,
        offsetX: 0,
        offsetY: 0,
      }),
    });

    initCanvas.add(text);
    initCanvas.setActiveObject(text);

    initCanvas.on("selection:created", (e) => {
      const obj = e.selected?.[0] || null;
      setActiveObject(obj);
      if (obj && obj.type === 'image') {
        const img = obj as fabric.Image;
        const blurFilter = img.filters?.find(f => f.type === 'Blur') as any;
        setImageBlurIntensity(blurFilter ? blurFilter.blur : 0);
      } else {
        setImageBlurIntensity(0);
      }
    });
    initCanvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0] || null;
      setActiveObject(obj);
      if (obj && obj.type === 'image') {
        const img = obj as fabric.Image;
        const blurFilter = img.filters?.find(f => f.type === 'Blur') as any;
        setImageBlurIntensity(blurFilter ? blurFilter.blur : 0);
      } else {
        setImageBlurIntensity(0);
      }
    });
    initCanvas.on("selection:cleared", () => {
      setActiveObject(null);
      setImageBlurIntensity(0);
    });

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
    
    const currentFill = textObj.fill === "transparent" ? "#ffffff" : textObj.fill;
    
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
        textObj.set("shadow", new fabric.Shadow({ color: "#0046FF", blur: 0, offsetX: 4, offsetY: 4 }));
        break;
      case "Neon":
        textObj.set("shadow", new fabric.Shadow({ color: "#0046FF", blur: 20, offsetX: 0, offsetY: 0 }));
        break;
      case "Outline":
        textObj.set({ fill: "transparent", stroke: "#ffffff", strokeWidth: 2 });
        break;
      case "Drop Shadow":
        textObj.set("shadow", new fabric.Shadow({ color: "rgba(0,0,0,0.8)", blur: 10, offsetX: 5, offsetY: 5 }));
        break;
      case "Glitch":
        textObj.set("shadow", new fabric.Shadow({ color: "#0066ff", blur: 0, offsetX: -3, offsetY: 0 }));
        break;
      case "Vintage":
        textObj.set({ fill: "#0066ff", shadow: new fabric.Shadow({ color: "#2a2a2a", blur: 0, offsetX: 6, offsetY: 6 }) });
        break;
      case "Pop Art":
        textObj.set({ stroke: "#000000", strokeWidth: 2, shadow: new fabric.Shadow({ color: "#000000", blur: 0, offsetX: 5, offsetY: 5 }) });
        break;
      case "Floating":
        textObj.set("shadow", new fabric.Shadow({ color: "rgba(0,0,0,0.6)", blur: 20, offsetX: 0, offsetY: 15 }));
        break;
      case "Glow":
        textObj.set("shadow", new fabric.Shadow({ color: "#ffffff", blur: 15, offsetX: 0, offsetY: 0 }));
        break;
      case "Cyberpunk":
        textObj.set({ stroke: "#0046FF", strokeWidth: 1, shadow: new fabric.Shadow({ color: "#0066ff", blur: 2, offsetX: 3, offsetY: 3 }) });
        break;
      case "Double":
        textObj.set({ fill: "transparent", stroke: currentFill, strokeWidth: 1, shadow: new fabric.Shadow({ color: currentFill as string, blur: 0, offsetX: 4, offsetY: 4 }) });
        break;
      case "Soft":
        textObj.set("shadow", new fabric.Shadow({ color: currentFill as string, blur: 25, offsetX: 0, offsetY: 0 }));
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

  const handleBgColorChange = (color: string, skipHistory = false) => {
    setBgColor(color);
    if (canvas) {
      canvas.set("backgroundColor", color);
      canvas.requestRenderAll();
      if (!skipHistory) saveHistory();
    }
  };

  const applyGradientBg = (color1: string, color2: string, skipHistory = false) => {
    if (!canvas) return;
    const gradient = new fabric.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: canvas.width!, y2: canvas.height! },
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 }
      ]
    });
    canvas.set("backgroundColor", gradient);
    canvas.requestRenderAll();
    if (!skipHistory) saveHistory();
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const fontName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
      const fontUrl = URL.createObjectURL(file);
      const font = new FontFace(fontName, `url(${fontUrl})`);
      
      await font.load();
      document.fonts.add(font);
      
      setCustomFonts(prev => [...prev, fontName]);
      changeFontFamily(fontName);
      setShowFontDropdown(false);
    } catch (error) {
      console.error("Error loading font:", error);
      alert("Failed to load font. Please try a valid .ttf, .otf, or .woff file.");
    }
  };

  const applyGrain = (intensity: number) => {
    if (!canvas) return;
    
    if (intensity === 0) {
      canvas.set('overlayImage', null);
      canvas.requestRenderAll();
      return;
    }
    
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = canvas.width || 800;
    noiseCanvas.height = canvas.height || 400;
    const ctx = noiseCanvas.getContext('2d');
    if (!ctx) return;
    
    const imgData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.random() * 255;
      imgData.data[i] = val;
      imgData.data[i+1] = val;
      imgData.data[i+2] = val;
      imgData.data[i+3] = intensity * 255;
    }
    ctx.putImageData(imgData, 0, 0);
    
    fabric.Image.fromURL(noiseCanvas.toDataURL()).then((img) => {
      img.set({
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        evented: false,
        selectable: false
      });
      canvas.set('overlayImage', img);
      canvas.requestRenderAll();
    });
  };

  const applyBgBlur = (intensity: number) => {
    setBgBlurIntensity(intensity);
    if (!canvas || !canvas.backgroundImage) return;
    
    const bgImg = canvas.backgroundImage as fabric.Image;
    if (!bgImg.applyFilters) return;

    bgImg.filters = bgImg.filters?.filter(f => f.type !== 'Blur') || [];
    if (intensity > 0) {
      bgImg.filters.push(new fabric.filters.Blur({ blur: intensity }));
    }
    bgImg.applyFilters();
    canvas.requestRenderAll();
  };

  const applyImageBlur = (intensity: number) => {
    setImageBlurIntensity(intensity);
    if (!canvas || !activeObject || activeObject.type !== "image") return;
    
    const img = activeObject as fabric.Image;
    img.filters = img.filters?.filter(f => f.type !== 'Blur') || [];
    if (intensity > 0) {
      img.filters.push(new fabric.filters.Blur({ blur: intensity }));
    }
    img.applyFilters();
    canvas.requestRenderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText("NEW TEXT", {
      left: 400,
      top: 200,
      fontFamily: "Plus Jakarta Sans",
      fill: "#ffffff",
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

  const addStickerFromUrl = (url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url).then((img) => {
      img.scaleToWidth(150);
      img.set({
        left: 400,
        top: 200,
        originX: "center",
        originY: "center",
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      setShowStickers(false);
      setShow3DAssets(false);
      saveHistory();
    });
  };

  const setBackgroundImage = (url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url).then((img) => {
      const scale = Math.max(canvas.width! / img.width!, canvas.height! / img.height!);
      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvas.width! / 2,
        top: canvas.height! / 2,
      });
      canvas.set("backgroundImage", img);
      canvas.requestRenderAll();
      setShowBackgrounds(false);
      saveHistory();
    });
  };

  const addSticker = () => {
    if (!canvas) return;
    let url: string;
    if (stickerList.length > 0) {
      url = stickerList[Math.floor(Math.random() * stickerList.length)];
    } else {
      const randomSeed = Math.floor(Math.random() * 1000);
      url = `https://api.dicebear.com/7.x/bottts/svg?seed=sticker${randomSeed}&backgroundColor=transparent`;
    }
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

  const changeTextColor = (color: string, skipHistory = false) => {
    if (!canvas || !activeObject || activeObject.type !== "i-text") return;
    activeObject.set("fill", color);
    canvas.requestRenderAll();
    if (!skipHistory) saveHistory();
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

  const alignObject = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!canvas || !activeObject) return;
    
    const objWidth = activeObject.getScaledWidth();
    const objHeight = activeObject.getScaledHeight();
    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;

    switch (alignment) {
      case 'left':
        activeObject.set({ left: activeObject.originX === 'center' ? objWidth / 2 : 0 });
        break;
      case 'center':
        activeObject.set({ left: canvasWidth / 2 });
        break;
      case 'right':
        activeObject.set({ left: activeObject.originX === 'center' ? canvasWidth - objWidth / 2 : canvasWidth - objWidth });
        break;
      case 'top':
        activeObject.set({ top: activeObject.originY === 'center' ? objHeight / 2 : 0 });
        break;
      case 'middle':
        activeObject.set({ top: canvasHeight / 2 });
        break;
      case 'bottom':
        activeObject.set({ top: activeObject.originY === 'center' ? canvasHeight - objHeight / 2 : canvasHeight - objHeight });
        break;
    }
    
    activeObject.setCoords();
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
              <button className="w-full py-3 px-4 bg-muted border border-border hover:border-[#0066ff] hover:text-primary transition-colors flex items-center text-xs font-mono uppercase tracking-widest">
                <Upload className="mr-3 h-4 w-4" /> Upload Image
              </button>
            </div>

            <button 
              className="w-full py-3 px-4 bg-muted border border-border hover:border-primary hover:text-primary transition-colors flex items-center text-xs font-mono uppercase tracking-widest"
              onClick={() => { setShowStickers(!showStickers); setShowBackgrounds(false); setShow3DAssets(false); }}
            >
              <Layers className="mr-3 h-4 w-4" /> Add Sticker
            </button>

            <button 
              className="w-full py-3 px-4 bg-muted border border-border hover:border-secondary hover:text-secondary transition-colors flex items-center text-xs font-mono uppercase tracking-widest"
              onClick={() => { setShowBackgrounds(!showBackgrounds); setShowStickers(false); setShow3DAssets(false); }}
            >
              <ImageIcon className="mr-3 h-4 w-4" /> Add Background
            </button>

            <button 
              className="w-full py-3 px-4 bg-muted border border-border hover:border-[#0046FF] hover:text-primary transition-colors flex items-center text-xs font-mono uppercase tracking-widest"
              onClick={() => { setShow3DAssets(!show3DAssets); setShowStickers(false); setShowBackgrounds(false); }}
            >
              <Layers className="mr-3 h-4 w-4" /> Add 3D Asset
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowGradientPicker(false); }}
                    className="text-primary hover:text-primary/80"
                  >
                    Solid
                  </button>
                  <button 
                    onClick={() => { setShowGradientPicker(!showGradientPicker); setShowBgColorPicker(false); }}
                    className="text-secondary hover:text-secondary/80"
                  >
                    Gradient
                  </button>
                </div>
              </label>
              {showBgColorPicker && (
                <div className="absolute z-50 mt-2">
                  <div className="fixed inset-0" onClick={() => setShowBgColorPicker(false)} />
                  <div className="relative">
                    <SketchPicker 
                      color={bgColor} 
                      onChange={(color) => handleBgColorChange(color.hex, true)} 
                      onChangeComplete={(color) => { handleBgColorChange(color.hex, true); saveHistory(); }}
                    />
                  </div>
                </div>
              )}
              {showGradientPicker && (
                <div className="absolute z-50 mt-2 p-4 bg-background border border-border space-y-4 shadow-xl w-[280px]">
                  <div className="fixed inset-0" onClick={() => setShowGradientPicker(false)} />
                  <div className="relative space-y-4">
                    <div className="flex gap-4 justify-between">
                      <div className="flex-1">
                        <label className="text-[10px] text-muted-foreground font-mono uppercase mb-2 block">Color 1</label>
                        <div className="relative">
                          <button 
                            className="w-full h-8 border border-border" 
                            style={{ backgroundColor: gradientColor1 }}
                            onClick={() => {
                              const picker = document.getElementById('picker1');
                              if (picker) picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
                            }}
                          />
                          <div id="picker1" className="absolute top-10 left-0 z-10 hidden">
                            <SketchPicker 
                              color={gradientColor1} 
                              onChange={(color) => { setGradientColor1(color.hex); applyGradientBg(color.hex, gradientColor2, true); }} 
                              onChangeComplete={(color) => { setGradientColor1(color.hex); applyGradientBg(color.hex, gradientColor2, true); saveHistory(); }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-muted-foreground font-mono uppercase mb-2 block">Color 2</label>
                        <div className="relative">
                          <button 
                            className="w-full h-8 border border-border" 
                            style={{ backgroundColor: gradientColor2 }}
                            onClick={() => {
                              const picker = document.getElementById('picker2');
                              if (picker) picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
                            }}
                          />
                          <div id="picker2" className="absolute top-10 right-0 z-10 hidden">
                            <SketchPicker 
                              color={gradientColor2} 
                              onChange={(color) => { setGradientColor2(color.hex); applyGradientBg(gradientColor1, color.hex, true); }} 
                              onChangeComplete={(color) => { setGradientColor2(color.hex); applyGradientBg(gradientColor1, color.hex, true); saveHistory(); }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted-foreground font-mono uppercase">Presets</label>
                      <div className="grid grid-cols-5 gap-2">
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #0046FF, #04070d)" }} onClick={() => { setGradientColor1("#0046FF"); setGradientColor2("#04070d"); applyGradientBg("#0046FF", "#04070d"); }} title="Brand Blue Dark" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #0066ff, #2a2a2a)" }} onClick={() => { setGradientColor1("#0066ff"); setGradientColor2("#2a2a2a"); applyGradientBg("#0066ff", "#2a2a2a"); }} title="Blue Dark" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #0046FF, #0066ff)" }} onClick={() => { setGradientColor1("#0046FF"); setGradientColor2("#0066ff"); applyGradientBg("#0046FF", "#0066ff"); }} title="Blue Gradient" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #ffffff, #0046FF)" }} onClick={() => { setGradientColor1("#ffffff"); setGradientColor2("#0046FF"); applyGradientBg("#ffffff", "#0046FF"); }} title="White Blue" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #04070d, #1b1a14)" }} onClick={() => { setGradientColor1("#04070d"); setGradientColor2("#1b1a14"); applyGradientBg("#04070d", "#1b1a14"); }} title="Deep Dark" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #0046FF, #04070d)" }} onClick={() => { setGradientColor1("#0046FF"); setGradientColor2("#04070d"); applyGradientBg("#0046FF", "#04070d"); }} title="Blue Dark" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #0066ff, #0046FF)" }} onClick={() => { setGradientColor1("#0066ff"); setGradientColor2("#0046FF"); applyGradientBg("#0066ff", "#0046FF"); }} title="Blue Blend" />
                        <button className="w-full aspect-square rounded-none border border-transparent hover:border-white transition-all" style={{ background: "linear-gradient(to right, #ffffff, #0046FF)" }} onClick={() => { setGradientColor1("#ffffff"); setGradientColor2("#0046FF"); applyGradientBg("#ffffff", "#0046FF"); }} title="White to Blue" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {["#04070d", "#1b1a14", "#2a2a2a", "#0046FF", "#0066ff", "#ffffff"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-none border transition-all ${bgColor === color ? 'border-white scale-110' : 'border-transparent hover:border-gray-500'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleBgColorChange(color)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  BACKGROUND BLUR
                </label>
                <span className="text-[10px] font-mono text-primary">{bgBlurIntensity.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={bgBlurIntensity}
                onChange={(e) => applyBgBlur(parseFloat(e.target.value))}
                onMouseUp={saveHistory}
                onTouchEnd={saveHistory}
                className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  GRAIN EFFECT
                </label>
                <span className="text-[10px] font-mono text-primary">{grainIntensity.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="0.5" step="0.05" 
                value={grainIntensity}
                onChange={(e) => setGrainIntensity(parseFloat(e.target.value))}
                onMouseUp={(e) => { applyGrain(parseFloat(e.currentTarget.value)); saveHistory(); }}
                onTouchEnd={(e) => { applyGrain(parseFloat(e.currentTarget.value)); saveHistory(); }}
                className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {activeObject && activeObject.type === "i-text" && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2 relative">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    FONT FAMILY
                  </label>
                  <div className="relative">
                    <button
                      className="w-full bg-muted border border-border text-foreground text-xs p-2 font-mono outline-none focus:border-primary flex justify-between items-center"
                      onClick={() => setShowFontDropdown(!showFontDropdown)}
                    >
                      <span style={{ fontFamily: (activeObject as fabric.IText).fontFamily }}>
                        {(activeObject as fabric.IText).fontFamily || "Plus Jakarta Sans"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showFontDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-border shadow-xl max-h-60 overflow-y-auto">
                        {[...STANDARD_FONTS, ...customFonts].map(font => (
                          <button
                            key={font}
                            className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                            style={{ fontFamily: font }}
                            onClick={() => { changeFontFamily(font); setShowFontDropdown(false); }}
                          >
                            {font}
                          </button>
                        ))}
                        <div className="p-2 border-t border-border">
                          <label className="flex items-center justify-center w-full py-2 bg-muted border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer text-xs font-mono uppercase tracking-widest">
                            <Upload className="w-3 h-3 mr-2" /> Upload Font
                            <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    TEXT EFFECTS
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["None", "3D", "Neon", "Outline", "Drop Shadow", "Glitch", "Vintage", "Pop Art", "Floating", "Glow", "Cyberpunk", "Double", "Soft"].map((effect) => (
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
                          onChange={(color) => changeTextColor(color.hex, true)} 
                          onChangeComplete={(color) => { changeTextColor(color.hex, true); saveHistory(); }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {["#ffffff", "#0046FF", "#0066ff", "#04070d"].map((color) => (
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

            {activeObject && activeObject.type === "image" && (
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    IMAGE BLUR
                  </label>
                  <span className="text-[10px] font-mono text-primary">{imageBlurIntensity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={imageBlurIntensity}
                  onChange={(e) => applyImageBlur(parseFloat(e.target.value))}
                  onMouseUp={saveHistory}
                  onTouchEnd={saveHistory}
                  className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                NEON GLOW
              </label>
              <div className="flex gap-3">
                <button
                  className="w-10 h-10 rounded-none bg-primary border border-transparent hover:border-white transition-all shadow-[0_0_15px_rgba(0,70,255,0.5)]"
                  onClick={() => applyGlow("#0046FF")}
                />
                <button
                  className="w-10 h-10 rounded-none bg-secondary border border-transparent hover:border-white transition-all shadow-[0_0_15px_rgba(115,200,210,0.5)]"
                  onClick={() => applyGlow("#0066ff")}
                />
                <button
                  className="w-10 h-10 rounded-none bg-foreground border border-transparent hover:border-gray-400 transition-all shadow-[0_0_15px_rgba(245,241,220,0.5)]"
                  onClick={() => applyGlow("#ffffff")}
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
                onClick={() => alignObject('left')}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={() => alignObject('center')}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={() => alignObject('right')}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={() => alignObject('top')}
                title="Align Top"
              >
                <AlignVerticalSpaceAround className="h-4 w-4 rotate-90" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={() => alignObject('middle')}
                title="Align Middle"
              >
                <AlignHorizontalSpaceAround className="h-4 w-4" />
              </button>
              <button
                className="flex-1 py-2 bg-muted border border-border hover:border-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                disabled={!activeObject}
                onClick={() => alignObject('bottom')}
                title="Align Bottom"
              >
                <AlignVerticalSpaceAround className="h-4 w-4 rotate-90" />
              </button>
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
              className="w-full py-3 px-4 bg-transparent border border-border text-foreground hover:border-[#0046FF] hover:text-primary transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full py-3 px-4 bg-transparent border border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-white transition-colors flex items-center justify-center text-xs font-mono uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-8 py-4 bg-secondary text-background font-bold uppercase tracking-widest text-sm hover:bg-[#ffffff] transition-colors shadow-[0_0_20px_rgba(115,200,210,0.3)] flex items-center"
            onClick={downloadBanner}
          >
            <Download className="mr-3 h-5 w-5" /> Download Banner
          </button>
        </div>
      </div>

      {/* Asset Drawer */}
      {(showStickers || showBackgrounds || show3DAssets) && (
        <>
          {/* Subtle backdrop that doesn't black out the screen, just prevents clicks on canvas if on mobile, but on desktop we can leave it transparent or very light */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden" 
            onClick={() => { setShowStickers(false); setShowBackgrounds(false); setShow3DAssets(false); }} 
          />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <h3 className="font-bold text-lg uppercase tracking-tighter">
                  {showStickers ? "Sticker Pack" : showBackgrounds ? "Background Library" : show3DAssets ? "3D Assets" : ""}
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">
                  {showStickers ? "Add expressive elements" : showBackgrounds ? "Select a canvas background" : show3DAssets ? "Premium 3D shapes" : ""}
                </p>
              </div>
              <button 
                onClick={() => { setShowStickers(false); setShowBackgrounds(false); setShow3DAssets(false); }} 
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
              {showStickers && (
                <div className="grid grid-cols-3 gap-3">
                  {stickerList.length === 0 && <p className="col-span-full text-center text-muted-foreground">No stickers available</p>}
                  {stickerList.map((url, i) => {
                    const name = url.split('/').pop() || `sticker-${i + 1}`;
                    return (
                      <button key={i} className="group aspect-square bg-muted rounded-lg border border-border hover:border-primary p-2 flex items-center justify-center transition-all hover:shadow-md hover:-translate-y-1" onClick={() => addStickerFromUrl(url)}>
                        <img src={url} alt={name} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                      </button>
                    );
                  })}
                </div>
              )}

              {showBackgrounds && (
                <div className="grid grid-cols-2 gap-3">
                  {backgroundList.length === 0 && <p className="col-span-full text-center text-muted-foreground">No backgrounds available</p>}
                  {backgroundList.map((url, i) => {
                    const name = url.split('/').pop() || `background-${i + 1}`;
                    return (
                      <button key={i} className="group aspect-video bg-muted rounded-lg border border-border hover:border-primary overflow-hidden relative shadow-sm transition-all hover:shadow-md hover:-translate-y-1" onClick={() => setBackgroundImage(url)}>
                        <img src={url} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-white font-mono text-[10px] uppercase tracking-wider">{name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {show3DAssets && (
                <div className="grid grid-cols-3 gap-3">
                  {threeDList.length === 0 && <p className="col-span-full text-center text-muted-foreground">No 3D assets available</p>}
                  {threeDList.map((url, i) => {
                    const name = url.split('/').pop() || `3d-${i + 1}`;
                    return (
                      <button key={i} className="group aspect-square bg-muted rounded-lg border border-border hover:border-[#0046FF] p-2 flex items-center justify-center transition-all hover:shadow-md hover:-translate-y-1" onClick={() => addStickerFromUrl(url)}>
                        <img src={url} alt={name} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
