const FilterByBusinessType = ({ filteredType, setFilteredType, businessTypes }) => {
    return (
        <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-semibold text-gray-100">Filter by Business Type</h3>
            <select
                value={filteredType || ""}
                onChange={(e) => setFilteredType(e.target.value || null)}
                className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
            >
                <option value="">Select Business Type</option>
                {businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterByBusinessType;
