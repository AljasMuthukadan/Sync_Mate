import { useState } from "react";
import { FaPlus, FaCheckCircle, FaTimesCircle, FaTasks } from "react-icons/fa";

export default function TaskSection({ items, setItems, staff }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "Production",
    quantity: "",
    item: "",
    assignedTo: [],
    assignAll: false,
  });
  const [showForm, setShowForm] = useState(false);

  const addTask = () => {
    if (!newTask.title || !newTask.type) return alert("Fill all fields");

    const assigned = newTask.assignAll ? staff.map(s => s.name) : newTask.assignedTo;

    setTasks([...tasks, { ...newTask, assignedTo: assigned, id: Date.now(), status: "Pending" }]);
    setNewTask({ title: "", type: "Production", quantity: "", item: "", assignedTo: [], assignAll: false });
    setShowForm(false);
  };

  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (t.type === "Production" && t.item && t.quantity) {
            setItems((prevItems) =>
              prevItems.map((it) =>
                it.name === t.item ? { ...it, quantity: it.quantity + parseInt(t.quantity) } : it
              )
            );
          }
          return { ...t, status: "Completed" };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const completedCount = tasks.filter(t => t.status === "Completed").length;

  return (
    <div className="bg-blue-50 p-6 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <FaTasks /> Task Management
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-2xl shadow-md hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Task
          </button>
        )}
      </div>

      {/* New Task Form */}
      {showForm && (
        <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">New Task</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full"
            />
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full"
            >
              <option>Production</option>
              <option>General</option>
            </select>

            {newTask.type === "Production" && (
              <>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newTask.quantity}
                  onChange={(e) => setNewTask({ ...newTask, quantity: e.target.value })}
                  className="border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full"
                />
                <select
                  value={newTask.item}
                  onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                  className="border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full"
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Staff Assignment */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Assign To:</label>
              <select
                multiple
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assignedTo: Array.from(e.target.selectedOptions, option => option.value),
                    assignAll: false
                  })
                }
                className="border border-gray-300 p-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full h-24"
              >
                {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <label className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newTask.assignAll}
                  onChange={(e) => setNewTask({ ...newTask, assignAll: e.target.checked, assignedTo: [] })}
                  className="accent-blue-600"
                />
                Assign to All Staff
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={addTask}
              className="bg-green-600 text-white px-5 py-2 rounded-2xl shadow-md hover:bg-green-700 transition"
            >
              Save Task
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-5 py-2 rounded-2xl shadow-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-700 mb-2 font-medium">
            Progress: {completedCount}/{tasks.length} Completed
          </p>
          <div className="w-full bg-blue-100 h-3 rounded-full">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic text-center col-span-full mt-10">No tasks assigned yet.</p>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                <p className="text-gray-500 text-sm">{task.type} Task</p>
                {task.type === "Production" && (
                  <p className="text-gray-700 text-sm">{task.quantity} × {task.item}</p>
                )}

                {/* Assigned Staff */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.assignedTo.map(st => (
                    <span
                      key={st}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    task.status === "Completed" ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  {task.status}
                </span>
                <div className="flex items-center gap-3">
                  {task.status === "Pending" && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-green-600 hover:text-green-800 transition"
                    >
                      <FaCheckCircle size={22} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTimesCircle size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
