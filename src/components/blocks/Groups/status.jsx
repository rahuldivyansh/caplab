import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Layout from "../../ui/Layout";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import useFetch from "@/src/hooks/general/useFetch";
import Modal from "../../ui/Modal";
import ListBox from "../../ui/ListBox";

const DashboardGroupsStatusBlock = () => {
  const router = useRouter();
  const { id: group_id } = router.query;
  const [tasks, setTasks] = useState([]);
  const task = useFetch({
    url: `/api/status/${group_id}`,
    method: "GET",
    get_autoFetch: true,
  });
  const [currentTodo, setCurrentTodo] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/status/${group_id}`);
      const data = await response.data;
      setTasks(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (group_id, task) => {
    setCurrentTodo(task);
  };

  return (
    <Layout.Grid className="p-3 justify-between space-x-2 bg-gray-50 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 ">
      <Modal open={currentTodo !== null} onClose={() => setCurrentTodo(null)}>
        {currentTodo && (
          <Layout.Col className="space-y-6 h-screen">
            <Layout.Col>
              <Typography.Heading>{currentTodo.title}</Typography.Heading>
              <Typography.Heading>{currentTodo.desc}</Typography.Heading>
            </Layout.Col>
            <Typography>Move to:</Typography>
            <ListBox
              status_id={currentTodo.id}
              group_id={currentTodo.group_id}
              currentTodo={currentTodo}
              getTask={task.dispatch}
              onModalClose={() => setCurrentTodo(null)}
            />
          </Layout.Col>
        )}
      </Modal>
      <Layout.Card className="flex-grow ">
        <Layout.Col>
          <Typography.Heading className="text-red-800">
            Backlog
          </Typography.Heading>
          {task.data !== null &&
            task.data
              .filter((task) => task.type == -1)
              .map((task) => (
                <Layout.Card
                  className="m-1 cursor-pointer overflow-hidden"
                  key={task.id}
                  onClick={() => handleCardClick(task.group_id, task)}
                >
                  <h4 >{task.title}</h4>
                  <h5 >{task.desc}</h5>
                </Layout.Card>
              ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow ">
        <Layout.Col>
          <Typography.Heading className="text-green-800">
            In Progress
          </Typography.Heading>
          {task.data !== null &&
            task.data
              .filter((task) => task.type == 0)
              .map((task) => (
                <Layout.Card
                  className="m-1 cursor-pointer overflow-hidden"
                  key={task.id}
                  onClick={() => handleCardClick(task.group_id, task)}
                >
                  <Layout.Col>
                    <h4 >{task.title}</h4>
                    <h5 >{task.desc}</h5>
                  </Layout.Col>
                </Layout.Card>
              ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow ">
        <Layout.Col>
          <Typography.Heading className="text-orange-800">
            In Review
          </Typography.Heading>
          {task.data !== null &&
            task.data
              .filter((task) => task.type == 1)
              .map((task) => (
                <Layout.Card
                  className="m-1 cursor-pointer overflow-hidden"
                  key={task.id}
                  onClick={() => handleCardClick(task.group_id, task)}
                >
                  <h4>{task.title}</h4>
                  <h5>{task.desc}</h5>
                </Layout.Card>
              ))}
        </Layout.Col>
      </Layout.Card>
      <Layout.Card className="flex-grow ">
        <Layout.Col>
          <Typography.Heading className="text-blue-800">
            Completed
          </Typography.Heading>
          {task.data !== null &&
            task.data
              .filter((task) => task.type == 2)
              .map((task) => (
                <Layout.Card
                  className="m-1 cursor-pointer overflow-hidden"
                  key={task.id}
                  onClick={() => handleCardClick(task.group_id, task)}
                >
                  <h4>{task.title}</h4>
                  <h5>{task.desc}</h5>
                </Layout.Card>
              ))}
        </Layout.Col>
      </Layout.Card>
    </Layout.Grid>
  );
};

export default DashboardGroupsStatusBlock;
