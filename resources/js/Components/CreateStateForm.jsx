import { Plus } from "lucide-react";

const CreateStateForm = ({ newStateName, setNewStateName, handleCreateKeyPress, handleCreateState }) => {
    return (
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
