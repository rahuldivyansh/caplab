import useFetch from "@/src/hooks/general/useFetch";
import React, { useEffect, useMemo, useState } from "react";
import Table from "../../ui/Table";

const Contribution = ({ groupId }) => {
  const col = [
    { key: "name", placeholder: "Name" },
    { key: 0, placeholder: "TODO" },
    { key: 1, placeholder: "In Progress" },
    { key: 3, placeholder: "Completed" },
  ];
  const [fetchData, setFetchData] = useState([]);
  const data = useFetch({
    method: "GET",
    url: `/api/contributions/${groupId}`,
    get_autoFetch: true,
  });
  useEffect(() => {
    if (data.data) {
      setFetchData(data.data);
    }
  }, [data]);
  let statusHashMap = {};
  const statusInfo = useMemo(() => {
    if (!fetchData || !fetchData.membersData || !fetchData.statusData || !fetchData.allStatusAssignees) {
      return [];
    }
    let allStatus = {};
    if ( fetchData.membersData) {
        fetchData.membersData.map((member) => {
          allStatus[member.uid] = {
            name: member.users.name,
            0: 0,
            1: 0,
            3: 0,
          };
        })
      fetchData.statusData.map((status) => {
        statusHashMap[status.id] = status.type;
      })
    }
    if (fetchData.allStatusAssignees) {
      console.log(fetchData.allStatusAssignees)
        fetchData.allStatusAssignees.map((assignee) => {
          // assignee.map(a =>console.log(a));
          // console.log(assignee)
          console.log(assignee.status);
            let getType = statusHashMap[assignee.status];
            console.log(getType);
            if(getType){
              allStatus[assignee.member][getType] += 1;
            }
        })
    }
    return allStatus;
  }, [fetchData]);
  console.log(Object.values(statusInfo))
  return <Table cols={col} dataset={Object.values(statusInfo)} />;
};

export default Contribution;
