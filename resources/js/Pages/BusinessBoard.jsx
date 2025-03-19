import React, { useEffect, useState } from "react";
/*
 * Note about the drag & drop library:
 *
 * 1) If you want to use 'react-beautiful-dnd':
 *    - Install it with: npm install react-beautiful-dnd
 *    - Import:
 *         import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
 *    - Warning: 'react-beautiful-dnd' is no longer actively maintained by Atlassian.
 *      Also, it may trigger a warning related to 'defaultProps' in memoized components
 *      when used with React 18.
 *
 * 2) As an alternative, there is the '@hello-pangea/dnd' fork, which continues to receive
 *    updates and fixes some warnings/errors. To use it:
 *    - npm uninstall react-beautiful-dnd
 *    - npm install @hello-pangea/dnd
 *    - Change the import to:
 *         import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
 *
 *    The API is almost identical, so migration is usually simple.
 */
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchData, createState, renameState, confirmDeleteState, deleteState, createBusiness, editBusiness, deleteBusiness, createUser, moveBusiness} from "../services/apiService";
import Header from "../Components/Header";
import FilterByBusinessType from "../Components/FilterByBusinessType";
import CreateUserForm from "../Components/CreateUserForm";
import CreateStateForm from "../Components/CreateStateForm";
import BusinessCard from "../Components/BusinessCard";
import { DollarSign, Users, Trash, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Main component for the "Business Board" screen.
 * This component manages the states, businesses, and users, while integrating the drag & drop system.
 */
const BusinessBoard = () => {
    // Local state management
    const [businesses, setBusinesses] = useState([]);   // Stores all businesses
    const [states, setStates] = useState([]);   // Stores the available states (columns)
    const [filteredType, setFilteredType] = useState(null);     // Stores the selected business type filter
    const [businessTypes, setBusinessTypes] = useState([]);     // Stores all available business types
    const [newStateName, setNewStateName] = useState("");   // Stores the input for a new state name
    const [stateToDelete, setStateToDelete] = useState(null);   // Stores the state to be deleted
    const [isRenaming, setIsRenaming] = useState(false);    // Flag to track renaming state
    const [newBusiness, setNewBusiness] = useState({});     // Stores data for new businesses
    const [users, setUsers] = useState([]);     // Stores the list of users
    const [newBusinessForms, setNewBusinessForms] = useState({});   // Manages visibility of business creation forms

    // Fetches initial data when the component mounts
    useEffect(() => {
        fetchData(setBusinesses, setStates, setBusinessTypes, setUsers);
    }, []);

    /**
     * Handles key press event for creating a new state.
     * If the Enter key is pressed, it triggers the state creation.
     * @param {Event} event - The key press event
     */
    const handleCreateKeyPress = (event) => {
        if (event.key === "Enter") {
            createState(newStateName, setStates, states, setNewStateName);
        }
    };
    
    /**
     * Handles the key press event when renaming a state.
     * If the Enter key is pressed, the state is updated, and the input loses focus.
     * 
     * @param {Event} event - The key press event.
     * @param {number} id - The ID of the state being renamed.
     * @param {string} newName - The new name for the state.
     */
    const handleRenameKeyPress = (event, id, newName) => {
        if (event.key === "Enter") {
            event.preventDefault();
            renameState(id, newName, states, setStates, setIsRenaming);
            setTimeout(() => event.target.blur(), 50);
        }
    };

    /**
     * Handles input changes for creating a new business.
     * Updates the state dynamically based on the provided field and value.
     * 
     * @param {number} stateId - The ID of the state where the business is being created.
     * @param {string} field - The field being updated (e.g., name, value, user_id).
     * @param {string|number} value - The new value for the specified field.
     */
    const handleInputChange = (stateId, field, value) => {
        setNewBusiness({
            ...newBusiness,
            [stateId]: {
                ...newBusiness[stateId],
                [field]: value
            }
        });
    };
    
    /**
     * Creates a new business in the specified state.
     * Calls the createBusiness function and updates the business list.
     * 
     * @param {number} stateId - The ID of the state where the business will be created.
     */
    const handleCreateBusiness = (stateId) => {
        createBusiness(stateId, newBusiness, setBusinesses, setNewBusiness, businesses);
    };
    
    /**
     * Edits an existing business with updated data.
     * Calls the editBusiness function to update the business list.
     * 
     * @param {number} id - The ID of the business being edited.
     * @param {Object} updatedBusiness - The updated business data.
     */
    const handleEditBusiness = (id, updatedBusiness) => {
        editBusiness(id, updatedBusiness, setBusinesses);
    };
    
    /**
     * Deletes a business based on its ID.
     * Calls the deleteBusiness function and updates the state.
     * 
     * @param {number} businessId - The ID of the business to be deleted.
     */
    const handleDeleteBusiness = (businessId) => {
        deleteBusiness(businessId, setBusinesses, businesses);
    };

    /**
     * State for managing the new user input fields.
     */
    const [newUser, setNewUser] = useState({
        name: "",
        email: ""
    });
    
    /**
     * Handles the creation of a new user.
     * Calls the createUser function and updates the users list.
     */
    const handleCreateUser = () => {
        createUser(newUser, setUsers, setNewUser);
    };

    /**
     * Handles the drag-and-drop movement of business cards between states.
     * Uses the moveBusiness function to update the state.
     * 
     * @param {Object} result - The result of the drag-and-drop action.
     */
    const onDragEnd = (result) => {
        moveBusiness(result, businesses, setBusinesses);
    };

    /**
     * Toggles the form visibility for adding a new business in a specific state.
     * 
     * @param {number} stateId - The ID of the state where the business is being added.
     */
    const handleAddBusiness = (stateId) => {
        setNewBusinessForms((prev) => ({
          ...prev,
          [stateId]: !prev[stateId]
        }));
    };

    /**
     * Filters businesses by the selected business type.
     * If no filter is selected, returns all businesses.
     */
    const filteredBusinesses = filteredType
    ? businesses.filter((b) => Number(b.business_type_id) === Number(filteredType))
    : businesses;

    /**
     * Calculates the total revenue from all filtered businesses.
     */
    const totalValue = filteredBusinesses.reduce((sum, b) => sum + parseFloat(b.value), 0);
    
    /**
     * Computes the average business value based on the filtered businesses.
     */
    const averageBusinessValue = filteredBusinesses.length > 0 ? (totalValue / filteredBusinesses.length).toFixed(2) : "0.00";

    /**
     * Counts how many businesses exist in each state.
     */
    const stateCounts = states.map(state => ({
        name: state.name,
        count: filteredBusinesses.filter(b => b.state_id === state.id).length
    }));

    /**
     * Determines the state with the highest number of businesses.
     */
    const mostPopularState = stateCounts.length > 0 ? stateCounts.reduce((max, state) => (state.count > max.count ? state : max), stateCounts[0]) : null;

    return (
        <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
            {/* Toast notifications for user feedback */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header displaying key metrics like total businesses, revenue, and most popular state */}
            <Header
                filteredBusinesses={filteredBusinesses}
                totalValue={totalValue}
                averageBusinessValue={averageBusinessValue}
                mostPopularState={mostPopularState}
                users={users}
            />

            {/* Dropdown for filtering businesses by type */}
            <FilterByBusinessType
                filteredType={filteredType}
                setFilteredType={setFilteredType}
                businessTypes={businessTypes}
            />

            {/* Form for creating a new sales representative */}
            <CreateUserForm
                newUser={newUser}
                setNewUser={setNewUser}
                handleCreateUser={handleCreateUser}
            />

            {/* Form for creating a new state (business stage) */}
            <CreateStateForm
                newStateName={newStateName}
                setNewStateName={setNewStateName}
                handleCreateKeyPress={handleCreateKeyPress}
                handleCreateState={() => createState(newStateName, setStates, states, setNewStateName)}
            />

            <div className="bg-gray-900 text-gray-100 min-h-screen">
                <h3 className="text-2xl font-bold mb-4">Our Businesses</h3>

                {/* Drag-and-Drop Context for moving businesses between states */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 overflow-x-auto scrollbar-top py-2">
                    {states.map((state) => (
                        <Droppable key={state.id} droppableId={state.id.toString()}>
                        {(provided) => {
                            const stateBusinesses = filteredBusinesses.filter(
                            (b) => b.state_id === state.id
                            );
                            const totalCount = stateBusinesses.length;
                            const totalValue = stateBusinesses
                            .reduce((sum, b) => sum + parseFloat(b.value), 0)
                            .toFixed(2);
                            const averageValue = totalCount > 0 ? (totalValue / totalCount).toFixed(2) : "0.00";
                            const percentageOfTotal = filteredBusinesses.length > 0
                                ? ((totalCount / filteredBusinesses.length) * 100).toFixed(2)
                                : "0.00";

                            return (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="
                                bg-gray-800 p-4 rounded-lg
                                min-w-[250px]
                                sm:min-w-[280px]
                                sm:w-72
                                min-h-[300px] 
                                max-h-[900px] 
                                overflow-y-auto 
                                scrollbar-custom 
                                shadow-lg 
                                "
                            >
                                {/* State Header (Editable Name + Delete Button) */}
                                <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    defaultValue={state.name}
                                    onBlur={(e) =>
                                    !isRenaming && renameState(state.id, e.target.value, states, setStates, setIsRenaming)
                                    }
                                    onKeyDown={(e) =>
                                    handleRenameKeyPress(e, state.id, e.target.value)
                                    }
                                    className="text-lg font-bold text-gray-100 bg-transparent border-none outline-none w-full"
                                />
                                <button
                                    onClick={() => confirmDeleteState(state.id, setStateToDelete)}
                                    className="text-red-500"
                                >
                                    <Trash size={16} />
                                </button>
                                </div>

                                {/* State Statistics: Total Businesses, Revenue, Average Value */}
                                <div className="mt-2 flex flex-col font-bold text-gray-300">
                                    <p className="flex items-center gap-1">
                                        <Users size={18} className="text-green-400" />
                                        {totalCount} businesses ({percentageOfTotal}%)
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <DollarSign size={18} className="text-yellow-400" /> €{totalValue} total
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <DollarSign size={18} className="text-blue-400" /> Avg: €{averageValue}
                                    </p>
                                </div>

                                {/* List of Business Cards within this State */}
                                {stateBusinesses.map((business, index) => (
                                <Draggable
                                    key={business.id}
                                    draggableId={business.id.toString()}
                                    index={index}
                                >
                                    {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <BusinessCard
                                            business={business}
                                            businessTypes={businessTypes}
                                            users={users}
                                            onEdit={handleEditBusiness}
                                            onDelete={handleDeleteBusiness}
                                        />
                                    </div>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}

                                {/* Form for adding a new Business */}
                                {newBusinessForms[state.id] ? (
                                <div className="mt-4">
                                    <input
                                    type="text"
                                    placeholder="Business Name"
                                    value={newBusiness[state.id]?.name || ""}
                                    onChange={(e) => handleInputChange(state.id, "name", e.target.value)}
                                    className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                                    />
                                    <select
                                    value={newBusiness[state.id]?.business_type_id || ""}
                                    onChange={(e) =>
                                        handleInputChange(state.id, "business_type_id", e.target.value)
                                    }
                                    className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                                    >
                                    <option value="">Select Business Type</option>
                                    {businessTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                        {type.name}
                                        </option>
                                    ))}
                                    </select>
                                    <input
                                    type="number"
                                    value={newBusiness[state.id]?.value || ""}
                                    onChange={(e) => handleInputChange(state.id, "value", e.target.value)}
                                    placeholder="Business Value (€)"
                                    className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                                    />
                                    <select
                                    value={newBusiness[state.id]?.user_id || ""}
                                    onChange={(e) =>
                                        handleInputChange(state.id, "user_id", e.target.value)
                                    }
                                    className="p-2 rounded bg-gray-700 text-gray-200 w-full mb-2"
                                    >
                                    <option value="">Select Sales Representative</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                        {user.name}
                                        </option>
                                    ))}
                                    </select>
                                    <button
                                    onClick={() => handleCreateBusiness(state.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                                    >
                                    Create Business
                                    </button>
                                </div>
                                ) : (
                                <div
                                    className="p-4 bg-gray-700 rounded cursor-pointer mt-2"
                                    onClick={() => handleAddBusiness(state.id)}
                                >
                                    <div className="flex items-center justify-center text-gray-200">
                                    <Plus size={16} className="mr-2" /> Add Business
                                    </div>
                                </div>
                                )}
                            </div>
                            );
                        }}
                        </Droppable>
                    ))}
                    </div>
                </DragDropContext>

                {/* Confirmation Modal for Deleting a State */}
                {stateToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this state?</p>
                        <div className="mt-4 flex justify-end gap-4">
                        <button
                            className="px-4 py-2 bg-gray-600 rounded"
                            onClick={() => setStateToDelete(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 rounded"
                            onClick={() => deleteState(stateToDelete, setStateToDelete, setStates, states)}
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    </div>
                )}
                </div>
            </div>
    );
};

export default BusinessBoard;
