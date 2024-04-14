import React, { useMemo, useRef, useState } from 'react'
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
import { TrashIcon } from "lucide-react";
import ComboBox from '../../ui/ComboBox';

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
    const payload = {
      group_id: group.id,
      uid: currStudent.current.value,
      phase: currPhase.current.value,
      max_marks: parseInt(formData.max_marks),
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
              {members.data && <ComboBox placeholder="Select student..." list={members.data.map(member => ({ value: member.uid, displayValue: member.name }))} onChange={onStudentChange} multiple={false} />}
              {Array.isArray(members.data) && members.data.length === 0 && <Typography.Caption className="text-red-500">No members available</Typography.Caption>}
              {phases.data && <ComboBox placeholder="Select phase..." list={phases.data.map(phase => ({ value: phase.id, displayValue: phase.name }))} onChange={onPhaseChange} multiple={false} />}
              {Array.isArray(phases.data) && phases.data.length === 0 && <Typography.Caption className="text-red-500">No phases available</Typography.Caption>}
              <Form.Input name="max_marks" type="number" placeholder="enter max marks" className="w-full" required />
              <Form.Input name="obtained_marks" type="number" placeholder="enter marks obtained" className="w-full" required />
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
  return <Button onClick={handleRemoveGrade} className="btn-icon "><TrashIcon size={20} className='text-red-500' /></Button>
}

const GradesBlock = (props) => {
  if (props.gradesByPhase.length === 0) return <EmptyElement />
  return <Layout.Col className="gap-2">
    {props.gradesByPhase.map(phase => {
      return <Layout.Col key={phase.id} className="gap-2">
        <Typography.Heading className="uppercase">{phase.name}</Typography.Heading>
        <Layout.Col className="gap-2">
          {phase.grades.map(grade => {
            return <Layout.Card key={grade.id} className="gap-2 flex justify-between items-center">
              <Typography.Body>{grade.users?.name}</Typography.Body>
              <Layout.Row className="items-center">
                <Typography.Body>{grade.obtained_marks}/{grade.max_marks}</Typography.Body>
                <RemoveGradeBlock id={grade.id} grades={props.grades} />
              </Layout.Row>
            </Layout.Card>
          })}
          {
            phase.grades.length === 0 && <EmptyElement />
          }
        </Layout.Col>
      </Layout.Col>
    })}
  </Layout.Col>
}

const GradingGradesBlock = () => {
  const group = useGroup();
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
    const res = phases.data.map(phase => {
      const gradesByPhase = grades.data.filter(grade => grade.phase === phase.id);
      return {
        ...phase,
        grades: gradesByPhase,
      }
    })
    console.log(res)
    return res;
  }, [grades.data, phases.data])


  return (
    <Layout.Col className="p-4 min-h-screen gap-2">
      <AddGradeBlock grades={grades} />
      <GradesBlock gradesByPhase={gradesByPhase} grades={grades}/>
    </Layout.Col>
  )
}

export default GradingGradesBlock;