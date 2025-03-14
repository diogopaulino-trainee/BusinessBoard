import React, { useEffect, useState } from "react";
/*
 * Observação sobre a biblioteca de drag & drop:
 *
 * 1) Se quiser usar 'react-beautiful-dnd':
 *    - Instale com: npm install react-beautiful-dnd
 *    - Importe:
 *         import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
 *    - Atenção: 'react-beautiful-dnd' não é mais mantido ativamente pela Atlassian.
 *      Além disso, pode gerar um aviso relacionado a 'defaultProps' em componentes
 *      memoizados quando usado no React 18.
 *
 * 2) Como alternativa, existe o fork '@hello-pangea/dnd', que continua recebendo
 *    atualizações e corrige alguns avisos/erros. Para usá-lo:
 *    - npm uninstall react-beautiful-dnd
 *    - npm install @hello-pangea/dnd
 *    - E altere o import para:
 *         import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
 *
 *    A API é praticamente a mesma, então a migração costuma ser simples.
 */
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import BusinessCard from "../Components/BusinessCard";
import { MoveRight, DollarSign, Users, Trash, Plus, Award } from "lucide-react";
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
    const [newBusinessForms, setNewBusinessForms] = useState({});

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
      
        // Verifica se o objeto e campos obrigatórios existem
        if (
          !currentBusiness ||
          !currentBusiness.name?.trim() ||
          !currentBusiness.value ||
          !currentBusiness.business_type_id
        ) {
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
      
          setNewBusiness((prev) => ({
            ...prev,
            [stateId]: { name: "", business_type_id: "", value: "" },
          }));
        } catch (error) {
          toast.error("Error creating business.");
        }
    };

    const handleEditBusiness = async (id, updatedBusiness) => {
        try {
    
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
            toast.success("Sales Representative created successfully!");
            setUsers([...users, response.data]);
            setNewUser({ name: "", email: "" });
        } catch (error) {
            toast.error("Error creating Sales Representative.");
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

    const handleAddBusiness = (stateId) => {
        setNewBusinessForms((prev) => ({
          ...prev,
          [stateId]: !prev[stateId]
        }));
    };

    const filteredBusinesses = filteredType
    ? businesses.filter((b) => Number(b.business_type_id) === Number(filteredType))
    : businesses;

    const totalValue = filteredBusinesses.reduce((sum, b) => sum + parseFloat(b.value), 0);
    const averageBusinessValue = filteredBusinesses.length > 0 ? (totalValue / filteredBusinesses.length).toFixed(2) : "0.00";

    const stateCounts = states.map(state => ({
        name: state.name,
        count: filteredBusinesses.filter(b => b.state_id === state.id).length
    }));
    const mostPopularState = stateCounts.length > 0 ? stateCounts.reduce((max, state) => (state.count > max.count ? state : max), stateCounts[0]) : null;

    return (
        <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
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
                            <Award  size={20} className="text-purple-400" /> Most Businesses: {mostPopularState.name} ({mostPopularState.count})
                        </p>
                    )}
                    <p className="flex items-center gap-2 text-lg">
                        <Users size={20} className="text-cyan-400" /> Sales Representatives: {users.length}
                    </p>
                </div>
            </div>

            {/* Filter by Business Type */}
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

            {/* Create User */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Create Sales Representative</h3>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Sales Representative Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <input
                    type="email"
                    placeholder="Sales Representative Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <button
                    onClick={createUser}
                    className="bg-green-500 px-4 py-2 rounded text-white flex items-center h-12 whitespace-nowrap"
                    >
                    <Plus size={16} className="mr-2" /> Add Sales Representative
                    </button>
                </div>
            </div>

            {/* Create State */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Create State</h3>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="New State Name"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    onKeyDown={handleCreateKeyPress}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                    />
                    <button
                    onClick={createState}
                    className="bg-blue-500 px-4 py-2 rounded text-white flex items-center h-12 whitespace-nowrap"
                    >
                    <Plus size={16} className="mr-2" /> Add State
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 text-gray-100 min-h-screen">
                <h3 className="text-2xl font-bold mb-4">Our Businesses</h3>

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

                                {/* Totalizadores do Estado */}
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

                                {/* Lista de Business Cards */}
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

                                {/* Card para adicionar novo Business */}
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

                {/* Confirmation Modal for Deleting State */}
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
                            onClick={deleteState}
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
