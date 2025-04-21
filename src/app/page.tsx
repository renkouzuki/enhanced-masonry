import MasonryDemo from "@/components/MasonryDemo";

export default function Home() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Enhanced Masonry Layout</h1>
        <p>A responsive, powerful React masonry grid component</p>
      </header>

      <main>
        <MasonryDemo />
      </main>

      <footer className="app-footer">
        <p>
          Install via: <code>npm install enhanced-masonry</code>
        </p>
        <p>
          <a
            href="https://github.com/renkouzuki/enhanced-masonry"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>{" "}
          |
          <a
            href="https://www.npmjs.com/package/enhanced-masonry"
            target="_blank"
            rel="noopener noreferrer"
          >
            NPM Package
          </a>
        </p>
      </footer>
    </div>
  );
}
