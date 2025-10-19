import React from 'react';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const BlogTableItem = ({ blog, index, onUpdate }) => {

  const deleteBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('User not authenticated');

      const { data } = await axios.post(
        '/api/admin/delete',
        { id: blog._id },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success(data.message);
        onUpdate(); // refresh parent
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('User not authenticated');

      const { data } = await axios.post(
        '/api/admin/publish-toggle',
        { id: blog._id },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success(data.message);
        onUpdate(); // refresh parent
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{blog.title}</td>
      <td className="px-2 py-4 max-sm:hidden">{new Date(blog.createdAt).toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p className={blog.isPublished ? 'text-green-600' : 'text-orange-700'}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublish}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          className="w-8 hover:scale-110 transition-all cursor-pointer"
          alt="delete"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
