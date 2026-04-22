import axios from "axios";

const API_BASE_URL_VALUE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE_URL = axios.create({
    baseURL: API_BASE_URL_VALUE,
    withCredentials: true,
})



export function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append("resume", resume);
    form.append("selfDescription", selfDescription);
    form.append("jobDescription", jobDescription);
    const response = API_BASE_URL.post('/interview', form, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        }
    })

    return response
}

export function getInterviewReportById(interviewId) {
    const token = localStorage.getItem('token');
    const response = API_BASE_URL.get(`/interview/${interviewId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response
}

export function getAllInterviewReports() {
    const token = localStorage.getItem('token');
    const response = API_BASE_URL.get('/interview', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response
}

export function generateInterviewReportPDF(interviewId) {
    const token = localStorage.getItem('token');
    const response = API_BASE_URL.post(`/resume/pdf/${interviewId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
    })
    return response
}
