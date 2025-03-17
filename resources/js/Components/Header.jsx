import { MoveRight, Users, DollarSign, Award } from "lucide-react";

const Header = ({ filteredBusinesses, totalValue, averageBusinessValue, mostPopularState, users }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MoveRight size={28} className="text-blue-400" /> Business Board
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <p className="flex items-center gap-2 text-lg">
                    <Users size={20} className="text-green-400" /> Total: {filteredBusinesses.length} businesses
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <DollarSign size={20} className="text-yellow-400" /> Revenue: €{totalValue.toFixed(2)}
                </p>
                <p className="flex items-center gap-2 text-lg">
                    <DollarSign size={20} className="text-blue-400" /> Avg Business Value: €{averageBusinessValue}
                </p>
                {mostPopularState && (
                    <p className="flex items-center gap-2 text-lg">
                        <Award size={20} className="text-purple-400" /> Most Businesses: {mostPopularState.name} ({mostPopularState.count})
                    </p>
                )}
                <p className="flex items-center gap-2 text-lg">
                    <Users size={20} className="text-cyan-400" /> Sales Representatives: {users.length}
                </p>
            </div>
        </div>
    );
};

export default Header;
