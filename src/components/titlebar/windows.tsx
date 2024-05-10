import { useCallback, useEffect, useState } from "react";
import type { Window } from "@tauri-apps/api/window";
import { Icons } from "./icons";

export function Windows() {
  const [appWindow, setAppWindow] = useState<Window | null>(null);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);

  // Fetch the Tauri window plugin when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@tauri-apps/api").then((module) => {
        setAppWindow(module.window.getCurrent());
      });
    }
  }, []);

  // Update the isWindowMaximized state when the window is resized
  const updateIsWindowMaximized = useCallback(async () => {
    if (appWindow) {
      const _isWindowMaximized = await appWindow.isMaximized();
      setIsWindowMaximized(_isWindowMaximized);
    }
  }, [appWindow]);

  useEffect(() => {
    updateIsWindowMaximized();
    let unlisten: () => void;

    const listen = async () => {
      if (appWindow) {
        unlisten = await appWindow.onResized(() => {
          void updateIsWindowMaximized();
        });
      }
    };
    listen();

    // Cleanup the listener when the component unmounts
    return () => unlisten && unlisten();
  }, [appWindow, updateIsWindowMaximized]);

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

  return (
    <div
      className="flex select-none flex-row overflow-hidden bg-slate-800"
      data-tauri-drag-region
    >
      <div className="flex items-center h-10 ml-auto">
        <button
          onClick={minimizeWindow}
          className="max-h-10 w-[46px] cursor-default rounded-none bg-transparent
          text-black hover:bg-black/[.05] active:bg-black/[.03] dark:text-white
          dark:hover:bg-white/[.06] dark:active:bg-white/[.04]
          inline-flex items-center justify-center h-10"
        >
          <Icons.minimizeWin />
        </button>
        <button
          onClick={maximizeWindow}
          className="max-h-10 w-[46px] cursor-default rounded-none bg-transparent
          text-black hover:bg-black/[.05] active:bg-black/[.03] dark:text-white
          dark:hover:bg-white/[.06] dark:active:bg-white/[.04]
          inline-flex items-center justify-center h-10"
        >
          {!isWindowMaximized ? (
            <Icons.maximizeWin />
          ) : (
            <Icons.maximizeRestoreWin />
          )}
        </button>
        <button
          onClick={closeWindow}
          className="max-h-10 w-[46px] cursor-default rounded-none bg-transparent
          text-black hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/90
          dark:text-white inline-flex items-center justify-center h-10"
        >
          <Icons.closeWin />
        </button>
      </div>
    </div>
  );
}
