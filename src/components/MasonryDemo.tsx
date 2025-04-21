"use client"
import React, { useState, useEffect } from 'react';
import './Demo.css'; 
import { EnhancedMasonry } from 'enhanced-masonry';

const MasonryDemo = () => {
  const [columns, setColumns] = useState(3);
  const [gutter, setGutter] = useState(16);
  const [itemCount, setItemCount] = useState(20);
  const [isSequential, setIsSequential] = useState(false);
  const [theme, setTheme] = useState('pastel');
  
  const generateItems = (count:number, theme:string) => {
    return Array(count).fill(null).map((_, i) => {
      const height = Math.floor(Math.random() * 150) + 100;
      
      let color;
      switch(theme) {
        case 'pastel':
          color = `hsl(${Math.random() * 360}, 70%, 80%)`;
          break;
        case 'vibrant':
          color = `hsl(${Math.random() * 360}, 90%, 65%)`;
          break;
        case 'monochrome':
          const shade = Math.floor(Math.random() * 60) + 20;
          color = `hsl(0, 0%, ${shade}%)`;
          break;
        case 'blues':
          color = `hsl(210, ${Math.floor(Math.random() * 40) + 60}%, ${Math.floor(Math.random() * 30) + 40}%)`;
          break;
        default:
          color = `hsl(${Math.random() * 360}, 70%, 80%)`;
      }
      
      return {
        id: i + 1,
        height,
        color,
      };
    });
  };

  const [items, setItems] = useState(generateItems(itemCount, theme));

  useEffect(() => {
    setItems(generateItems(itemCount, theme));
  }, [itemCount, theme]);
  
  const columnsBreakPoints = { 
    480: Math.max(1, columns - 2),
    768: Math.max(2, columns - 1),
    1200: columns                    
  };

  const regenerateItems = () => {
    setItems(generateItems(itemCount, theme));
  };

  return (
    <div className="masonry-demo">
      <h1>Enhanced Masonry Layout Demo</h1>
      
      <div className="demo-controls">
        <div className="control-group">
          <label>
            Columns: {columns}
            <input 
              type="range" 
              min="1" 
              max="6" 
              value={columns} 
              onChange={(e) => setColumns(Number(e.target.value))}
            />
          </label>
          
          <label>
            Gutter: {gutter}px
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={gutter} 
              onChange={(e) => setGutter(Number(e.target.value))}
            />
          </label>
          
          <label>
            Item Count: {itemCount}
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={itemCount} 
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={isSequential}
              onChange={() => setIsSequential(!isSequential)}
            />
            Sequential Layout
          </label>
          
          <label>
            Color Theme:
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="pastel">Pastel</option>
              <option value="vibrant">Vibrant</option>
              <option value="monochrome">Monochrome</option>
              <option value="blues">Blues</option>
            </select>
          </label>
          
          <button onClick={regenerateItems}>
            Regenerate Items
          </button>
        </div>
      </div>
      
      <div className="demo-description">
        <p>
          Layout Mode: <strong>{isSequential ? 'Sequential' : 'Height-Optimized'}</strong>
          {isSequential 
            ? ' — Items are arranged sequentially from left to right'
            : ' — Items are arranged to balance column heights'}
        </p>
      </div>
      
      <div className="masonry-container">
        <EnhancedMasonry
          columnsBreakPoints={columnsBreakPoints}
          defaultColumns={columns}
          defaultGutter={`${gutter}px`}
          sequential={isSequential}
          className="demo-masonry"
        >
          {items.map(item => (
            <div 
              key={item.id}
              className="masonry-item"
              style={{
                height: `${item.height}px`,
                backgroundColor: item.color,
              }}
            >
              <span className="item-number">{item.id}</span>
            </div>
          ))}
        </EnhancedMasonry>
      </div>
      
      <div className="demo-footer">
        <p>
          Try resizing your browser window to see the responsive behavior in action! 
          The layout will automatically adjust based on screen width.
        </p>
      </div>
    </div>
  );
};

export default MasonryDemo;