import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  ElementType,
} from "react";

interface BreakPoint {
  [key: number]: number | string;
}

interface EnhancedMasonryProps {
  children: ReactNode;
  columnsBreakPoints?: BreakPoint;
  gutterBreakPoints?: BreakPoint;
  defaultColumns?: number;
  defaultGutter?: string;
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  sequential?: boolean;
  containerTag?: ElementType;
  itemTag?: ElementType;
}

const EnhancedMasonry: React.FC<EnhancedMasonryProps> = ({
  children,
  columnsBreakPoints = { 350: 1, 750: 2, 900: 3 },
  gutterBreakPoints = { 350: "10px", 750: "15px", 900: "20px" },
  defaultColumns = 3,
  defaultGutter = "10px",
  className,
  style = {},
  itemStyle = {},
  sequential = false,
  containerTag = "div",
  itemTag = "div",
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [columns, setColumns] = useState<React.ReactElement[][]>([]);
  const [hasDistributed, setHasDistributed] = useState<boolean>(false);
  const childrenRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    setHasMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setHasDistributed(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResponsiveValue = useCallback(
    <T extends number | string>(breakPoints: BreakPoint, defaultValue: T): T => {
      if (!hasMounted) return defaultValue;

      const sortedBreakPoints = Object.keys(breakPoints)
        .map(Number)
        .sort((a, b) => a - b);

      let value = defaultValue;

      sortedBreakPoints.forEach((breakPoint) => {
        if (breakPoint <= windowWidth) {
          value = breakPoints[breakPoint] as T;
        }
      });

      return value;
    },
    [windowWidth, hasMounted]
  );

  const columnsCount = getResponsiveValue<number>(columnsBreakPoints, defaultColumns);
  const gutter = getResponsiveValue<string>(gutterBreakPoints, defaultGutter);

  useEffect(() => {
    childrenRefs.current = Array(React.Children.count(children))
      .fill(null)
      .map(
        (_, i) => childrenRefs.current[i] || React.createRef<HTMLDivElement>()
      );
  }, [children]);

  const getEqualColumns = useMemo(() => {
    const cols: React.ReactElement[][] = Array.from(
      { length: columnsCount },
      () => []
    );
    let validIndex = 0;

    React.Children.forEach(children, (child) => {
      if (child && React.isValidElement(child)) {
        cols[validIndex % columnsCount].push(
          <div
            style={{ display: "flex", justifyContent: "stretch", width: "100%" }}
            key={validIndex}
            ref={childrenRefs.current[validIndex]}
          >
            {React.cloneElement(child, {
              style: { width: "100%", ...child.props.style },
            })}
          </div>
        );
        validIndex++;
      }
    });

    return cols;
  }, [children, columnsCount]);

  useEffect(() => {
    setColumns(getEqualColumns);
    setHasDistributed(sequential);
  }, [getEqualColumns, sequential]);

  useEffect(() => {
    if (hasDistributed || sequential) return;

    const distributeChildren = (): boolean => {
      const columnHeights = Array(columnsCount).fill(0);
      const cols: React.ReactElement[][] = Array.from(
        { length: columnsCount },
        () => []
      );
      let validIndex = 0;

      const isReady = childrenRefs.current.every(
        (ref) =>
          ref && ref.current && ref.current.getBoundingClientRect().height
      );

      if (!isReady) return false;

      React.Children.forEach(children, (child) => {
        if (child && React.isValidElement(child)) {
          const childHeight =
            childrenRefs.current[validIndex].current?.getBoundingClientRect()
              .height || 0;
          const minHeightColumnIndex = columnHeights.indexOf(
            Math.min(...columnHeights)
          );

          columnHeights[minHeightColumnIndex] += childHeight;
          cols[minHeightColumnIndex].push(
            <div
              style={{ display: "flex", justifyContent: "stretch", width: "100%" }}
              key={validIndex}
              ref={childrenRefs.current[validIndex]}
            >
              {React.isValidElement(child) 
                ? React.cloneElement(child as React.ReactElement<any>, {
                    style: { width: "100%", ...(child.props.style || {}) },
                  })
                : child}
            </div>
          );
          validIndex++;
        }
      });

      setColumns(cols);
      setHasDistributed(true);
      return true;
    };

    const success = distributeChildren();
    if (!success) {
      const timer = setTimeout(() => {
        distributeChildren();
      }, 100);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [children, columnsCount, hasDistributed, sequential, hasMounted]);

  const renderColumns = () => {
    return columns.map((column, i) =>
      React.createElement(
        itemTag as React.ElementType,
        {
          key: i,
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "stretch",
            flex: 1,
            width: 0,
            gap: gutter,
            ...itemStyle,
          },
        },
        column
      )
    );
  };

  if (!hasMounted) {
    return null;
  }

  return React.createElement(
    containerTag as React.ElementType,
    {
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "stretch",
        boxSizing: "border-box",
        width: "100%",
        gap: gutter,
        ...style,
      },
      className,
    },
    renderColumns()
  );
};

export default EnhancedMasonry;