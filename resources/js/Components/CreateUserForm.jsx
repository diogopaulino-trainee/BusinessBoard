import { Plus } from "lucide-react";

const CreateUserForm = ({ newUser, setNewUser, handleCreateUser }) => {
    return (
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
