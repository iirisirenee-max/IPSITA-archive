import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Entry = {
  id: string;
  title: string;
  parentId: string | null;
  category: string;
  type?: string;
  status?: string;
  description?: string;
};

const entries: Entry[] = [
  {
    id: "ipsita",
    title: "IPSITA",
    parentId: null,
    category: "Root",
    type: "root",
    description: "An index of things made, found, learned & imagined.",
  },

  ...["Literature", "Research", "Code", "Design", "Art", "Archive", "Presentations", "Music"]
    .map((x) => ({
      id: x.toLowerCase(),
      title: x.toUpperCase(),
      parentId: "ipsita",
      category: x,
      type: "category",
      description:
        x === "Music"
          ? "A future branch for singing, listening, performances and recordings."
          : undefined,
    })),

  { id: "poetry", title: "Poetry", parentId: "literature", category: "Literature", type: "collection" },
  { id: "stories", title: "Stories", parentId: "literature", category: "Literature", type: "collection" },
  { id: "articles", title: "Articles", parentId: "literature", category: "Literature", type: "collection" },
  { id: "letters", title: "Letters", parentId: "literature", category: "Literature", type: "collection" },
  { id: "books", title: "Books", parentId: "literature", category: "Literature", type: "collection" },

  { id: "poems", title: "Poems", parentId: "poetry", category: "Literature", type: "collection" },
  {
    id: "poetry-competitions",
    title: "Poetry Competitions",
    parentId: "poetry",
    category: "Literature",
    type: "collection",
    description: "Competition contexts and their connected records.",
  },
  {
    id: "poetry-certificate",
    title: "Participation certificate — details pending",
    parentId: "poetry-competitions",
    category: "Archive",
    type: "record",
    status: "Placeholder",
    description: "Reserved for the exact certificate wording and asset.",
  },

  {
    id: "self-published",
    title: "Self-published · 0 currently",
    parentId: "books",
    category: "Literature",
    type: "record",
    description: "No self-published books are currently recorded.",
  },
  {
    id: "collab",
    title: "Collaborative / Anthology Books",
    parentId: "books",
    category: "Literature",
    type: "collection",
  },
  {
    id: "collab-done",
    title: "Title pending",
    parentId: "collab",
    category: "Literature",
    type: "record",
    status: "Completed",
    description: "One completed collaborative or anthology book.",
  },
  {
    id: "collab-next",
    title: "Upcoming title",
    parentId: "collab",
    category: "Literature",
    type: "record",
    status: "Upcoming",
    description: "One upcoming collaborative or anthology book.",
  },

  { id: "research-fields", title: "Fields", parentId: "research", category: "Research", type: "collection" },
  { id: "space", title: "Space Science", parentId: "research-fields", category: "Research", type: "collection" },
  { id: "exoplanets", title: "Exoplanets", parentId: "space", category: "Research", type: "collection" },
  {
    id: "kepler",
    title: "NASA Kepler data exploration",
    parentId: "exoplanets",
    category: "Research",
    type: "project",
    status: "Exploration",
    description: "Computational exploration of exoplanet data.",
  },
  { id: "infrastructure", title: "Infrastructure", parentId: "research-fields", category: "Research", type: "collection" },
  {
    id: "hazards",
    title: "Infrastructure hazard mapping",
    parentId: "infrastructure",
    category: "Research",
    type: "project",
    description: "Geospatial research direction around infrastructure hazards.",
  },

  { id: "c", title: "C", parentId: "code", category: "Code", type: "collection" },
  { id: "code-projects", title: "Projects / Experiments", parentId: "c", category: "Code", type: "collection" },
  { id: "websites", title: "Websites", parentId: "code", category: "Code", type: "collection" },
  { id: "apps", title: "Apps", parentId: "code", category: "Code", type: "collection" },

  { id: "canva", title: "Canva", parentId: "design", category: "Design", type: "collection" },
  { id: "posters", title: "Posters", parentId: "canva", category: "Design", type: "collection" },
  { id: "presentations-design", title: "Presentations", parentId: "canva", category: "Design", type: "collection" },

  { id: "drawing", title: "Drawing", parentId: "art", category: "Art", type: "collection" },
  { id: "painting", title: "Painting", parentId: "art", category: "Art", type: "collection" },
  { id: "digital", title: "Digital Art", parentId: "art", category: "Art", type: "collection" },

  { id: "participation", title: "Participation", parentId: "archive", category: "Archive", type: "collection" },
  { id: "competitions", title: "Competitions", parentId: "archive", category: "Archive", type: "collection" },
  { id: "certificates", title: "Certificates", parentId: "archive", category: "Archive", type: "collection" },

  {
    id: "nsss",
    title: "NSSS 2025 Youth Outreach Programme",
    parentId: "participation",
    category: "Archive",
    type: "record",
    status: "Participation",
    description: "Participation record; exact certificate wording can be attached later.",
  },

  {
    id: "presentation-projects",
    title: "Presentation Projects",
    parentId: "presentations",
    category: "Presentations",
    type: "collection",
  },

  ...["ALEATOR", "ISREYA", "IDORA", "SPACE-AID", "NEXUS GATE", "MORPH CITY — THE CIVIC YARD"].map((x) => ({
    id: x.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: x,
    parentId: "presentation-projects",
    category: "Presentations",
    type: "project",
    description: "Project node. Context and materials can be added later.",
  })),

  { id: "singing", title: "Singing", parentId: "music", category: "Music", type: "collection", description: "Future music archive branch." },
  { id: "listening", title: "Listening", parentId: "music", category: "Music", type: "collection", description: "Future listening branch; Spotify can be connected later." },
  { id: "performances", title: "Performances", parentId: "music", category: "Music", type: "collection" },
  { id: "recordings", title: "Recordings", parentId: "music", category: "Music", type: "collection" },
];

const byId = new Map(entries.map((entry) => [entry.id, entry]));

function childrenOf(id: string) {
  return entries.filter((entry) => entry.parentId === id);
}

function App() {
  const [expanded, setExpanded] = useState(new Set(["ipsita"]));
  const [selected, setSelected] = useState("ipsita");
  const [query, setQuery] = useState("");
  const [indexMode, setIndexMode] = useState(false);

  const toggle = (id: string) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelected(id);
  };

  const visible = entries.filter((entry) => {
    if (entry.id === "ipsita") return true;

    let parent = entry.parentId;

    while (parent) {
      if (!expanded.has(parent)) return false;
      parent = byId.get(parent)?.parentId ?? null;
    }

    return true;
  });

  const filtered = entries.filter((entry) =>
    `${entry.title} ${entry.category} ${entry.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const selectedEntry = byId.get(selected) ?? entries[0];

  return (
    <main>
      <header className="top">
        <div>
          <div className="eyebrow">IPSITA — LIVING INDEX</div>

          <h1>
            Everything I’ve
            <br />
            <i>explored.</i>
          </h1>

          <p>An index of things made, found, learned & imagined.</p>
        </div>

        <div className="controls">
          <button
            className={!indexMode ? "active" : ""}
            onClick={() => setIndexMode(false)}
          >
            MAP
          </button>

          <button
            className={indexMode ? "active" : ""}
            onClick={() => setIndexMode(true)}
          >
            INDEX
          </button>
        </div>
      </header>

      {indexMode ? (
        <section className="index">
          <div className="search">
            <input
              placeholder="search the archive…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="rows">
            {filtered.map((entry) => (
              <button
                className="row"
                key={entry.id}
                onClick={() => {
                  setSelected(entry.id);
                  setIndexMode(false);
                }}
              >
                <span>{entry.category}</span>
                <strong>{entry.title}</strong>
                <small>{entry.status ?? entry.type ?? "—"}</small>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="universe">
          <div className="grid" />
          <div className="orbit o1" />
          <div className="orbit o2" />

          <button className="root-node" onClick={() => toggle("ipsita")}>
            IPSITA
            <span>01</span>
          </button>

          {visible
            .filter((entry) => entry.id !== "ipsita")
            .map((entry, index) => {
              const isCategory = entry.parentId === "ipsita";

              const angles = [-155, -112, -68, -24, 22, 66, 112, 158];
              const angle = angles[index % angles.length];

              const radius = isCategory ? 230 : 145;

              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <button
                  key={entry.id}
                  className={`node ${isCategory ? "category" : ""}`}
                  style={
                    {
                      "--x": `${x}px`,
                      "--y": `${y}px`,
                    } as React.CSSProperties
                  }
                  onClick={() => toggle(entry.id)}
                >
                  <span>{entry.title}</span>

                  {childrenOf(entry.id).length > 0 && (
                    <em>{childrenOf(entry.id).length}</em>
                  )}
                </button>
              );
            })}
        </section>
      )}

      <aside className="inspector">
        <div className="eyebrow">
          INSPECTOR / {selectedEntry.category.toUpperCase()}
        </div>

        <h2>{selectedEntry.title}</h2>

        {selectedEntry.status && <label>{selectedEntry.status}</label>}

        <p>
          {selectedEntry.description ?? "A branch in the living archive."}
        </p>

        <div className="meta">
          {selectedEntry.type ?? "entry"} ·{" "}
          {childrenOf(selectedEntry.id).length} child node
          {childrenOf(selectedEntry.id).length === 1 ? "" : "s"}
        </div>

        {childrenOf(selectedEntry.id).length > 0 && (
          <div className="children">
            {childrenOf(selectedEntry.id).map((child) => (
              <button key={child.id} onClick={() => toggle(child.id)}>
                {child.title}
                <span>↗</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <footer>
        <span>ARCHIVE / 2026 → ∞</span>

        <a href="mailto:ipsitadebashreet@gmail.com">
          ipsitadebashreet@gmail.com
        </a>

        <button>MUSIC: OFF</button>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
