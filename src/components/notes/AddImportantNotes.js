import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEmail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/contact/all-contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCall = (mobile) => {
    window.location.href = `tel:${mobile}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Get current contacts based on pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Handle pagination
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-semibold mb-4">Contact List</h1>

      {loading && (
        <div className="text-center text-lg font-bold mt-10">
          Loading...
        </div>
      )}

      {!loading && currentContacts.length > 0 ? (
        <>
          <table className="min-w-full border-collapse block md:table rounded-md shadow-md border overflow-hidden">
            <thead className="block md:table-header-group bg-gray-700 text-white">
              <tr className="border border-gray-200 md:border-none md:table-row">
                <th className="block md:table-cell p-3 font-semibold text-left">Name</th>
                <th className="block md:table-cell p-3 font-semibold text-left">Email</th>
                <th className="block md:table-cell p-3 font-semibold text-left">Country</th>
                <th className="block md:table-cell p-3 font-semibold text-left">Mobile</th>
                <th className="block md:table-cell p-3 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {currentContacts.map((contact, index) => (
                <tr
                  key={contact._id}
                  className={`border-gray-200 border table-row ${index === currentContacts.length - 1 ? '' : 'border-b'
                    }`}
                >
                  <td className="block md:table-cell p-3">{contact.name}</td>
                  <td className="block md:table-cell p-3">{contact.email}</td>
                  <td className="block md:table-cell p-3">{contact.country}</td>
                  <td className="block md:table-cell p-3">{contact.mobile}</td>
                  <td className="block md:table-cell p-3 space-x-4">
                    <button
                      className="p-2 bg-blue-600 text-white rounded-md"
                      onClick={() => handleCall(contact.mobile)}
                    >
                      <FiPhoneCall size={20} />
                    </button>
                    <button
                      className="p-2 bg-green-600 text-white rounded-md"
                      onClick={() => handleEmail(contact.email)}
                    >
                      <MdEmail size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center text-lg font-bold mt-10">
            No contacts found
          </div>
        )
      )}
    </div>
  );
}

export default ContactList;
