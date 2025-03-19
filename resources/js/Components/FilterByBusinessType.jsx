/**
 * FilterByBusinessType Component
 *
 * This component provides a dropdown to filter businesses by type.
 *
 * @param {Object} props - Component props
 * @param {string|null} props.filteredType - The currently selected business type filter.
 * @param {Function} props.setFilteredType - Function to update the selected business type.
 * @param {Array} props.businessTypes - List of available business types.
 */
const FilterByBusinessType = ({ filteredType, setFilteredType, businessTypes }) => {
    return (
        <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            
            {/* Section title */}
            <h3 className="text-xl font-semibold text-gray-100">Filter by Business Type</h3>
            
            {/* Dropdown for selecting a business type */}
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
