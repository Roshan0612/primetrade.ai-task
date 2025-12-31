'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiCall } from '@/lib/api';
import type { Task } from '@/types';
import Link from 'next/link';

export const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError('');

      let url = '/tasks?limit=10';
      if (status) url += `&status=${status}`;
      if (priority) url += `&priority=${priority}`;

      const response = await apiCall<{ data: Task[] }>(url);
      setTasks(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [status, priority]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex justify-between items-center mb-6 fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
        <Link
          href="/dashboard/tasks/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition card-float"
        >
          + New Task
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={handlePriorityChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
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
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task._id}
              href={`/dashboard/tasks/${task._id}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition cursor-pointer fade-in-up card-float"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
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
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
