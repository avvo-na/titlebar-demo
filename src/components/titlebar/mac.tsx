import { useEffect, useState } from "react";
import type { Window } from "@tauri-apps/api/window";
import { Icons } from "./icons";

export function Mac() {
  const [appWindow, setAppWindow] = useState<Window | null>(null);

  // Fetch the Tauri window plugin when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@tauri-apps/api").then((module) => {
        setAppWindow(module.window.getCurrent());
      });
    }
  }, []);

  // Helper functions to minimize, maximize, fullscreen, and close the window
  const minimizeWindow = async () => {
    if (appWindow) {
      await appWindow.minimize();
    }
  };

  const maximizeWindow = async () => {
    if (appWindow) {
      await appWindow.toggleMaximize();
    }
  };

  const closeWindow = async () => {
    if (appWindow) {
      await appWindow.close();
    }
  };

  const fullscreenWindow = async () => {
    if (appWindow) {
      const fullscreen = await appWindow.isFullscreen();
      if (fullscreen) {
        await appWindow.setFullscreen(false);
      } else {
        await appWindow.setFullscreen(true);
      }
    }
  };

  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const last = isAltKeyPressed ? <Icons.plusMac /> : <Icons.fullMac />;
  const key = "Alt";

  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleAltKeyDown = (e: KeyboardEvent) => {
    if (e.key === key) {
      setIsAltKeyPressed(true);
    }
  };
  const handleAltKeyUp = (e: KeyboardEvent) => {
    if (e.key === key) {
      setIsAltKeyPressed(false);
    }
  };

  useEffect(() => {
    // Attach event listeners when the component mounts
    window.addEventListener("keydown", handleAltKeyDown);
    window.addEventListener("keyup", handleAltKeyUp);
  }, []);

  return (
    <div
      className="flex select-none flex-row overflow-hidden bg-slate-800"
      data-tauri-drag-region
    >
      <div
        className="space-x-2 px-3 text-black active:text-black dark:text-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={closeWindow}
          className="aspect-square h-3 w-3 cursor-default content-center
          items-center justify-center self-center rounded-full border
          border-black/[.12] bg-[#ff544d] text-center text-black/60
          hover:bg-[#ff544d] active:bg-[#bf403a] active:text-black/60
          dark:border-none"
        >
          {isHovering && <Icons.closeMac />}
        </button>
        <button
          onClick={minimizeWindow}
          className="aspect-square h-3 w-3 cursor-default content-center
          items-center justify-center self-center rounded-full border
          border-black/[.12] bg-[#ffbd2e] text-center text-black/60
          hover:bg-[#ffbd2e] active:bg-[#bf9122] active:text-black/60
          dark:border-none"
        >
          {isHovering && <Icons.minMac />}
        </button>
        <button
          onClick={isAltKeyPressed ? maximizeWindow : fullscreenWindow}
          className="aspect-square h-3 w-3 cursor-default content-center
          items-center justify-center self-center rounded-full border
          border-black/[.12] bg-[#28c93f] text-center text-black/60
          hover:bg-[#28c93f] active:bg-[#1e9930] active:text-black/60
          dark:border-none"
        >
          {isHovering && last}
        </button>
      </div>
    </div>
  );
}
