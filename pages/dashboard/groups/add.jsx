import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import ComboBox from '@/src/components/ui/ComboBox'
import Form from '@/src/components/ui/Form'
import Input from '@/src/components/ui/Form/Input'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import { ROLES } from '@/src/constants/roles'
import useFetch from '@/src/hooks/general/useFetch'
import withAuthPage from '@/src/middlewares/withAuthPage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


const KEYWORDS = [
    { value: "artificial intelligence", displayValue: "Artificial Intelligence" },
    { value: "machine learning", displayValue: "Machine Learning" },
    { value: "data science", displayValue: "Data Science" },
    { value: "web development", displayValue: "Web Development" },
    { value: "mobile app development", displayValue: "Mobile App Development" },
    { value: "cloud computing", displayValue: "Cloud Computing" },
    { value: "cybersecurity", displayValue: "Cybersecurity" },
    { value: "blockchain", displayValue: "Blockchain" },
    { value: "internet of things", displayValue: "Internet of Things" },
    { value: "big data", displayValue: "Big Data" },
    { value: "augmented reality", displayValue: "Augmented Reality" }
];


const AddGroupPage = () => {
    const router = useRouter();
    const [keywords, setKeywords] = useState([])
    const addGroup = useFetch({ method: "POST", url: "/api/groups/add" });
    const handleSubmit = async (body) => {
        if (keywords.length === 0) {
            return toast.warn("select keywords")
        }
        const payload = {
            num: parseInt(body.num),
            session: parseInt(body.session),
            keywords: keywords
        }
        try {
            const response = await addGroup.dispatch(payload);
            if (response.error) {
                throw new Error(response.error)
            }
            toast.success("Group added")
            router.push("/dashboard/groups")
        } catch (error) {
            toast.error("error adding group")
        }
    }
    const onKeywordsChange = (value) => {
        setKeywords(value.map((keyword) => keyword.value));
    }

    return (
        <DashboardLayout>
            <Layout.Col className="p-4 md:p-12 lg:p-16 gap-4">
                <Layout.Col className="md:flex-row justify-between">
                    <Typography.Subtitle className="font-semibold">
                        Add Group
                    </Typography.Subtitle>
                </Layout.Col>
                    <Form onSubmit={handleSubmit}>
                        <Layout.Col className="gap-2 items-start max-w-md">
                            <Typography.Heading>General Info</Typography.Heading>
                            <Input type="number" name="num" placeholder="Enter group number..." className="w-full" min={1} required />
                            <Input type="number" name="session" placeholder="Enter session..." className="w-full" min={2000} max={9999} required />
                            <Typography.Heading>Add keywords</Typography.Heading>
                            <ComboBox onChange={onKeywordsChange} list={KEYWORDS} name="teacher" placeholder="Select keywords..." required multiple />
                            <Button className="btn-primary" loading={addGroup.loading}>Submit</Button>
                        </Layout.Col>
                    </Form>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default AddGroupPage


export const getServerSideProps = withAuthPage(async (ctx) => {
    const { req } = ctx;
    const { role } = req
    const ALLOWED_ROLES = [ROLES.TEACHER];
    if (role === undefined || !ALLOWED_ROLES.includes(role)) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            info: "can be accessed by teachers only"
        },
    }
})