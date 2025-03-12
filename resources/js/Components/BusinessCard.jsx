import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Briefcase, DollarSign } from "lucide-react";

const BusinessCard = ({ business, onEdit, onDelete, businessTypes, users }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: business.name,
        value: business.value,
        business_type_id: business.business_type_id,
        state_id: business.state_id,
        user_id: business.user_id,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const handleConfirmDelete = () => {
        onDelete(business.id);
        setShowDeleteModal(false);
    };

    return (
        <Card className="mb-3 p-4 bg-gray-700 text-gray-200 rounded-lg shadow-md" key={business.id}>
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
    
              <button onClick={() => setShowDeleteModal(true)} className="text-red-500">
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
                  <Briefcase size={16} className="text-yellow-400" />{" "}
                  {business.business_type?.name}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" /> €{business.value}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} className="text-blue-400" />{" "}
                  {business.user?.name || "Unknown"}
                </p>
              </>
            )}
          </CardContent>
    
          {/* Modal de Confirmação de Deleção */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-[300px]">
                <h2 className="text-lg font-bold">Confirm Deletion</h2>
                <p className="mt-2">Are you sure you want to delete this business?</p>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-600 rounded"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-red-500 rounded" onClick={handleConfirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      );
    };
    
    export default BusinessCard;
