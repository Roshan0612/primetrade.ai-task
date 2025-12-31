'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiCall } from '@/lib/api';
import type { Task } from '@/types';
import Link from 'next/link';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError('');

      let url = `/tasks?limit=20&page=${pageNum}`;
      if (status) url += `&status=${status}`;
      if (priority) url += `&priority=${priority}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await apiCall<{ data: Task[]; pagination: any }>(url);
      setTasks(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setPage(pageNum);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1);
  }, [status, priority, search, loadTasks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        <Link
          href="/dashboard/tasks/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          + New Task
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Search tasks..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => loadTasks(1)}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks found. Create one to get started!</p>
          <Link
            href="/dashboard/tasks/create"
            className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
          >
            Create your first task
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task._id}
                href={`/dashboard/tasks/${task._id}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => loadTasks(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 font-medium rounded-lg transition"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => loadTasks(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 font-medium rounded-lg transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
