import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import {
  MdOutlineDelete,
  MdOutlineDeleteSweep,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

// import { dummyData } from "../dummyData";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedRowsByPage, setSelectedRowsByPage] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const getUsersData = () => {
  //   const data = dummyData;
  //   console.log(data);
  //   return data;
  // };

  useEffect(() => {
    const getUsersData = async () => {
      try {
        const data = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const json = await data.json();
        console.log(json);
        setUsers(json); // Set the users data after fetching
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getUsersData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  {
    /** Function edit row*/
  }
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
  {
    /** Function Save edited row*/
  }
  const handleSave = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, isEditing: false, originalName: "", originalEmail: "" }
          : user
      )
    );
  };

  {
    /** Function for handeling input while editing row content*/
  }
  const handleInputChange = (userId, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };
  {
    /** Function to delete individual row*/
  }
  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  {
    /** Function Select individual row*/
  }
  const handleSelectRow = (rowId) => {
    const updatedSelectedRowsByPage = { ...selectedRowsByPage };

    if (!updatedSelectedRowsByPage[currentPage]) {
      updatedSelectedRowsByPage[currentPage] = [];
    }

    if (updatedSelectedRowsByPage[currentPage].includes(rowId)) {
      updatedSelectedRowsByPage[currentPage] = updatedSelectedRowsByPage[
        currentPage
      ].filter((id) => id !== rowId);
    } else {
      updatedSelectedRowsByPage[currentPage] = [
        ...updatedSelectedRowsByPage[currentPage],
        rowId,
      ];
    }

    setSelectedRowsByPage(updatedSelectedRowsByPage);

    // Check if all rows on the current page are selected
    const allRowsSelectedOnPage =
      updatedSelectedRowsByPage[currentPage].length === paginatedUsers.length;

    // Update selectAll state based on whether all rows on the current page are selected
    setSelectAll(allRowsSelectedOnPage);
  };

  {
    /** Function for Select all rows  */
  }
  const handleSelectAll = () => {
    const allUserIdsOnPage = paginatedUsers.map((user) => user.id);
    const updatedSelectedRowsByPage = { ...selectedRowsByPage };

    if (!selectAll) {
      updatedSelectedRowsByPage[currentPage] = allUserIdsOnPage;
    } else {
      updatedSelectedRowsByPage[currentPage] = [];
    }

    setSelectedRowsByPage(updatedSelectedRowsByPage);
    setSelectAll((selected) => !selected);
  };

  {
    /** Function for Delete multiple Selected rows*/
  }
  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !Object.values(selectedRowsByPage).flat().includes(user.id)
    );

    setUsers(updatedUsers);
    setSelectedRowsByPage({});
    setSelectAll(false);
  };

  const changePage = (page) => {
    setCurrentPage(page);
    setSelectAll(!!selectedRowsByPage[page]?.length);
  };

  return (
    <div className="container mx-auto p-4 ">
      {/** Header part [Searchbox + Bulk/selected Delete Button] */}
      <div className="container px-4 flex justify-between items-center bg-blue-200">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 m-2 border rounded-md"
        />
        <MdOutlineDeleteSweep
          className="bg-red-500 rounded-md text-white p-2 hover:bg-red-800 cursor-pointer"
          onClick={() => {
            handleDeleteSelected();
            // Change page and update selectAll when deleting selected rows
            changePage(currentPage);
          }}
          fontSize={35}
        />
      </div>
      {/** Dashboaord Table */}
      <table className="w-full border-2 ">
        <thead>
          <tr>
            <th className="p-4">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectAll}
                className="h-4 w-4"
              />
            </th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        {/** Dashboaord Table Body */}
        <tbody>
          {paginatedUsers.map((user) => (
            <tr
              key={user.id}
              className={`border-2 ${`hover:bg-gray-100 ${
                selectedRowsByPage[currentPage]?.includes(user.id)
                  ? "bg-gray-200"
                  : ""
              }`} ${user.isEditing && "bg-blue-100"}`}
            >
              <td className="p-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedRowsByPage[currentPage]?.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                  className="h-4 w-4"
                />
              </td>
              <td className="p-4 text-center">
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
              <td className="p-4 text-center">
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
              <td className="p-4 p-4 text-center">
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
              <td className="p-4 text-center">
                {user.isEditing ? (
                  <button
                    className="bg-green-500 rounded-md text-white px-4 py-2 mr-2 hover:bg-green-600"
                    onClick={() => handleSave(user.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="border-2 rounded-md border-gray-300 text-gray-500 px-2 py-1 mr-2 hover:bg-gray-300"
                    onClick={() => handleEdit(user.id)}
                  >
                    <FiEdit />
                  </button>
                )}
                <button
                  className="border-2 rounded-md border-gray-300 text-red-500 px-2 py-1 hover:bg-red-300"
                  onClick={() => handleDelete(user.id)}
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      /// Pagination ///
      <div className="mt-4 flex justify-end items-center">
        <div className="flex">
          <button
            className="border-2 rounded-md border-gray-300 text-gray-500 hover:bg-gray-300 px-2 py-1 mr-2"
            onClick={() => changePage(1)}
          >
            First Page
          </button>
          <button
            className="border-2 rounded-md border-gray-300 text-gray-500 hover:bg-gray-300 px-2 py-1 mr-2"
            onClick={() => changePage(Math.max(currentPage - 1, 1))}
          >
            <MdOutlineKeyboardArrowLeft fontSize={20} />
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`px-2 py-1 ${
                currentPage === page + 1
                  ? "rounded-md bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => changePage(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="border-2 rounded-md border-gray-300 text-gray-500 hover:bg-gray-300 px-2 py-1 mr-2"
            onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
          >
            <MdOutlineKeyboardArrowRight fontSize={20} />
          </button>
          <button
            className="border-2 rounded-md border-gray-300 text-gray-500 hover:bg-gray-300 px-2 py-1"
            onClick={() => changePage(totalPages)}
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
