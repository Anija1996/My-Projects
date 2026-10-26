import FilterDropdown from "./FilterDropdown";

export default function CategoryFilter({ size, setSize, color, setColor, price, setPrice, sizes, colors, priceOptions }) {
    return (
        <div className="shop-filters-centered">
            <FilterDropdown label="SIZE" value={size} options={sizes} onChange={setSize} />
            <FilterDropdown label="COLOR" value={color} options={colors} onChange={setColor} />
            <FilterDropdown label="PRICE" value={price} options={priceOptions} onChange={setPrice} />
        </div>
    );
}

