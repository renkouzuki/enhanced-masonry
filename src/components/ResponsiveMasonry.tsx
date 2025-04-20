import React, { useCallback, useEffect, useState } from "react";

interface BreakPoints {
  [key: number]: number | string;
}

interface ResponsiveMasonryProps {
  columnsCountBreakPoints?: BreakPoints;
  gutterBreakPoints?: BreakPoints;
  children: React.ReactElement<{ columnsCount?: number; gutter?: string }>;
  className?: string | null;
  style?: React.CSSProperties | null;
}

const DEFAULT_COLUMNS_COUNT = 1;
const DEFAULT_GUTTER = "10px";

const ResponsiveMasonry: React.FC<ResponsiveMasonryProps> = ({
  columnsCountBreakPoints = {
    350: 1,
    750: 2,
    900: 3,
  },
  gutterBreakPoints = {},
  children,
  className = null,
  style = null,
}) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setHasMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResponsiveValue = useCallback(
    <T extends number | string>(
      breakPoints: BreakPoints,
      defaultValue: T
    ): T => {
      if (!hasMounted) return defaultValue;

      const sortedBreakPoints = Object.keys(breakPoints)
        .map(Number)
        .sort((a, b) => a - b);

      let value =
        sortedBreakPoints.length > 0
          ? (breakPoints[sortedBreakPoints[0]] as T)
          : defaultValue;

      sortedBreakPoints.forEach((breakPoint) => {
        if (breakPoint < windowWidth) {
          value = breakPoints[breakPoint] as T;
        }
      });

      return value;
    },
    [windowWidth, hasMounted]
  );

  const columnsCount = getResponsiveValue<number>(
    columnsCountBreakPoints,
    DEFAULT_COLUMNS_COUNT
  );
  const gutter = getResponsiveValue<string>(gutterBreakPoints, DEFAULT_GUTTER);

  if (!hasMounted) {
    // only render if it is client-side not ssr
    return null;
  }

  return (
    <div className={className || undefined} style={style || undefined}>
      {React.cloneElement(children as React.ReactElement<any>, {
        columnsCount,
        gutter,
      })}
    </div>
  );
};

export default ResponsiveMasonry;
