import { Plus } from "lucide-react";

/**
 * CreateStateForm Component
 *
 * This component provides an input field and a button to create a new state (column) in the business board.
 *
 * @param {Object} props - Component props
 * @param {string} props.newStateName - The name entered for the new state.
 * @param {Function} props.setNewStateName - Function to update the state name input value.
 * @param {Function} props.handleCreateKeyPress - Function to handle pressing "Enter" to create a state.
 * @param {Function} props.handleCreateState - Function to handle creating a new state when clicking the button.
 */
const CreateStateForm = ({ newStateName, setNewStateName, handleCreateKeyPress, handleCreateState }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            
            {/* Header for the state creation section */}
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Create State</h3>
            <div className="flex gap-2">

                {/* Input field for entering a new state name */}
                <input
                    type="text"
                    placeholder="New State Name"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    onKeyDown={handleCreateKeyPress}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                />

                {/* Button to trigger state creation */}
                <button
                    onClick={handleCreateState}
                    className="bg-blue-500 px-4 py-2 rounded text-white flex items-center h-12 whitespace-nowrap"
                >
                    <Plus size={16} className="mr-2" /> Add State
                </button>
            </div>
        </div>
    );
};

export default CreateStateForm;
