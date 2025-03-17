import axios from "axios";
import { toast } from "react-toastify";

/**
 * Busca os dados iniciais da API.
 */
export const fetchData = async (setBusinesses, setStates, setBusinessTypes, setUsers) => {
    try {
        const [businessRes, stateRes, typeRes, userRes] = await Promise.all([
            axios.get("/api/businesses"),
            axios.get("/api/states"),
            axios.get("/api/business-types"),
            axios.get("/api/users"),
        ]);

        setBusinesses(businessRes.data);
        setStates(stateRes.data);
        setBusinessTypes(typeRes.data);
        setUsers(userRes.data);
    } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data.");
    }
};

/**
 * Cria um novo estado (coluna no board).
 */
export const createState = async (newStateName, setStates, states, setNewStateName) => {
    if (!newStateName || typeof newStateName !== "string" || !newStateName.trim()) {
        toast.error("State name cannot be empty.");
        return;
    }

    try {
        const response = await axios.post("/api/states", { name: newStateName });

        if (response.data && response.data.state) {
            setStates([...states, response.data.state]);
            toast.success("State created successfully!");
        } else {
            fetchData(setStates);
        }

        setNewStateName("");
    } catch (error) {
        toast.error(error.response?.data?.message || "Error creating state.");
    }
};

/**
 * Atualiza o nome de um estado no board.
 */
export const renameState = async (id, newName, states, setStates, setIsRenaming) => {
    if (!newName.trim()) return;

    const currentState = states.find(state => state.id === id);
    if (!currentState || currentState.name === newName) {
        toast.info("No changes were made. The state name remains the same.");
        return;
    }

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

/**
 * Define o estado que será excluído.
 */
export const confirmDeleteState = (id, setStateToDelete) => {
    setStateToDelete(id);
};

/**
 * Exclui um estado do board.
 */
export const deleteState = async (stateToDelete, setStateToDelete, setStates, states) => {
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

/**
 * Cria um novo negócio no estado selecionado.
 */
export const createBusiness = async (stateId, newBusiness, setBusinesses, setNewBusiness, businesses) => {
    const currentBusiness = newBusiness[stateId];

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

/**
 * Edita um negócio existente.
 */
export const editBusiness = async (id, updatedBusiness, setBusinesses) => {
    try {
        const response = await axios.put(`/api/businesses/${id}`, updatedBusiness);

        setBusinesses((prevBusinesses) =>
            prevBusinesses.map((business) =>
                business.id === id ? response.data : business
            )
        );

        toast.success("Business updated successfully!");
    } catch (error) {
        toast.error("Error updating business.");
    }
};

/**
 * Exclui um negócio existente.
 */
export const deleteBusiness = async (businessId, setBusinesses, businesses) => {
    try {
        await axios.delete(`/api/businesses/${businessId}`);
        setBusinesses(businesses.filter((business) => business.id !== businessId));
        toast.success("Business deleted successfully!");
    } catch (error) {
        toast.error("Error deleting business.");
    }
};

/**
 * Cria um novo usuário (Sales Representative).
 */
export const createUser = async (newUser, setUsers, setNewUser) => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error("Please fill in both fields.");
        return;
    }

    try {
        const response = await axios.post("/api/users", newUser);
        toast.success("Sales Representative created successfully!");
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setNewUser({ name: "", email: "" });
    } catch (error) {
        toast.error("Error creating Sales Representative.");
    }
};

/**
 * Atualiza o estado de um negócio ao ser movido entre colunas.
 */
export const moveBusiness = async (result, businesses, setBusinesses) => {
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

            setBusinesses((prevBusinesses) =>
                prevBusinesses.map(b =>
                    b.id.toString() === draggableId ? { ...b, state_id: newStateId } : b
                )
            );

            toast.success("Business moved successfully!");
        } catch (error) {
            toast.error("Error moving business.");
        }
    }
};
