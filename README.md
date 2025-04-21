# Enhanced Masonry Layout

A user-friendly, highly customizable React masonry layout component with built-in responsive capabilities.

## Features

- **All-in-one Solution**: Combined masonry layout and responsive functionality in a single component
- **Responsive Design**: Automatically adjust columns and gutters based on screen size
- **Layout Options**: Choose between sequential item placement or height-optimized layout
- **Customizable**: Extensive styling options and HTML tag customization
- **TypeScript Support**: Full TypeScript integration with proper interfaces
- **Performance Optimized**: Efficient rendering using React hooks

## Installation

```bash
npm install enhanced-masonry-layout
# or
yarn add enhanced-masonry-layout
```

## Quick Start

```jsx
import React from 'react';
import EnhancedMasonry from 'enhanced-masonry-layout';

const App = () => {
  const items = Array(20).fill(null).map((_, i) => (
    <div key={i} style={{
      height: `${Math.floor(Math.random() * 200) + 100}px`,
      background: `hsl(${Math.random() * 360}, 70%, 80%)`,
      padding: '16px',
    }}>
      Item {i + 1}
    </div>
  ));

  return (
    <EnhancedMasonry>
      {items}
    </EnhancedMasonry>
  );
};

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | Required | Child components to arrange in masonry layout |
| `columnsBreakPoints` | Object | `{ 350: 1, 750: 2, 900: 3 }` | Define column counts for different screen widths |
| `gutterBreakPoints` | Object | `{ 350: "10px", 750: "15px", 900: "20px" }` | Define gutters for different screen widths |
| `defaultColumns` | number | `3` | Default number of columns |
| `defaultGutter` | string | `"10px"` | Default gutter size |
| `className` | string | - | CSS class name |
| `style` | Object | `{}` | Inline styles for container |
| `itemStyle` | Object | `{}` | Inline styles for column containers |
| `sequential` | boolean | `false` | Use sequential ordering (`true`) or height-optimized layout (`false`) |
| `containerTag` | string | `"div"` | HTML tag for container element |
| `itemTag` | string | `"div"` | HTML tag for column elements |

## Advanced Usage

### Custom Breakpoints

```jsx
<EnhancedMasonry 
  columnsBreakPoints={{ 480: 1, 768: 2, 1024: 3, 1440: 4 }}
  gutterBreakPoints={{ 480: "8px", 768: "16px", 1024: "24px" }}
>
  {items}
</EnhancedMasonry>
```

### Sequential vs Height-Optimized Layout

```jsx
// Sequential (items fill columns from left to right)
<EnhancedMasonry sequential={true}>
  {items}
</EnhancedMasonry>

// Height-optimized (items placed to keep columns balanced)
<EnhancedMasonry sequential={false}>
  {items}
</EnhancedMasonry>
```

### Custom Styling

```jsx
<EnhancedMasonry 
  className="custom-masonry"
  style={{ padding: "20px", background: "#f5f5f5" }}
  itemStyle={{ borderRadius: "8px", overflow: "hidden" }}
  containerTag="section"
  itemTag="article"
>
  {items}
</EnhancedMasonry>
```

## How It Works

The `EnhancedMasonry` component:

1. Listens for window resize events to determine current screen width
2. Calculates appropriate columns and gutter values based on breakpoints
3. Creates refs for child elements to measure their heights
4. Distributes children into columns based on selected layout strategy:
   - Sequential: fills columns from left to right
   - Height-optimized: adds each item to the shortest column

## Browser Support

Works in all modern browsers and IE11 with appropriate polyfills.

## License

MIT