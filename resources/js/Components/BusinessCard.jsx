import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Briefcase, DollarSign } from "lucide-react";

/**
 * BusinessCard component represents an individual business entity in the UI.
 * Allows viewing, editing, and deleting a business.
 *
 * @param {Object} business - The business data.
 * @param {Function} onEdit - Callback function for editing the business.
 * @param {Function} onDelete - Callback function for deleting the business.
 * @param {Array} businessTypes - List of available business types.
 * @param {Array} users - List of users (sales representatives).
 */
const BusinessCard = ({ business, onEdit, onDelete, businessTypes, users }) => {

    // State to manage edit mode
    const [isEditing, setIsEditing] = useState(false);

    // State to manage form input values during editing
    const [editData, setEditData] = useState({
        name: business.name,
        value: business.value,
        business_type_id: business.business_type_id,
        state_id: business.state_id,
        user_id: business.user_id,
    });

    // State to control delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /**
     * Syncs the local editData state with updated business data
     * whenever the business prop changes.
     */
    useEffect(() => {
        setEditData({
            name: business.name,
            value: business.value,
            business_type_id: business.business_type_id,
            state_id: business.state_id,
            user_id: business.user_id,
        });
    }, [business]);

    /**
     * Handles saving the updated business details.
     * 
     * @param {Event} e - Form submission event.
     */
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        console.log("Updated data being sent:", editData);
        await onEdit(business.id, editData);
        setIsEditing(false);
    };

    /**
     * Handles business deletion confirmation.
     */
    const handleConfirmDelete = () => {
        onDelete(business.id);
        setShowDeleteModal(false);
    };

    // Main return block for BusinessCard component, rendering UI elements.
    return (
        <Card className="mb-3 p-4 bg-gray-700 text-gray-200 rounded-lg shadow-md" key={business.id}>
          
          {/* Header section containing the business name, edit mode, and action buttons */}
          <CardHeader className="flex justify-between items-center font-semibold">
            
            {/* Conditionally render input field for editing business name */}
            {isEditing ? (
            <>
               <label className="text-sm font-medium text-gray-400">
                Business Name
               </label>
               <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-lg font-bold text-gray-100 bg-transparent border-none outline-none w-full"
            />
            </>
            ) : (
            <>
                <p className="text-sm text-gray-400">Business Name</p>
                <span className="text-lg font-bold">{business.name}</span>
            </>
            )}

            {/* Action buttons: Edit, Save, Delete */}
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className="text-blue-500">
                {isEditing ? "Cancel" : "Edit"}
              </button>
    
              {/* Display save button only when in editing mode */}
              {isEditing && (
                <button onClick={handleSaveEdit} className="text-green-500">
                  Save
                </button>
              )}
    
              {/* Button to trigger delete confirmation modal */}
              <button onClick={() => setShowDeleteModal(true)} className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          </CardHeader>
    
          {/* Content section displaying business details */}
          <CardContent className="mt-2">
            {isEditing ? (
              <>
                {/* Editable input fields for Value, Business Type, and Sales Representative */}
                <label className="block text-sm font-medium text-gray-400 mb-1">
                Value
                </label>
                <input
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                />

                <label className="block text-sm font-medium text-gray-400 mb-1">
                Business Type
                </label>
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

                <label className="block text-sm font-medium text-gray-400 mb-1">
                Sales Representative
                </label>
                <select
                  value={editData.user_id}
                  onChange={(e) => setEditData({ ...editData, user_id: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                >
                  <option value="">Select Sales Representative</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                {/* Display business details when not in edit mode */}
                <p className="text-sm text-gray-400">Value</p>
                <p className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-green-400" /> €{business.value}
                </p>
                <p className="text-sm text-gray-400">Business Type</p>
                <p className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-yellow-400" />{" "}
                  {business.business_type?.name}
                </p>
                <p className="text-sm text-gray-400">Sales Representative</p>
                <p className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-blue-400" />{" "}
                  {business.user?.name || "Unknown"}
                </p>
              </>
            )}
          </CardContent>
    
          {/* Delete Confirmation Modal */}
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
