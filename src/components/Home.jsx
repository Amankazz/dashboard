import React, { useState, useEffect } from "react";
import { dummyData } from "../dummyData";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // New state to track whether all rows are selected
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //   const getUsersData = async () => {
  //     const data = await fetch(
  //       "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  //     );
  //     const json = await data.json();
  //     console.log(json);
  //   };

  const getUsersData = () => {
    const data = dummyData;
    console.log(data);
    return data;
  };

  useEffect(() => {
    const userData = getUsersData();
    setUsers(userData);
  }, []);

  // Filtered and paginated users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Paginate the users based on the current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const handleEdit = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              isEditing: true,
              originalName: user.name,
              originalEmail: user.email,
            }
          : user
      )
    );
  };

  const handleSave = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, isEditing: false, originalName: "", originalEmail: "" }
          : user
      )
    );
  };

  const handleInputChange = (userId, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  //////
  const handleSelectAll = () => {
    const startId = (currentPage - 1) * itemsPerPage + 1;
    const endId = Math.min(currentPage * itemsPerPage, users.length);

    // Get all IDs on the current page
    const pageIds = Array.from(
      { length: endId - startId + 1 },
      (_, index) => startId + index
    );
    console.log("pageIds", pageIds);

    // Check if all rows on the current page are already selected
    const allSelected = pageIds.every((id) => selectedRows.includes(id));
    console.log("allSelected", allSelected);

    if (allSelected) {
      setSelectedRows(selectedRows.filter((id) => !pageIds.includes(id)));
      setSelectAll(false); // Unselect all when not all rows are selected
    } else {
      setSelectedRows([...selectedRows, ...pageIds]);
      setSelectAll(true); // Select all when not all rows are selected
    }
    console.log("selectedRows", selectedRows);
  };

  // Handle delete selected rows
  // const handleDeleteSelected = () => {
  //   const updatedUsers = users.filter(
  //     (user) => !selectedRows.includes(user.id)
  //   );
  //   setUsers(updatedUsers);
  //   setSelectedRows([]);
  //   setSelectAll(false); // Unselect all after deleting selected rows
  //   updateRowIds(); // Update the IDs of the rows
  // };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
    setSelectAll(false);
  };

  // Update the IDs of the rows
  const updateRowIds = () => {
    const updatedUsers = users.map((user, index) => ({
      ...user,
      id: index + 1,
    }));
    setUsers(updatedUsers);
  };
  //////

  return (
    <div className="container mx-auto p-4 bg-gray-500">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border rounded"
      />
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? "bg-gray-300" : ""}
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                />
              </td>
              <td className="p-2">
                {user.isEditing ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      handleInputChange(user.id, "name", e.target.value)
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-2">
                {user.isEditing ? (
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      handleInputChange(user.id, "email", e.target.value)
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-2">
                {user.isEditing ? (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleInputChange(user.id, "role", e.target.value)
                    }
                  >
                    <option value="Admin">admin</option>
                    <option value="User">member</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="p-2">
                {user.isEditing ? (
                  <button
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                    onClick={() => handleSave(user.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 mr-2"
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      // Pagination footer //
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            className="bg-blue-500 text-white px-2 py-1 mr-2"
            onClick={() => setCurrentPage(1)}
          >
            First Page
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 mr-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous Page
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`px-2 py-1 ${
                currentPage === page + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="bg-blue-500 text-white px-2 py-1 mr-2"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next Page
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1"
            onClick={() => setCurrentPage(totalPages)}
          >
            Last Page
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-2 py-1"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default Home;
