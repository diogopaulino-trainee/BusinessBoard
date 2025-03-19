import { MoveRight, Users, DollarSign, Award } from "lucide-react";

/**
 * Header Component
 *
 * Displays an overview of the business board, including total businesses, revenue,
 * average business value, the most active state, and the number of sales representatives.
 *
 * @param {Object} props - Component props
 * @param {Array} props.filteredBusinesses - List of businesses after filtering.
 * @param {number} props.totalValue - The total revenue of all businesses.
 * @param {number} props.averageBusinessValue - The average value of a business.
 * @param {Object|null} props.mostPopularState - The state with the most businesses.
 * @param {Array} props.users - List of sales representatives.
 */
const Header = ({ filteredBusinesses, totalValue, averageBusinessValue, mostPopularState, users }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            
            {/* Page title with an icon */}
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MoveRight size={28} className="text-blue-400" /> Business Board
            </h1>

            {/* Statistics section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Total businesses count */}
                <p className="flex items-center gap-2 text-lg">
                    <Users size={20} className="text-green-400" /> Total: {filteredBusinesses.length} businesses
                </p>

                {/* Total revenue */}
                <p className="flex items-center gap-2 text-lg">
                    <DollarSign size={20} className="text-yellow-400" /> Revenue: €{totalValue.toFixed(2)}
                </p>

                {/* Average business value */}
                <p className="flex items-center gap-2 text-lg">
                    <DollarSign size={20} className="text-blue-400" /> Avg Business Value: €{averageBusinessValue}
                </p>

                {/* Display the most active state if available */}
                {mostPopularState && (
                    <p className="flex items-center gap-2 text-lg">
                        <Award size={20} className="text-purple-400" /> Most Businesses: {mostPopularState.name} ({mostPopularState.count})
                    </p>
                )}

                {/* Number of sales representatives */}
                <p className="flex items-center gap-2 text-lg">
                    <Users size={20} className="text-cyan-400" /> Sales Representatives: {users.length}
                </p>
            </div>
        </div>
    );
};

export default Header;
