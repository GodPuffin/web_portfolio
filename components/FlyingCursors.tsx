"use client";

import { IconPointerFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@mantine/core";
import { supabase } from "../utils/supabaseClient";
import { generateDeviceId } from "../utils/fingerprint";
import { useLocalStorage } from "@mantine/hooks";

const FlyingCursor = (
  { color, message, isMobile }: {
    color: string;
    message: string;
    isMobile: boolean;
  },
) => {
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  });
  const [velocity, setVelocity] = useState({
    x: (Math.random() * 2 - 1) * (isMobile ? 0.5 : 1),
    y: (Math.random() * 2 - 1) * (isMobile ? 0.5 : 1),
  });
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = useCallback(() => {
    setPosition((prev) => {
      let newX = prev.x + velocity.x;
      let newY = prev.y + velocity.y;
      let newVelocityX = velocity.x;
      let newVelocityY = velocity.y;

      // Bounce off edges
      if (newX < 0 || newX > window.innerWidth) {
        newVelocityX = -newVelocityX;
        newX = newX < 0 ? 0 : window.innerWidth;
      }
      if (newY < 0 || newY > window.innerHeight) {
        newVelocityY = -newVelocityY;
        newY = newY < 0 ? 0 : window.innerHeight;
      }

      setVelocity({ x: newVelocityX, y: newVelocityY });

      return { x: newX, y: newY };
    });

    setVelocity((prev) => ({
      x: prev.x + acceleration.x,
      y: prev.y + acceleration.y,
    }));

    // Limit velocity
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed > (isMobile ? 2.5 : 5)) {
      setVelocity((prev) => ({
        x: (prev.x / speed) * (isMobile ? 2.5 : 5),
        y: (prev.y / speed) * (isMobile ? 2.5 : 5),
      }));
    }

    // Random acceleration changes
    if (Math.random() < 0.05) {
      setAcceleration({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
      });
    }
  }, [velocity, acceleration, isMobile]);

  useEffect(() => {
    const moveInterval = setInterval(updatePosition, 16);
    return () => clearInterval(moveInterval);
  }, [updatePosition]);

  const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + 135;

  return (
    <Tooltip
      label={message}
      position="top"
      color={color}
      opened={isHovered}
    >
      <IconPointerFilled
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          transform: `rotate(${angle}deg)`,
          color: `var(--mantine-color-${color}-6)`,
          transition: "all 0.1s linear",
          pointerEvents: "auto",
          zIndex: 1,
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </Tooltip>
  );
};

export const FlyingCursors = () => {
  const [cursors, setCursors] = useState<
    Array<{ id: number; color: string; message: string }>
  >([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [showCursors] = useLocalStorage({
    key: "show-cursors",
    defaultValue: false,
  });

  const fetchCursors = useCallback(async (currentDeviceId: string | null) => {
    if (!currentDeviceId) return;

    const { data: currentDeviceCursor, error: currentDeviceError } =
      await supabase
        .from("cursors")
        .select("*")
        .eq("device_id", currentDeviceId)
        .single();

    if (currentDeviceError && currentDeviceError.code !== "PGRST116") {
      console.error(
        "Error fetching current device cursor:",
        currentDeviceError,
      );
    }

    const { data: otherCursors, error: otherCursorsError } = await supabase
      .from("cursors")
      .select("*")
      .neq("device_id", currentDeviceId)
      .limit(100);

    if (otherCursorsError) {
      console.error("Error fetching other cursors:", otherCursorsError);
    } else {
      const isMobile = window.innerWidth <= 768;
      const cursorLimit = isMobile ? 6 : 15;

      const randomCursors = otherCursors
        ? shuffleArray(otherCursors).slice(0, cursorLimit)
        : [];
      const allCursors = currentDeviceCursor
        ? [currentDeviceCursor, ...randomCursors]
        : randomCursors;
      setCursors(allCursors);
    }
  }, []);

  useEffect(() => {
    const initializeDeviceId = async () => {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        id = await generateDeviceId();
        localStorage.setItem("deviceId", id);
      }
      setDeviceId(id);
      fetchCursors(id);
    };

    initializeDeviceId();

    const channel = supabase
      .channel("cursors")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "cursors",
      }, () => fetchCursors(deviceId))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceId, fetchCursors]);

  // Helper function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const isMobile = window.innerWidth <= 768;

  if (!showCursors) {
    return null;
  }

  return (
    <>
      {cursors.map((cursor) => (
        <FlyingCursor
          key={cursor.id}
          color={cursor.color}
          message={cursor.message}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};
