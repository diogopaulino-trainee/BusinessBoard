import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import BusinessCard from "./BusinessCard";

/**
 * Column component representing a state in the business board.
 * It contains a list of business cards and supports drag-and-drop functionality.
 *
 * @param {Object} props - Component props
 * @param {Object} props.state - The state (column) object containing id and name.
 * @param {Array} props.businesses - The list of businesses within this state.
 * @param {Function} props.onMove - Function to handle moving a business between states.
 * @param {Function} props.onCreateBusiness - Function to create a new business in this state.
 * @param {Function} props.onEditBusiness - Function to handle editing a business.
 * @param {Function} props.onDeleteBusiness - Function to handle deleting a business.
 */
const Column = ({ state, businesses, onMove, onCreateBusiness, onEditBusiness, onDeleteBusiness }) => {
    
    /**
     * Handles the drag-and-drop event when a business card is moved.
     * Calls the `onMove` function if the business is dropped in a different state.
     *
     * @param {Object} event - The drag event object from DndKit.
     */
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onMove(active.id, state.id);
        }
    };

    /**
     * Triggers the creation of a new business in the current state.
     */
    const handleCreateBusiness = () => {
        onCreateBusiness(state.id);
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            {/* DndContext enables drag-and-drop functionality within the column */}
            <div className="bg-gray-200 p-4 rounded w-64 min-h-[300px]">
                
                {/* State (Column) Name */}
                <h2 className="text-lg font-bold">{state.name}</h2>
                
                {/* Button to create a new business */}
                <button onClick={handleCreateBusiness} className="bg-blue-500 text-white p-2 rounded mt-4">
                    Create Business
                </button>

                {/* SortableContext allows for sorting business cards inside this column */}
                <SortableContext items={businesses} strategy={verticalListSortingStrategy}>
                    {businesses.map((business) => (
                        <BusinessCard 
                            key={business.id} 
                            business={business}
                            onEdit={onEditBusiness}
                            onDelete={onDeleteBusiness}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
};

export default Column;
