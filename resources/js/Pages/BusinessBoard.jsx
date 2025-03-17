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
import { fetchData, createState, renameState, confirmDeleteState, deleteState, createBusiness, editBusiness, deleteBusiness, createUser, moveBusiness} from "../services/apiService";
import Header from "../Components/Header";
import FilterByBusinessType from "../Components/FilterByBusinessType";
import CreateUserForm from "../Components/CreateUserForm";
import CreateStateForm from "../Components/CreateStateForm";
import BusinessCard from "../Components/BusinessCard";
import { DollarSign, Users, Trash, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente principal da tela de "Business Board"
const BusinessBoard = () => {
    // State local para gerenciar dados
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

    // useEffect para carregar dados na inicialização
    useEffect(() => {
        fetchData(setBusinesses, setStates, setBusinessTypes, setUsers);
    }, []);

    const handleCreateKeyPress = (event) => {
        if (event.key === "Enter") {
            createState(newStateName, setStates, states, setNewStateName);
        }
    };
    
    const handleRenameKeyPress = (event, id, newName) => {
        if (event.key === "Enter") {
            event.preventDefault();
            renameState(id, newName, states, setStates, setIsRenaming);
            setTimeout(() => event.target.blur(), 50);
        }
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
    
    const handleCreateBusiness = (stateId) => {
        createBusiness(stateId, newBusiness, setBusinesses, setNewBusiness, businesses);
    };
    
    const handleEditBusiness = (id, updatedBusiness) => {
        editBusiness(id, updatedBusiness, setBusinesses);
    };
    
    const handleDeleteBusiness = (businessId) => {
        deleteBusiness(businessId, setBusinesses, businesses);
    };

    const [newUser, setNewUser] = useState({
        name: "",
        email: ""
    });
    
    const handleCreateUser = () => {
        createUser(newUser, setUsers, setNewUser);
    };

    const onDragEnd = (result) => {
        moveBusiness(result, businesses, setBusinesses);
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

            <Header
                filteredBusinesses={filteredBusinesses}
                totalValue={totalValue}
                averageBusinessValue={averageBusinessValue}
                mostPopularState={mostPopularState}
                users={users}
            />

            <FilterByBusinessType
                filteredType={filteredType}
                setFilteredType={setFilteredType}
                businessTypes={businessTypes}
            />

            <CreateUserForm
                newUser={newUser}
                setNewUser={setNewUser}
                handleCreateUser={handleCreateUser}
            />

            <CreateStateForm
                newStateName={newStateName}
                setNewStateName={setNewStateName}
                handleCreateKeyPress={handleCreateKeyPress}
                handleCreateState={() => createState(newStateName, setStates, states, setNewStateName)}
            />

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
