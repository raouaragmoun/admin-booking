import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({columns}) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);

  const { data, loading, error } = useFetch(`http://localhost:8800/api/${path}`);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      // Handle error state or show an error message to the user
    } else {
      setList(data || []); // Ensure data is not undefined
    }
  }, [data, error]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/${path}/${id}`);
      setList((prevList) => prevList.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      // Handle delete error if needed
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">

      {/* Utilisez le lien dynamique avec l'ID de l'élément */}
        <Link to={`/${path}/${params.row._id}`}>
            <div className="editButton">Edit</div>
          </Link>
          {/* <Link to="/rooms" >
            <div className="viewButton">Edit</div>
            </Link> */}

            
          <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
            Delete
          </div>
          
        </div>
      ),
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
       {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      {list && (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;

// userColumns et les autres imports restent les mêmes.
