import axios from "axios";
import { toast } from "react-toastify";

/**
 * Fetch initial data from the API.
 * 
 * Retrieves businesses, states, business types, and users 
 * and updates the corresponding state variables.
 */
export const fetchData = async (setBusinesses, setStates, setBusinessTypes, setUsers) => {
    try {
        // Fetch all required data concurrently
        const [businessRes, stateRes, typeRes, userRes] = await Promise.all([
            axios.get("/api/businesses"),
            axios.get("/api/states"),
            axios.get("/api/business-types"),
            axios.get("/api/users"),
        ]);

        // Update state variables with fetched data
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
 * Create a new state (column in the board).
 * 
 * This function validates the new state name, sends a request to the API to create the state,
 * updates the state list, and displays a success or error message.
 *
 * @param {string} newStateName - The name of the new state.
 * @param {Function} setStates - Function to update the states list.
 * @param {Array} states - Current list of states.
 * @param {Function} setNewStateName - Function to reset the state input field.
 */
export const createState = async (newStateName, setStates, states, setNewStateName) => {
    
    // Validate input to ensure the state name is not empty
    if (!newStateName || typeof newStateName !== "string" || !newStateName.trim()) {
        toast.error("State name cannot be empty.");
        return;
    }

    try {
        // Send a request to create the new state
        const response = await axios.post("/api/states", { name: newStateName });

        // Check if the response contains the created state
        if (response.data && response.data.state) {
            // Update the states list with the new state
            setStates([...states, response.data.state]);
            toast.success("State created successfully!");
        } else {
            // Fetch the updated state list in case of an issue
            fetchData(setStates);
        }

        // Reset the input field
        setNewStateName("");
    } catch (error) {
        // Display error message if the creation fails
        toast.error(error.response?.data?.message || "Error creating state.");
    }
};

/**
 * Rename an existing state.
 * 
 * This function updates the name of a state, ensuring it is not left empty and 
 * that it differs from the current name. It sends an API request to update the 
 * state and updates the local state list accordingly.
 * 
 * @param {number} id - The ID of the state to rename.
 * @param {string} newName - The new name for the state.
 * @param {Array} states - The list of existing states.
 * @param {Function} setStates - Function to update the states list.
 * @param {Function} setIsRenaming - Function to manage the renaming state.
 */
export const renameState = async (id, newName, states, setStates, setIsRenaming) => {
    
    // Validate input: Ensure the new name is not empty
    if (!newName.trim()) return;

    // Find the state to be renamed
    const currentState = states.find(state => state.id === id);
    
    // If no state is found or the name is unchanged, notify the user
    if (!currentState || currentState.name === newName) {
        toast.info("No changes were made. The state name remains the same.");
        return;
    }

    // Indicate renaming is in progress
    setIsRenaming(true);

    try {
        // Send API request to update the state name
        const response = await axios.put(`/api/states/${id}`, { name: newName });

        // Update the local states list with the new name
        setStates(states.map(state => (state.id === id ? { ...state, name: newName } : state)));

        // Show success message
        toast.success(response.data.message || "State name updated!");
    } catch (error) {
        // Handle errors
        toast.error("Error updating state.");
    }

    // Reset renaming state after a short delay
    setTimeout(() => setIsRenaming(false), 100);
};

/**
 * Set the state to be deleted.
 * 
 * This function sets the state ID that is marked for deletion. 
 * It is typically used to trigger a confirmation modal before 
 * actually deleting the state.
 * 
 * @param {number} id - The ID of the state to be deleted.
 * @param {Function} setStateToDelete - Function to update the state to be deleted.
 */
export const confirmDeleteState = (id, setStateToDelete) => {
    setStateToDelete(id);
};

/**
 * Delete a state from the board.
 * 
 * This function removes a state from the board if it is not associated 
 * with any businesses. If deletion is successful, it updates the state list.
 * 
 * @param {number} stateToDelete - The ID of the state to be deleted.
 * @param {Function} setStateToDelete - Function to reset the state to be deleted after removal.
 * @param {Function} setStates - Function to update the list of states after deletion.
 * @param {Array} states - The current list of states.
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
 * Create a new business in the selected state.
 * 
 * This function validates the input data and sends a request to create 
 * a new business under a specified state. Upon success, it updates 
 * the list of businesses and resets the form fields.
 * 
 * @param {number} stateId - The ID of the state where the business will be created.
 * @param {Object} newBusiness - The object containing the details of the new business.
 * @param {Function} setBusinesses - Function to update the business list after creation.
 * @param {Function} setNewBusiness - Function to reset the input fields after creation.
 * @param {Array} businesses - The current list of businesses.
 */
export const createBusiness = async (stateId, newBusiness, setBusinesses, setNewBusiness, businesses) => {
    const currentBusiness = newBusiness[stateId];

    // Validate required fields before submitting
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
        // Send a POST request to create the new business
        const response = await axios.post("/api/businesses", {
            ...currentBusiness,
            state_id: stateId,
        });

        // Update the business list with the new entry
        setBusinesses([...businesses, response.data]);
        toast.success("Business created successfully!");

        // Reset the input fields for new business creation
        setNewBusiness((prev) => ({
            ...prev,
            [stateId]: { name: "", business_type_id: "", value: "" },
        }));
    } catch (error) {
        toast.error("Error creating business.");
    }
};

/**
 * Edit an existing business.
 * 
 * This function updates a business's details in the system by sending a 
 * PUT request to the API. It then updates the local state with the 
 * modified business information.
 * 
 * @param {number} id - The ID of the business to be updated.
 * @param {Object} updatedBusiness - The object containing updated business data.
 * @param {Function} setBusinesses - Function to update the business list in the state.
 */
export const editBusiness = async (id, updatedBusiness, setBusinesses) => {
    try {
        // Send a PUT request to update the business details
        const response = await axios.put(`/api/businesses/${id}`, updatedBusiness);

        // Update the business list with the modified entry
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
 * Delete an existing business.
 * 
 * This function removes a business from the system by sending a DELETE request 
 * to the API. After a successful deletion, the business is also removed from 
 * the local state to keep the UI in sync.
 * 
 * @param {number} businessId - The ID of the business to be deleted.
 * @param {Function} setBusinesses - Function to update the business list in the state.
 * @param {Array} businesses - The current list of businesses.
 */
export const deleteBusiness = async (businessId, setBusinesses, businesses) => {
    try {
        // Send DELETE request to remove the business from the API
        await axios.delete(`/api/businesses/${businessId}`);
        
        // Update the state by removing the deleted business
        setBusinesses(businesses.filter((business) => business.id !== businessId));
        toast.success("Business deleted successfully!");
    } catch (error) {
        toast.error("Error deleting business.");
    }
};

/**
 * Create a new user (Sales Representative).
 * 
 * This function registers a new sales representative by sending a POST request
 * to the API. If successful, the new user is added to the list of users and 
 * the input fields are reset.
 * 
 * @param {Object} newUser - The user object containing name and email.
 * @param {Function} setUsers - Function to update the users list in the state.
 * @param {Function} setNewUser - Function to reset the user input fields.
 */
export const createUser = async (newUser, setUsers, setNewUser) => {
    // Validate input fields
    if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error("Please fill in both fields.");
        return;
    }

    try {
        // Send POST request to create the user
        const response = await axios.post("/api/users", newUser);
        
        // Show success message
        toast.success("Sales Representative created successfully!");
        
        // Update the users list with the new user
        setUsers((prevUsers) => [...prevUsers, response.data]);
        
        // Reset input fields
        setNewUser({ name: "", email: "" });
    } catch (error) {
        toast.error("Error creating Sales Representative.");
    }
};

/**
 * Move a business between states when dragged.
 *
 * @param {Object} result - The result object from the drag-and-drop action.
 * @param {Array} businesses - The list of businesses.
 * @param {Function} setBusinesses - Function to update the businesses state.
 */
export const moveBusiness = async (result, businesses, setBusinesses) => {
    const { source, destination, draggableId } = result;

    // Check if the business was dropped in a valid destination
    if (!destination) return;

    // Ensure the business was moved to a different state
    if (source.droppableId !== destination.droppableId) {
        // Find the business that was moved
        const movedBusiness = businesses.find(b => b.id.toString() === draggableId);
        const newStateId = parseInt(destination.droppableId, 10);

        try {
            // Send a request to update the business state in the backend
            await axios.put(`/api/businesses/${draggableId}`, {
                ...movedBusiness,
                state_id: newStateId,
            });

            // Update the business list in the frontend state
            setBusinesses((prevBusinesses) =>
                prevBusinesses.map(b =>
                    b.id.toString() === draggableId ? { ...b, state_id: newStateId } : b
                )
            );

            // Notify the user that the move was successful
            toast.success("Business moved successfully!");
        } catch (error) {
            // Show an error message if the move fails
            toast.error("Error moving business.");
        }
    }
};
