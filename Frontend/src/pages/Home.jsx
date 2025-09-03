import { useMemo, useState } from "react";
import "./Home.css";
import axios from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// UI only: sample products similar shape to seller endpoint

export default function Home() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [products, setproducts] = useState(null);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:3000/api/products");
    setproducts(response.data.products);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products?.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price.amount - b.price.amount);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price.amount - a.price.amount);
        break;
      case "stock":
        list = [...list].sort((a, b) => b.stock - a.stock);
        break;
      default:
        break; // newest placeholder
    }
    return list;
  }, [query, sort,products]);

  return (
    <div className="home-shell" aria-labelledby="home-heading">
      <section className="home-hero">
        <h1 id="home-heading" className="home-title">
          Discover products
        </h1>
        <p className="home-sub">
          Browse a curated selection of items. This UI uses sample data only –
          integrate your API later to power real listings.
        </p>
      </section>

      <div className="products-toolbar">
        <div className="filters" role="search">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div
          style={{ fontSize: ".65rem", color: "var(--color-text-soft)" }}
          aria-live="polite"
        >
          {filtered?.length} products
        </div>
      </div>

      {filtered?.length === 0 ? (
        <div className="empty" role="status">
          <strong>No products</strong>
          Try adjusting your search or filters.
        </div>
      ) : (
        <div className="products-grid" role="list" aria-label="Products">
          {filtered?.map((p) => {
            const cover = p.images?.[0];
            const priceFmt = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: p.price.currency,
            }).format(p.price.amount / 100);
            const low = p.stock < 5;
            return (
              <NavLink to={`/product/${p._id}`}
                key={p._id}
                className="p-card"
                role="listitem"
                aria-label={p.title}
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={p.title}
                    className="p-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="p-thumb" aria-hidden="true" />
                )}
                <div className="p-body">
                  <h3 className="p-title" title={p.title}>
                    {p.title}
                  </h3>
                  <p className="p-desc" title={p.description}>
                    {p.description}
                  </p>
                  <div className="p-price-row">
                    <span className="p-price">{priceFmt}</span>
                    <span className={`p-stock ${low ? "low" : ""}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
