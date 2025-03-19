import { Plus } from "lucide-react";

/**
 * CreateUserForm Component
 *
 * This component provides an input form to create a new Sales Representative.
 *
 * @param {Object} props - Component props
 * @param {Object} props.newUser - The object holding the new user's details (name and email).
 * @param {Function} props.setNewUser - Function to update the new user's details in the state.
 * @param {Function} props.handleCreateUser - Function to handle the creation of a new Sales Representative.
 */
const CreateUserForm = ({ newUser, setNewUser, handleCreateUser }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            
            {/* Header for the user creation section */}
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Create Sales Representative</h3>
            <div className="flex gap-2">

                {/* Input field for the Sales Representative's name */}
                <input
                    type="text"
                    placeholder="Sales Representative Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                />

                {/* Input field for the Sales Representative's email */}
                <input
                    type="email"
                    placeholder="Sales Representative Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="p-2 rounded bg-gray-700 text-gray-200 w-full h-12"
                />

                {/* Button to trigger user creation */}
                <button
                    onClick={handleCreateUser}
                    className="bg-green-500 px-4 py-2 rounded text-white flex items-center h-12 whitespace-nowrap"
                >
                    <Plus size={16} className="mr-2" /> Add Sales Representative
                </button>
            </div>
        </div>
    );
};

export default CreateUserForm;
