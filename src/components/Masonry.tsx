import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  ReactNode,
  ReactElement,
} from "react";

interface MasonryProps {
  children: ReactNode;
  columnsCount?: number;
  gutter?: string;
  className?: string | null;
  style?: React.CSSProperties;
  containerTag?: string;
  itemTag?: string;
  itemStyle?: React.CSSProperties;
  sequential?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  children,
  columnsCount = 3,
  gutter = "0",
  className = null,
  style = {},
  containerTag = "div",
  itemTag = "div",
  itemStyle = {},
  sequential = false,
}) => {
  const [columns, setColumns] = useState<ReactElement[][]>([]);
  const [hasDistributed, setHasDistributed] = useState<boolean>(false);
  const childrenRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    childrenRefs.current = Array(React.Children.count(children))
      .fill(null)
      .map(
        (_, i) => childrenRefs.current[i] || React.createRef<HTMLDivElement>()
      );
  }, [children]);

  const getEqualColumns = useMemo(() => {
    const cols: ReactElement[][] = Array.from(
      { length: columnsCount },
      () => []
    );
    let validIndex = 0;

    React.Children.forEach(children, (child) => {
      if (child && React.isValidElement(child)) {
        cols[validIndex % columnsCount].push(
          <div
            style={{ display: "flex", justifyContent: "stretch" }}
            key={validIndex}
            ref={childrenRefs.current[validIndex]}
          >
            {child}
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
      const cols: ReactElement[][] = Array.from(
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
              style={{ display: "flex", justifyContent: "stretch" }}
              key={validIndex}
              ref={childrenRefs.current[validIndex]}
            >
              {child}
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
  }, [children, columnsCount, hasDistributed, sequential]);

  const renderColumns = () => {
    return columns.map((column, i) =>
      React.createElement(
        itemTag,
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

  return React.createElement(
    containerTag,
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

export default Masonry;
