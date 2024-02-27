import FileViewerBlock from "@/src/components/blocks/Groups/fileviewer";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useFetch from "@/src/hooks/general/useFetch";

const getExtension = (filename) => {
  if (!filename || !filename.includes(".")) return "txt";
  return filename.split(".").pop();
};

const DocView = () => {
  const [data, setData] = useState(null);

  const router = useRouter();
  const { id: groupId, name: docName } = router.query;
  console.log(groupId, docName);
  const viewDoc = useFetch({
    method: "GET",
    url: `/api/docs/${groupId}/${docName}/url`,
    get_autoFetch: true,
  });

  useEffect(() => {
    handleView();
  }, []);

  const handleView = async () => {
    const { data, error } = await viewDoc.dispatch();
    if (error) {
      toast.error("Error fetching doc url");
    }
    if (data && window !== undefined) {
      setData(data);
    }
  };

  return (
    <>
      {!data && <p>Loading...</p>}
      {data && <FileViewerBlock url={data} fileType={getExtension(docName)} />}
    </>
  );
};

export default DocView;
