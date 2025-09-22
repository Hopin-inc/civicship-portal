"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";

export default function LiffBootstrap() {
  useEffect(() => {
    const initializeLiff = async () => {
      if (detectEnvironment() !== AuthEnvironment.LIFF) {
        logger.debug("LiffBootstrap: Skipping LIFF pre-init (not LIFF environment)", {
          component: "LiffBootstrap",
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
      if (!liffId) {
        logger.warn("LiffBootstrap: LIFF_ID not found", {
          component: "LiffBootstrap",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      try {
        logger.debug("LiffBootstrap: Starting LIFF pre-initialization", {
          component: "LiffBootstrap",
          timestamp: new Date().toISOString(),
        });
        
        await LiffService.getInstance(liffId).preInitialize();
        
        logger.debug("LiffBootstrap: LIFF pre-initialization completed", {
          component: "LiffBootstrap",
          timestamp: new Date().toISOString(),
          state: LiffService.getInstance().getInitState(),
        });
      } catch (error) {
        logger.warn("LiffBootstrap: LIFF pre-initialization failed", {
          component: "LiffBootstrap",
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    initializeLiff();
  }, []);
  
  return null;
}
