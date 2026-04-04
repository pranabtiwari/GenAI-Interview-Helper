import  mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required']
    }},
{
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required']
    }},
{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required']
    }
}, { _id: false })


const preprationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required']
    },
    focus: {
        type: String,
        required: [true, 'Focus is required']
    },
    tasks: {
        type: [String],
        required: [true, 'Tasks are required']
    }
}, { _id: false })


const interReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required']
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
    },
    techniQuestion: [technicalQuestionSchema],
    behavQuestion: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preprationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps: true 
})



const interviewModel = mongoose.model('InterviewReport', interReportSchema)


export default interviewModel