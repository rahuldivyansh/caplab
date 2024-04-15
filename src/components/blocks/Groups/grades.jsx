import React, { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../../ui/Layout';
import Form from '../../ui/Form';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import useFetch from '@/src/hooks/general/useFetch';
import { toast } from "react-toastify";
import { useGroup } from '@/src/providers/Group';
import { LoaderElement } from '../../elements/Loaders';
import EmptyElement from '../../elements/Empty';
import Typography from '../../ui/Typography';
import { Pencil, TrashIcon } from "lucide-react";
import ComboBox from '../../ui/ComboBox';
import Avatar from '../../elements/Avatar';
import { useAuth } from '@/src/providers/Auth';

const AddGradeBlock = (props) => {
  const group = useGroup();
  const [addGradeModalOpen, setAddGradeModalOpen] = useState(false);
  const currStudent = useRef(null);
  const currPhase = useRef(null);
  const members = useFetch({
    method: "GET",
    url: `/api/members/${group.id}`,
    get_autoFetch: true,
  });
  const phases = useFetch({
    method: "GET",
    url: `/api/grades/${group.id}/phases`,
    get_autoFetch: true,
  });
  const addGrade = useFetch({
    method: "POST",
    url: `/api/grades/${group.id}`,
  });
  const onStudentChange = (value) => {
    currStudent.current = value;
  }
  const onPhaseChange = (value) => {
    currPhase.current = value;
  }
  const handleModalClose = () => {
    setAddGradeModalOpen(prev => !prev);
  }
  const onAddGradeFormSubmit = async (formData) => {
    if (!currStudent.current || !currPhase.current) return toast.error("Please select student and phase");
    const currMaxMarks = phases.data.find(phase => phase.id === currPhase.current.value).max_marks;
    if (parseInt(formData.obtained_marks) > currMaxMarks) return toast.error(`Obtained marks cannot be greater than ${currMaxMarks} marks`);
    const payload = {
      group_id: group.id,
      uid: currStudent.current.value,
      phase: currPhase.current.value,
      obtained_marks: parseInt(formData.obtained_marks),
    }
    if (payload.max_marks < payload.obtained_marks) return toast.error("Obtained marks cannot be greater than max marks");
    try {
      const { data, error } = await addGrade.dispatch(payload);
      if (error) {
        throw error;
      }
      if (data) {
        props.grades.dispatch();
        toast.success("Grade added successfully");
        handleModalClose();
      }
      if (error)
        throw error;
    } catch (error) {
      toast.error(error?.message || "An error occurred while adding milestone");
      console.log(error);
    }
  }
  const ableToSubmit = useMemo(() => {
    if (!members.data || !phases.data) return false;
    if (Array.isArray(members.data) && members.data.length === 0) return false;
    if (Array.isArray(phases.data) && phases.data.length === 0) return false;
    return true;
  }, [members.data, phases.data])
  return (
    <Layout.Row className="items-end">
      <Button onClick={handleModalClose} className="btn-primary">add</Button>
      <Modal open={addGradeModalOpen} onClose={handleModalClose} title="Add phase">
        <Layout.Col className="lg:min-w-[500px] h-screen">
          <Form onSubmit={onAddGradeFormSubmit}>
            <Layout.Col className="p-4 gap-2 items-start">
              <Layout.Col className="gap-2 z-[1000] w-full">
                {members.data && <ComboBox placeholder="Select student..." list={members.data.map(member => ({ value: member.uid, displayValue: member.name }))} onChange={onStudentChange} multiple={false} />}
              </Layout.Col>
              {Array.isArray(members.data) && members.data.length === 0 && <Typography.Caption className="text-red-500">No members available</Typography.Caption>}
              {phases.data && <ComboBox placeholder="Select phase..." list={phases.data.map(phase => ({ value: phase.id, displayValue: phase.name }))} onChange={onPhaseChange} multiple={false} />}
              {Array.isArray(phases.data) && phases.data.length === 0 && <Typography.Caption className="text-red-500">No phases available</Typography.Caption>}
              <Form.Input name="obtained_marks" type="number" min="0" placeholder="enter marks obtained" className="w-full" required />
              <Button className="btn-primary" loading={addGrade.loading} disabled={!ableToSubmit}>submit</Button>
            </Layout.Col>
          </Form>
        </Layout.Col>
      </Modal>
    </Layout.Row>
  )
}

const RemoveGradeBlock = (props) => {
  const group = useGroup();
  const removeGrade = useFetch({
    method: "DELETE",
    url: `/api/grades/${group.id}/${props.id}`,
  });
  const handleRemoveGrade = async () => {
    try {
      const { data, error } = await removeGrade.dispatch();
      if (error) {
        throw error;
      }
      if (data) {
        props.grades.dispatch();
        toast.success("Grade removed successfully");
      }
    } catch (error) {
      toast.error("An error occurred while removing grade");
      console.log(error);
    }
  }
  return <Button onClick={handleRemoveGrade} className="btn-icon" loading={removeGrade.loading}><TrashIcon size={20} className='text-red-500' /></Button>
}

const UpdateGradeBlock = (props) => {
  const group = useGroup();
  const removeGrade = useFetch({
    method: "PUT",
    url: `/api/grades/${group.id}/${props.id}`,
  });
  const handleUpdateGrade = async () => {
    try {
      const { data, error } = await removeGrade.dispatch();
      if (error) {
        throw error;
      }
      if (data) {
        props.grades.dispatch();
        toast.success("Grade removed successfully");
      }
    } catch (error) {
      toast.error("An error occurred while removing grade");
      console.log(error);
    }
  }
  return <>
    <Button onClick={null} className="btn-icon "><Pencil size={20} /></Button >
  </>
}



const GradesBlock = (props) => {
  const group = useGroup();
  const auth = useAuth();
  if (props.gradesByPhase.length === 0) return <EmptyElement />
  return <Layout.Col className="gap-2">
    {props.gradesByPhase.map(phase => {
      return phase.grades.length !== 0 ? <Layout.Col key={phase.id} className="gap-2">
        <details className="transition-all">
          <summary className="bg-white cursor-pointer select-none font-bold dark:bg-white/5 border dark:border-white/10 hover:border-primary dark:hover:border-primary/50 uppercase p-2 rounded-lg">
            {phase.name}
          </summary>
          <Layout.Col className="gap-2 p-2">
            {phase.grades.map(grade => {
              return <Layout.Card key={grade.id} className="gap-2 flex justify-between items-center flex-wrap">
                <Layout.Row className="items-center gap-2">
                  <Avatar seed={grade.users?.name} />
                  <Typography.Caption className="uppercase font-bold">{grade.users?.name}</Typography.Caption>
                </Layout.Row>
                <Layout.Row className="items-center">
                  <Typography.Body>{grade.obtained_marks}</Typography.Body>
                  {auth.data?.id === group.owner && <RemoveGradeBlock id={grade.id} grades={props.grades} />}
                </Layout.Row>
              </Layout.Card>
            })}
            {
              phase.grades.length === 0 && <EmptyElement />
            }
          </Layout.Col>
        </details>
      </Layout.Col> : null
    })}
  </Layout.Col>
}

const GradingGradesBlock = () => {
  const group = useGroup();
  const auth = useAuth();
  const phases = useFetch({
    method: "GET",
    url: `/api/grades/${group.id}/phases`,
    get_autoFetch: true,
  });
  const grades = useFetch({
    method: "GET",
    url: `/api/grades/${group.id}`,
    get_autoFetch: true,
  });

  const gradesByPhase = useMemo(() => {
    if (!grades.data || !phases.data) return [];
    if (Array.isArray(grades.data) && grades.data.length === 0) return [];
    if (Array.isArray(phases.data) && phases.data.length === 0) return [];
    const phasesMap = phases.data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
    Object.keys(phasesMap).forEach(key => {
      phasesMap[key].grades = [];
    })
    grades.data.forEach(grade => {
      phasesMap[grade.phase].grades.push(grade);
    })
    const res = Object.keys(phasesMap).map(key => phasesMap[key]);
    console.log(res)
    return res;
  }, [grades.data, phases.data])
  return (
    <Layout.Col className="p-4 min-h-screen gap-2">
      {auth.data?.id === group.owner && <AddGradeBlock grades={grades} />}
      <GradesBlock gradesByPhase={gradesByPhase} grades={grades} />
    </Layout.Col>
  )
}

export default GradingGradesBlock;