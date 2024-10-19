export enum TaskType {
    EMAIL = "email",
    TODO = "todo",
    NOTIFICATION = "notification",
    REPORT = "report"
}

export interface Task<T> {
    id: number
    type: string
    data: T
}

export interface EmailTask {
    recipient: string
    subject: string
    body: string
}

export interface TodoTask {
    title: string
    description: string
    priority: number
}

export interface NotificationTask {
    title: string
    description: string
    date: Date
}

export interface ReportTask {
    title: string
    description: string
}

export type Processor<T> = Record<string, (task: Task<T>) => void>;

