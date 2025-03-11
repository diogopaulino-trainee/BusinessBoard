import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import BusinessCard from "./BusinessCard";

const Column = ({ state, businesses, onMove, onCreateBusiness, onEditBusiness, onDeleteBusiness }) => {
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onMove(active.id, state.id);
        }
    };

    const handleCreateBusiness = () => {
        onCreateBusiness(state.id);
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="bg-gray-200 p-4 rounded w-64 min-h-[300px]">
                <h2 className="text-lg font-bold">{state.name}</h2>
                <button onClick={handleCreateBusiness} className="bg-blue-500 text-white p-2 rounded mt-4">
                    Create Business
                </button>
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
