import type { CreateDeviceRequest } from "../schemas/device";

export function getDeviceInfo(): CreateDeviceRequest {
  const ua = navigator.userAgent;
  const language = navigator.language || "unknown";
  const screen_resolution = `${window.screen.width}x${window.screen.height}`;

  // Try to use modern API first
  let browser = "unknown";
  let os = "unknown";

  if ("userAgentData" in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uaData = (navigator as any).userAgentData;
    browser = uaData.brands?.[0]?.brand || "unknown";
    os = uaData.platform || "unknown";
  } else {
    // Fallback to regex parsing
    if (/chrome|chromium|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";
    else browser = "Other";

    if (/windows/i.test(ua)) os = "Windows";
    else if (/mac os/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/iphone|ipad|ios/i.test(ua)) os = "iOS";
  }

  return { browser, os, screen_resolution, language };
}
