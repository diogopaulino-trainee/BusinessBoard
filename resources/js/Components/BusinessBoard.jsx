import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import BusinessCard from "../Components/BusinessCard";
import { MoveRight, Filter, DollarSign, Users, Briefcase, Trash, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BusinessBoard = () => {
    const [businesses, setBusinesses] = useState([]);
    const [states, setStates] = useState([]);
    const [filteredType, setFilteredType] = useState(null);
    const [businessTypes, setBusinessTypes] = useState([]);
    const [newStateName, setNewStateName] = useState("");
    const [stateToDelete, setStateToDelete] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newBusiness, setNewBusiness] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [businessRes, stateRes, typeRes, userRes] = await Promise.all([
                axios.get("/api/businesses"),
                axios.get("/api/states"),
                axios.get("/api/business-types"),
                axios.get("/api/users"),
            ]);
            
            // console.log("Business Data:", businessRes.data);
            // console.log("State Data:", stateRes.data);
            // console.log("Business Type Data:", typeRes.data);
            // console.log("User Data:", userRes.data);
            
            setBusinesses(businessRes.data);
            setStates(stateRes.data);
            setBusinessTypes(typeRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error loading data.");
        }
    };

    const createState = async () => {
        if (!newStateName.trim()) return;
        try {
            const response = await axios.post("/api/states", { name: newStateName });
    
            if (response.data && response.data.state) {
                setStates([...states, response.data.state]);
                toast.success("State created successfully!");
            } else {
                fetchData();
            }
    
            setNewStateName("");
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error creating state.");
            }
        }
    };

    const handleCreateKeyPress = (event) => {
        if (event.key === "Enter") {
            createState();
        }
    };
    
    const renameState = async (id, newName, eventType) => {
        if (!newName.trim()) return;
    
        const currentState = states.find(state => state.id === id);
        if (!currentState || currentState.name === newName) {
            if (eventType === "enter") {
                toast.info("No changes were made. The state name remains the same.");
            }
            return;
        }
    
        if (isRenaming) return;
        setIsRenaming(true);
    
        try {
            const response = await axios.put(`/api/states/${id}`, { name: newName });
    
            setStates(states.map(state => (state.id === id ? { ...state, name: newName } : state)));
    
            toast.success(response.data.message || "State name updated!");
        } catch (error) {
            toast.error("Error updating state.");
        }
    
        setTimeout(() => setIsRenaming(false), 100);
    };
    
    const handleRenameKeyPress = (event, id, newName) => {
        if (event.key === "Enter") {
            event.preventDefault();
            renameState(id, newName, "enter");
            setTimeout(() => event.target.blur(), 50);
        }
    };

    const confirmDeleteState = (id) => {
        setStateToDelete(id);
    };

    const deleteState = async () => {
        if (!stateToDelete) return;
        try {
            await axios.delete(`/api/states/${stateToDelete}`);
            setStates(states.filter((state) => state.id !== stateToDelete));
            toast.success("State deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Error deleting state.");
        }
        setStateToDelete(null);
    };

    const handleInputChange = (stateId, field, value) => {
        setNewBusiness({
            ...newBusiness,
            [stateId]: {
                ...newBusiness[stateId],
                [field]: value
            }
        });
    };
    
    const handleCreateBusiness = async (stateId) => {
        const currentBusiness = newBusiness[stateId];
        console.log("Data being sent:", currentBusiness);
    
        if (!currentBusiness.name.trim() || !currentBusiness.value || !currentBusiness.business_type_id) {
            toast.error("Please fill out all fields.");
            return;
        }
    
        try {
            const response = await axios.post("/api/businesses", {
                ...currentBusiness,
                state_id: stateId,
            });
    
            console.log("Response data:", response.data);
    
            setBusinesses([...businesses, response.data]);
            toast.success("Business created successfully!");
    
            setNewBusiness({
                ...newBusiness,
                [stateId]: { name: "", business_type_id: "", value: "" },
            });
        } catch (error) {
            toast.error("Error creating business.");
        }
    };

    const handleEditBusiness = async (id, updatedBusiness) => {
        try {
            const response = await axios.put(`/api/businesses/${id}`, updatedBusiness);
    
            setBusinesses((prevBusinesses) => {
                return prevBusinesses.map((business) =>
                    business.id === id ? { ...business, ...updatedBusiness } : business
                );
            });
    
            toast.success("Business updated successfully! The page will refresh shortly.");
    
            setTimeout(() => {
                window.location.reload();
            }, 3000);
    
        } catch (error) {
            toast.error("Error updating business.");
        }
    };
    
    const handleDeleteBusiness = async (businessId) => {
        try {
            await axios.delete(`/api/businesses/${businessId}`);
            setBusinesses(businesses.filter((business) => business.id !== businessId));
            toast.success("Business deleted successfully!");
        } catch (error) {
            toast.error("Error deleting business.");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        console.log("Active item:", active);
        console.log("Over item:", over);

        if (!over || active.id === over.id) {
            console.log("Drag ended without movement.");
            return;
        }
    
        const movedBusiness = businesses.find((b) => b.id === active.id);
        const targetState = states.find((state) => state.id === over.id);
    
        console.log("Moved business:", movedBusiness);
        console.log("Target state:", targetState);
    
        if (movedBusiness && targetState) {
            try {
                const response = await axios.put(`/api/businesses/${active.id}`, {
                    state_id: targetState.id,
                    name: movedBusiness.name,
                    value: movedBusiness.value,
                    business_type_id: movedBusiness.business_type_id,
                    user_id: movedBusiness.user_id,
                });
    
                setBusinesses((prev) =>
                    prev.map((b) =>
                        b.id === active.id ? { ...b, state_id: targetState.id } : b
                    )
                );
    
                toast.success("Business moved successfully!");
            } catch (error) {
                toast.error("Error moving business.");
            }
        } else {
            console.log("No business or state found for move.");
        }
    };

    const [newUser, setNewUser] = useState({
        name: "",
        email: ""
    });
    
    const createUser = async () => {
        if (!newUser.name.trim() || !newUser.email.trim()) {
            toast.error("Please fill in both fields.");
            return;
        }
    
        try {
            const response = await axios.post("/api/users", newUser);
            toast.success("User created successfully!");
            setUsers([...users, response.data]);
            setNewUser({ name: "", email: "" });
        } catch (error) {
            toast.error("Error creating user.");
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
      
        if (source.droppableId !== destination.droppableId) {
          const movedBusiness = businesses.find(b => b.id.toString() === draggableId);
          const newStateId = parseInt(destination.droppableId, 10);
          
          try {
            await axios.put(`/api/businesses/${draggableId}`, {
              ...movedBusiness,
              state_id: newStateId,
            });
            setBusinesses(businesses.map(b => 
              b.id.toString() === draggableId ? { ...b, state_id: newStateId } : b
            ));
            toast.success("Business moved successfully!");
          } catch (error) {
            toast.error("Error moving business.");
          }
        }
      };

    const filteredBusinesses = filteredType
    ? businesses.filter((b) => Number(b.business_type_id) === Number(filteredType))
    : businesses;

        return (
            <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
                <ToastContainer position="top-right" autoClose={3000} />
        
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MoveRight size={28} className="text-blue-400" /> Business Board
                    </h1>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="flex items-center gap-2 text-lg">
                            <Users size={20} className="text-green-400" /> Total: {filteredBusinesses.length} businesses
                        </p>
                        <p className="flex items-center gap-2 text-lg">
                            <DollarSign size={20} className="text-yellow-400" /> Revenue: €{filteredBusinesses.reduce((sum, b) => sum + parseFloat(b.value), 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Filtro por Tipo de Negócio */}
                <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                    <h3 className="text-xl font-semibold text-gray-100">Filter by Business Type</h3>
                    <select
                        value={filteredType || ""}
                        onChange={(e) => setFilteredType(e.target.value || null)}
                        className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    >
                        <option value="">Select Business Type</option>
                        {businessTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
        
                {/* Create State */}
                <div className="flex gap-2 bg-gray-800 p-4 rounded-lg shadow-md">
                    <input
                        type="text"
                        placeholder="New State Name"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        onKeyDown={handleCreateKeyPress}
                        className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <button onClick={createState} className="bg-blue-500 px-4 py-2 rounded text-white flex items-center h-12">
                        <Plus size={16} className="mr-2" /> Add
                    </button>
                </div>
        
                {/* Create User */}
                <div className="flex gap-2 bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                    <input
                        type="text"
                        placeholder="User Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <input
                        type="email"
                        placeholder="User Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <button
                        onClick={createUser}
                        className="bg-green-500 px-4 py-2 rounded text-white flex items-center h-12 whitespace-nowrap"
                    >
                        <Plus size={16} className="mr-2" /> Add User
                    </button>
                </div>                
        
                <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                    {states.map((state) => (
                    <Droppable key={state.id} droppableId={state.id.toString()}>
                        {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="bg-gray-800 p-4 rounded-lg w-72 min-h-[300px] shadow-lg"
                        >
                            {/* Cabeçalho do Estado */}
                            <div className="flex justify-between items-center">
                            <input
                                type="text"
                                defaultValue={state.name}
                                onBlur={(e) =>
                                !isRenaming && renameState(state.id, e.target.value, "blur")
                                }
                                onKeyDown={(e) =>
                                handleRenameKeyPress(e, state.id, e.target.value)
                                }
                                className="text-lg font-bold text-gray-100 bg-transparent border-none outline-none w-full"
                            />
                            <button
                                onClick={() => confirmDeleteState(state.id)}
                                className="text-red-500"
                            >
                                <Trash size={16} />
                            </button>
                            </div>

                            {/* Formulário para criação de Business */}
                            <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Business Name"
                                value={newBusiness[state.id]?.name || ""}
                                onChange={(e) =>
                                handleInputChange(state.id, "name", e.target.value)
                                }
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
                                onChange={(e) =>
                                handleInputChange(state.id, "value", e.target.value)
                                }
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
                                <option value="">Select User</option>
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

                            {/* Lista de Business Cards */}
                            {filteredBusinesses
                            .filter((b) => b.state_id === state.id)
                            .map((business, index) => (
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
                        </div>
                        )}
                    </Droppable>
                    ))}
                </div>
                </DragDropContext>
        
                {/* Confirmation Modal for Deleting State */}
                {stateToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                            <h2 className="text-lg font-bold">Confirm Deletion</h2>
                            <p>Are you sure you want to delete this state?</p>
                            <div className="mt-4 flex justify-end gap-4">
                                <button className="px-4 py-2 bg-gray-600 rounded" onClick={() => setStateToDelete(null)}>Cancel</button>
                                <button className="px-4 py-2 bg-red-500 rounded" onClick={deleteState}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default BusinessBoard;
