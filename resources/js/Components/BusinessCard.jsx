import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Briefcase, DollarSign } from "lucide-react";

// import { useDraggable } from '@dnd-kit/core';

const BusinessCard = ({ business, onEdit, onDelete, businessTypes, users }) => {

    // const { attributes, listeners, setNodeRef } = useDraggable({
    //     id: `business-${business.id}`,
    // });

    // useEffect(() => {
    // }, [listeners, attributes]);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: business.name,
        value: business.value,
        business_type_id: business.business_type_id,
        state_id: business.state_id,
        user_id: business.user_id,
    });

    useEffect(() => {
        setEditData({
            name: business.name,
            value: business.value,
            business_type_id: business.business_type_id,
            state_id: business.state_id,
            user_id: business.user_id,
        });
    }, [business]);

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        console.log("Updated data being sent:", editData);
        await onEdit(business.id, editData);
        setIsEditing(false);
    };

    return (
        <Card
            // ref={setNodeRef}
            className="mb-3 p-4 bg-gray-700 text-gray-200 rounded-lg shadow-md"
            key={business.id}
            // {...listeners}
            // {...attributes}
        >
            <CardHeader className="flex justify-between items-center font-semibold">
                {isEditing ? (
                    <input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-lg font-bold text-gray-100 bg-transparent border-none outline-none w-full"
                    />
                ) : (
                    <span>{business.name}</span>
                )}
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(!isEditing)} className="text-blue-500">
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                    {isEditing && (
                        <button onClick={handleSaveEdit} className="text-green-500">
                            Save
                        </button>
                    )}
                    <button onClick={() => onDelete(business.id)} className="text-red-500">
                        <Trash size={16} />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="mt-2">
                {isEditing ? (
                    <>
                        <input
                            value={editData.value}
                            onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                            className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                        />
                        <select
                            value={editData.business_type_id}
                            onChange={(e) => setEditData({ ...editData, business_type_id: e.target.value })}
                            className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                        >
                            <option value="">Select Business Type</option>
                            {businessTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={editData.user_id}
                            onChange={(e) => setEditData({ ...editData, user_id: e.target.value })}
                            className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <p className="flex items-center gap-2">
                            <Briefcase size={16} className="text-yellow-400" /> {business.business_type?.name}
                        </p>
                        <p className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-400" /> €{business.value}
                        </p>
                        <p className="flex items-center gap-2">
                            <Users size={16} className="text-blue-400" /> {business.user?.name || "Unknown"}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default BusinessCard;
