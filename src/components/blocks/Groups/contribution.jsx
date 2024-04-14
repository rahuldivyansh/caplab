import useFetch from "@/src/hooks/general/useFetch";
import React, { useEffect, useMemo, useState } from "react";
import Table from "../../ui/Table";

const col = [
  { key: "name", placeholder: "Name" },
  { key: 0, placeholder: "TODO" },
  { key: 1, placeholder: "In Progress" },
  { key: 3, placeholder: "Completed" },
];
const Contribution = ({ groupId }) => {

  const members = useFetch({
    method: "GET",
    url: `/api/members/${groupId}`,
    get_autoFetch: true,
  });
  const status = useFetch({
    method: "GET",
    url: `/api/status/${groupId}`,
    get_autoFetch: true,
  });
  const dataset = useMemo(() => {
    if (!members.data || !status.data) return [];
    const membersMap = members.data.reduce((acc, curr) => {
      acc[curr.uid] = curr;
      return acc;
    }, {});
    const statusMap = status.data.reduce((acc, curr) => {
      acc[curr.uid] = curr;
      return acc;
    }, {});
  }, [members.data, status.data]);
  return <Table cols={col} dataset={dataset || []} />;
};

export default Contribution;
