"use client";

import React, { useState, useEffect } from "react";
import { DBTask } from "@/types/admin.types";
import { getLectureTasks, createTask, updateTask, deleteTask } from "@/lib/api/cms";

interface TaskBuilderProps {
  lectureId: string;
  onClose: () => void;
}

export const TaskBuilder: React.FC<TaskBuilderProps> = ({ lectureId, onClose }) => {
  const [tasks, setTasks] = useState<DBTask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating/editing a task
  const [editingTask, setEditingTask] = useState<DBTask | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<DBTask["difficulty"]>("medium");
  const [order, setOrder] = useState(0);

  // Load existing tasks
  const loadTasks = async () => {
    setFetching(true);
    setError(null);
    try {
      const data = await getLectureTasks(lectureId);
      setTasks(data);
    } catch (err: unknown) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureId]);

  const handleEditClick = (task: DBTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDifficulty(task.difficulty);
    setOrder(task.order);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDifficulty("medium");
    setOrder(tasks.length);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      lecture_id: lectureId,
      title,
      description,
      difficulty,
      order,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }
      handleCancelEdit();
      await loadTasks();
    } catch (err: unknown) {
      console.error("[TaskBuilder] Error saving task:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save task.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Tasks...</div>;
  }

  return (
    <div className="space-y-6 select-text max-h-[85vh] flex flex-col overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div>
          <h4 className="text-base font-extrabold text-slate-900">Task Builder</h4>
          <p className="text-slate-500 text-xs font-semibold">Manage coding challenges and practical exercises.</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl shrink-0">
          {error}
        </div>
      )}

      {/* Two Column Layout: Left forms, Right list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-hidden">
        
        {/* Task Form */}
        <form onSubmit={handleSave} className="space-y-4 border-r border-slate-100 pr-6 overflow-y-auto">
          <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h5>

          {/* Title */}
          <div className="space-y-1.5 font-medium">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Scanner Loop"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 font-medium">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Task Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed coding tasks and steps..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-slate-900 focus:outline-hidden resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DBTask["difficulty"])}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-slate-900 focus:outline-hidden"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {editingTask && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              {loading ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-4 overflow-y-auto">
          <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Active Tasks ({tasks.length})</h5>

          {tasks.length === 0 ? (
            <div className="text-center py-10 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              No tasks declared for this lecture.
            </div>
          ) : (
            <div className="space-y-3 pr-2">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/30 flex items-start justify-between gap-4">
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 truncate">{task.title}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        task.difficulty === "easy"
                          ? "bg-emerald-50 text-emerald-700"
                          : task.difficulty === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {task.difficulty}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs truncate max-w-xs font-medium">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleEditClick(task)}
                      disabled={loading}
                      className="text-xs font-bold text-[#219EBC] hover:text-[#219EBC]/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={loading}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
