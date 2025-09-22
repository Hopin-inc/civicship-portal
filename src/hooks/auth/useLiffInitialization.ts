"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";


interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

export const useLiffInitialization = ({ environment, liffService }: UseLiffInitializationProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) {
        logger.debug("useLiffInitialization: Skipping LIFF init (not LIFF environment)", {
          component: "useLiffInitialization",
          timestamp: new Date().toISOString(),
          environment,
        });
        return;
      }

      try {
        const currentState = liffService.getState();
        
        if (currentState.state === "pre-initialized") {
          logger.debug("useLiffInitialization: SDK pre-initialized by bootstrap; proceeding with auth init", {
            component: "useLiffInitialization",
            timestamp: new Date().toISOString(),
            currentState: currentState.state,
          });
        } else {
          logger.debug("useLiffInitialization: Starting LIFF initialization", {
            component: "useLiffInitialization",
            timestamp: new Date().toISOString(),
            environment,
            currentState: currentState.state,
          });
        }

        await liffService.initialize();
        
        const finalState = liffService.getState();
        logger.debug("useLiffInitialization: LIFF initialization completed", {
          authType: "liff",
          timestamp: new Date().toISOString(),
          component: "useLiffInitialization",
          finalState: finalState.state,
          isLoggedIn: finalState.isLoggedIn,
        });
      } catch (error) {
        logger.warn("useLiffInitialization: LIFF initialization failed", {
          authType: "liff",
          timestamp: new Date().toISOString(),
          component: "useLiffInitialization",
          error: error instanceof Error ? error.message : String(error),
          liffState: liffService.getState(),
        });
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
