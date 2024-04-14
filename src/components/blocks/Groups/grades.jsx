import React, { useEffect, useState } from "react";
import useFetch from "@/src/hooks/general/useFetch";
import { LoaderElement } from "@/src/components/elements/Loaders";
import EmptyElement from "@/src/components/elements/Empty";
import { useAuth } from "@/src/providers/Auth";
import { useGroup } from "@/src/providers/Group";
import Input from "../../ui/Form/Input";
import { toast } from "react-toastify";

const GradesBlock = (props) => {
  const getGrades = useFetch({
    method: "GET",
    url: `/api/grades/${props.groupId}`,
    get_autoFetch: true,
  });
  const updateGrades = useFetch({
    method: "PUT",
    url: `/api/grades/${props.groupId}`,
  });
  const columns = [
    { key: "name", placeholder: "Name" },
    { key: "mid_term", placeholder: "Mid Term" },
    { key: "end_term", placeholder: "End Term" },
  ];
  const auth = useAuth();
  const group = useGroup();
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [editedData, setEditData] = useState([]);
  useEffect(() => {
    setEditData(getGrades);
  }, [getGrades.data]);
  const handleEdit = (index) => {
    setEditableRowIndex(index);
  };

  const handleSave = (index) => {
    setEditableRowIndex(null);
    const res = updateGrades.dispatch(editedData);
    if (res) {
      toast.success("marks updated successfully");
    }
  };

  const handleChange = (key, value, index) => {
    const updatedData = [...editedData.data];
    updatedData[index] = { ...updatedData[index], [key]: value };
    const updatedEditedData = { ...editedData, data: updatedData };
    setEditData(updatedEditedData);
  };
  if (editedData.loading) return <LoaderElement />;
  if (editedData.error) return <div>error loading members</div>;
  if (!editedData.data) return <EmptyElement />;
  return (
    <table className="w-full table-fixed text-sm divide-y divide-dark_secondary">
      <thead>
        <tr className="py-3 bg-dark_secondary/50">
          <th className="text-left">Name</th>
          {columns.slice(1).map((item, index) => (
            <th key={index + 1} className="text-left">
              {item.placeholder}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editedData.data.map((item, index) => (
          <tr key={index} className="capitalize">
            <td>{item.name}</td>
            {columns.slice(1).map((col, colIdx) => (
              <td key={colIdx} className="py-2">
                {editableRowIndex === index ? (
                  <input
                    type="number"
                    value={editedData[index]?.[col.key] || item[col.key]}
                    onChange={(e) =>
                      handleChange(col.key, e.target.value, index)
                    }
                    min={0}
                    max={100}
                  />
                ) : (
                  item?.[col.key]
                )}
              </td>
            ))}
            {auth.data.id === group.owner && (
              <td>
                {editableRowIndex === index ? (
                  <button onClick={() => handleSave(index)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>Edit</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GradesBlock;
