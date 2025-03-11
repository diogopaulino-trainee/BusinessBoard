import React from "react";

const Header = ({ businesses }) => {
    const totalValue = businesses.reduce((sum, b) => sum + parseFloat(b.value), 0);

    return (
        <div className="flex justify-between p-4 bg-blue-500 text-white rounded mb-4">
            <h1 className="text-xl font-bold">Business Board</h1>
            <p>Total: €{totalValue.toFixed(2)}</p>
        </div>
    );
};

export default Header;
