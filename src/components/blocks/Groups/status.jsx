import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DashboardGroupsStatusBlock = () => {
  const router = useRouter();
  const { group_id } = router.query;

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/status/${group_id}`, {
        params: {
          group_id: group_id,
        },
      });

      console.log("Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [group_id]);

  return <>status
  </>;
};

export default DashboardGroupsStatusBlock;
