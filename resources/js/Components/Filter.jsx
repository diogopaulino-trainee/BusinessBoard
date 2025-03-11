import React, { useEffect, useState } from "react";
import axios from "axios";

const Filter = ({ setFilteredType }) => {
    const [businessTypes, setBusinessTypes] = useState([]);

    useEffect(() => {
        axios.get("/api/business-types").then((response) => setBusinessTypes(response.data));
    }, []);

    return (
        <div className="mb-4">
            <select
                onChange={(e) => setFilteredType(e.target.value || null)}
                className="p-2 border rounded"
            >
                <option value="">Todos os Tipos</option>
                {businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Filter;
