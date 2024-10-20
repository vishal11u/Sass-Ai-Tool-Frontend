import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@mui/material';
import { BsStars } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('https://ecommerce-backend-three-eta.vercel.app/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false); 
    }
  };

  const addNote = async () => {
    setLoading(true); 
    try {
      await axios.post('https://ecommerce-backend-three-eta.vercel.app/api/notes', { message: newNote });
      setNewNote('');
      fetchNotes();
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false); 
    }
  };

  const updateNote = async () => {
    setLoading(true); 
    try {
      await axios.put(`https://ecommerce-backend-three-eta.vercel.app/api/notes/${editNoteId}`, { message: editNoteText });
      setEditNoteId(null);
      setEditNoteText('');
      fetchNotes();
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setLoading(false); 
    }
  };

  const deleteNote = async (id) => {
    setLoading(true); 
    try {
      await axios.delete(`https://ecommerce-backend-three-eta.vercel.app/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewNote('');
    setEditNoteId(null);
    setEditNoteText('');
  };

  return (
    <div className="px-4">
      <h1 className="text-2xl font-semibold mb-2">Notes</h1>
      <button
        type="button"
        className="flex items-center rounded-md bg-indigo-600 text-white py-2 px-4 mb-4 shadow-lg hover:bg-indigo-700 transition"
        onClick={handleOpenModal}
      >
        <BsStars size={20} className="mr-2" />
        Add Notes
      </button>

      {loading && (
        <div className="text-center text-lg font-bold mt-10">
          Loading...
        </div>
      )}

      {!loading && notes?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-white border rounded-lg shadow-md h-[290px] overflow-y-auto w-[100%] transition-all hover:scale-[1.02]">
              <div className="overflow-y-auto">
                <div className='flex items-center justify-end space-x-3 -mt-0 bg-indigo-500 py-2 px-4'>
                  <button type='button' className='p-1 bg-blue-600 text-white rounded-md'
                    onClick={() => {
                      setEditNoteId(note._id);
                      setEditNoteText(note.message);
                      setModalOpen(true)
                    }}
                  >
                    <MdOutlineEdit size={21} />
                  </button>
                  <button type='button' className='p-1 rounded-md bg-red-500 text-white'
                    onClick={() => deleteNote(note._id)}
                  >
                    <MdOutlineDelete size={21} />
                  </button>
                </div>
                <h2 className="text-[15px] font-semibold mt-1.5 px-3.5">{note.message}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center text-lg font-bold mt-10">
            No notes yet
          </div>
        )
      )}

      <Modal open={modalOpen}>
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto mt-[15%]">
          <h2 className="text-xl font-bold mb-2">{editNoteId ? 'Edit Note' : 'Add New Note'}</h2>
          {!editNoteId && (
            <div className="mb-2 text-right">
              <textarea
                name="description"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add new note"
                required
                className="border border-gray-300 rounded-md px-3 py-2 h-36 mb-2 w-full"
              />
              <div className='space-x-3 flex items-center justify-end'>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={addNote}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          {editNoteId && (
            <div className="mb-2 text-right">
              <textarea
                name="description"
                placeholder="Edit note"
                value={editNoteText}
                onChange={(e) => setEditNoteText(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 h-36 mb-2 w-full"
              />
              <div className='flex items-center justify-end space-x-2'>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  onClick={updateNote}
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Notes;
