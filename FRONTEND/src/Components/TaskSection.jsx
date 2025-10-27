import { useState } from "react";
import {
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaTasks,
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskSection_AvatarGrid_v3_5({ items, setItems, staff }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    type: "Production",
    quantity: "",
    item: "",
    assignedTo: [],
    assignAll: false,
    priority: "Normal",
  });

  const toggleAssign = (name) => {
    setNewTask((prev) => {
      const updated = prev.assignedTo.includes(name)
        ? prev.assignedTo.filter((n) => n !== name)
        : [...prev.assignedTo, name];
      return { ...prev, assignedTo: updated, assignAll: false };
    });
  };

  const addTask = () => {
    if (!newTask.title) return alert("Please fill all fields");
    const assigned = newTask.assignAll ? staff.map((s) => s.name) : newTask.assignedTo;
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        assignedTo: assigned,
        id: Date.now(),
        status: "Pending",
        createdAt: new Date().toLocaleString(),
      },
    ]);
    setNewTask({
      title: "",
      type: "Production",
      quantity: "",
      item: "",
      assignedTo: [],
      assignAll: false,
      priority: "Normal",
    });
    setShowForm(false);
  };

  const completeTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === id) {
          // Update items only on click event, not during render
          if (t.type === "Production" && t.item && t.quantity) {
            setTimeout(() => {
              setItems((prevItems) =>
                prevItems.map((it) =>
                  it.name === t.item
                    ? { ...it, quantity: it.quantity + parseInt(t.quantity) }
                    : it
                )
              );
            }, 0); // run after render safely
          }
          return { ...t, status: "Completed" };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const filteredTasks = tasks.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const priorityColors = {
    High: "text-red-600 bg-red-100",
    Normal: "text-blue-600 bg-blue-100",
    Low: "text-green-600 bg-green-100",
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-3xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          <FaTasks /> Task Management
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border pl-10 border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-2xl hover:bg-blue-800 shadow-md"
            >
              <FaPlus /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-blue-200 p-6 rounded-2xl shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option>Production</option>
              <option>General</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            >
              <option>Normal</option>
              <option>High</option>
              <option>Low</option>
            </select>

            {newTask.type === "Production" && (
              <>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newTask.quantity}
                  onChange={(e) => setNewTask({ ...newTask, quantity: e.target.value })}
                  className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={newTask.item}
                  onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                  className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Item</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.name}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Staff Assignment */}
          <div className="mt-5">
            <label className="font-medium text-gray-700 mb-3 block">Assign To Staff:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {staff.map((s) => {
                const isSelected = newTask.assignedTo.includes(s.name);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleAssign(s.name)}
                    className={`cursor-pointer border-2 p-3 rounded-xl flex flex-col items-center transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-100 shadow-md"
                        : "border-gray-200 hover:border-blue-300 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.name[0]}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-2">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.role || "Staff"}</p>
                  </div>
                );
              })}
            </div>

            <label className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={newTask.assignAll}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignAll: e.target.checked, assignedTo: [] })
                }
                className="accent-blue-600"
              />
              Assign to All Staff
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addTask}
              className="bg-green-600 text-white px-5 py-2 rounded-2xl hover:bg-green-700"
            >
              Save Task
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-5 py-2 rounded-2xl hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-700 mb-2 font-medium">
            Progress: {completedCount}/{tasks.length} Completed
          </p>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              className="bg-blue-600 h-3"
            ></motion.div>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                  <p className="text-gray-500 text-sm">{task.type}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {task.type === "Production" && (
                <p className="text-gray-700 text-sm mt-1">
                  {task.quantity} × {task.item}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {task.assignedTo.map((st) => (
                  <span
                    key={st}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {st}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    task.status === "Completed" ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  {task.status}
                </span>
                <div className="flex items-center gap-3">
                  {task.status === "Pending" && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaCheckCircle size={22} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimesCircle size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
