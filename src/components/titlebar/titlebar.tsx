import { useEffect, useState } from "react";
import { Mac } from "./mac";
import { Windows } from "./windows";
import { type } from "@tauri-apps/plugin-os";

export function Titlebar() {
  // Hold the OS type in state
  const [osType, setOsType] = useState<string | undefined>(undefined);

  // Fetch the OS type from the plugin
  const getOsType = async () => {
    await type()
      .then((type) => {
        setOsType(type);
      })
      .catch(console.error);
  };

  // Check our OS type when the component mounts
  useEffect(() => {
    getOsType();
  }, []);

  switch (osType) {
    case "macos":
      return <Mac />;
    case "windows":
      return <Windows />;
    default:
      return <Windows />;
  }
}
