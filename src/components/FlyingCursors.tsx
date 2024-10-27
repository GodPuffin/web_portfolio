import { IconPointerFilled } from '@tabler/icons-react';
import { useEffect, useState, useCallback } from 'react';
import { Tooltip } from "@mantine/core";

const FlyingCursor = ({ color, message }: { color: string; message: string }) => {
  const [position, setPosition] = useState({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
  const [velocity, setVelocity] = useState({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = useCallback(() => {
    setPosition(prev => {
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

    setVelocity(prev => ({
      x: prev.x + acceleration.x,
      y: prev.y + acceleration.y
    }));

    // Limit velocity
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed > 5) {
      setVelocity(prev => ({
        x: (prev.x / speed) * 5,
        y: (prev.y / speed) * 5
      }));
    }

    // Random acceleration changes
    if (Math.random() < 0.05) {
      setAcceleration({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2
      });
    }
  }, [velocity, acceleration]);

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
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: `rotate(${angle}deg)`,
          color: `var(--mantine-color-${color}-6)`,
          transition: 'all 0.1s linear',
          pointerEvents: 'auto',
          zIndex: 1,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </Tooltip>
  );
};

export const FlyingCursors = () => {
  const colors = [
    'red', 'pink', 'grape', 'indigo', 'blue', 
    'cyan', 'teal', 'green', 'orange'
  ];
  const messages = [
    "Hello!", "How are you?", "Nice to meet you!", "Have a great day!",
    "Welcome!", "Enjoy your stay!", "Greetings!", "Cheers!", "Good luck!",
    "Stay awesome!"
  ];
  const [cursors] = useState(() => 
    Array.from({ length: 10 }, () => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    }))
  );

  return (
    <>
      {cursors.map((cursor, index) => (
        <FlyingCursor key={index} color={cursor.color} message={cursor.message} />
      ))}
    </>
  );
};
