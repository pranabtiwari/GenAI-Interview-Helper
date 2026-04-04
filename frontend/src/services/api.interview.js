import axios from "axios";

const API_BASE_URL = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true,
})



export function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append("resume", resume);
    form.append("selfDescription", selfDescription);
    form.append("jobDescription", jobDescription);
    const response = API_BASE_URL.post('interview', form, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        }
    })

    return response
}

export function getInterviewReportById(interviewId) {
    const token = localStorage.getItem('token');
    const response = API_BASE_URL.get(`interview/${interviewId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response
}

export function getAllInterviewReports() {
    const token = localStorage.getItem('token');
    const response = API_BASE_URL.get('interview', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response
}

