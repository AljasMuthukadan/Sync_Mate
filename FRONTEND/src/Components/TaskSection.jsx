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
          if (t.type === "Production" && t.item && t.quantity) {
            setTimeout(() => {
              setItems((prevItems) =>
                prevItems.map((it) =>
                  it.name === t.item
                    ? { ...it, quantity: it.quantity + parseInt(t.quantity) }
                    : it
                )
              );
            }, 0);
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
    High: "text-red-600 bg-red-100 border border-red-200",
    Normal: "text-blue-600 bg-blue-100 border border-blue-200",
    Low: "text-green-600 bg-green-100 border border-green-200",
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 rounded-sm shadow-lg border border-blue-100 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-semibold text-blue-800 flex items-center gap-3 tracking-tight">
          <FaTasks className="text-blue-600" /> Task Management
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 bg-white/80 backdrop-blur-sm pl-10 rounded-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-400 shadow-sm"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-sm hover:shadow-lg transition-all duration-200"
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
          className="bg-white/80 backdrop-blur-md border border-blue-100 p-6 rounded-2xl shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-sm focus:ring-2 focus:ring-blue-400 bg-white/70"
            />
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              className="border border-gray-300 p-3 rounded-sm focus:ring-2 focus:ring-blue-400 bg-white/70"
            >
              <option>Production</option>
              <option>General</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="border border-gray-300 p-3 rounded-sm focus:ring-2 focus:ring-blue-400 bg-white/70"
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
                  className="border border-gray-300 p-3 rounded-sm focus:ring-2 focus:ring-blue-400 bg-white/70"
                />
                <select
                  value={newTask.item}
                  onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                  className="border border-gray-300 p-3 rounded-sm focus:ring-2 focus:ring-blue-400 bg-white/70"
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
                    className={`cursor-pointer border-2 p-3 rounded-md flex flex-col items-center transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-100/80 shadow-sm"
                        : "border-gray-200 bg-white/60 hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                        isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
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
              <span className="text-gray-700">Assign to All Staff</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-md hover:shadow-md transition"
            >
              Save Task
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
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
              className="bg-gradient-to-r from-blue-500 to-blue-700 h-3"
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
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                  <p className="text-gray-500 text-sm">{task.type}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
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
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
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
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
