import type {
    TodoTask, 
    ReportTask, 
    NotificationTask, 
    EmailTask, 
    Task,
    Processor,
} from "src/types/queue"
import { TaskType } from "src/types/queue";

class TaskQueue<T> {
    private tasks: Task<T>[] = [];
    private proccesors: Processor<T> = {};
    private id = 1;

    constructor(processors: Processor<T>) {
        this.proccesors = processors;
    }

    addTask(type: TaskType, data: T): string {
        const newTaskId = this.id++;
        this.tasks.push({ id: newTaskId, type, data });
        return `Se agregó la tarea con id ${newTaskId} de tipo ${type}`

    }

    cancelTask(id: number): string {
        const index = this.tasks.findIndex((task) => task.id === id);

        if(index === -1){
            return `La tarea con id ${id} no existe`;
        }

        this.tasks.splice(index, 1)
        return `Se cancelo la tarea con id ${id}`;
    }

    processAllTasks(): void {
        console.log("Se estan procesando las tareas...")
        this.tasks.forEach((task) => {
            this.processTask(task)        
        })
        this.id = 1;
        console.log("Se han procesado todas las tareas :)")
    }

    private processTask(task: Task<T>): void {
        const processor = this.proccesors[task.type] || this.proccesors.default;
        processor(task);
        this.tasks = this.tasks.filter((t) => t.id != task.id)
    }

    getAllTasks(): Task<T>[] {
        return this.tasks
    }
}

export default function queueManager() {

    const emailProcessor = (task: Task<EmailTask>) => {
        console.log(`Se envió el correo a ${task.data.recipient}`);  
    }

    const reportProcessor = (task: Task<ReportTask>) => {
        console.log(`Se generó el reporte ${task.data.title}`);
    }

    const todoProcessor = (task: Task<TodoTask>) => {
        console.log(`Se agregó la tarea ${task.data.title}`);
    }

    const notificationProcessor = (task: Task<NotificationTask>) => {
        console.log(`Se envió la notificación ${task.data.title}`);
    }

    const processors: Processor<EmailTask | TodoTask | ReportTask | NotificationTask> = {
        [TaskType.EMAIL] : emailProcessor,
        [TaskType.TODO] : todoProcessor,
        [TaskType.REPORT] : reportProcessor,
        [TaskType.NOTIFICATION] : notificationProcessor,
        default: (task: Task<any>) => {
            console.log(`No se encontro un procesador para la tarea ${task.type}`)
        },


    };

    const queue  = new TaskQueue(processors);


    const taskAddResult1 = queue.addTask(TaskType.EMAIL, {
        recipient: 'juandgl@gmail.com',
        subject: 'marcosjk@gmail.com' ,
        body: 'Mensaje de saludo'
    });
    console.log(taskAddResult1)

    const taskAddResult2 = queue.addTask(TaskType.REPORT, {
        title: 'Reporte de prueba',
        description: 'Esto es un reporte de prueba',
    });
    console.log(taskAddResult2);

    const taskAddResult3 = queue.addTask(TaskType.TODO, {
        title: 'Tarea de prueba',
        description: 'Esto es una tarea de prueba',
        priority: 1
    });
    console.log(taskAddResult3);
    
    const taskAddResult4 = queue.addTask(TaskType.NOTIFICATION, {
        title: 'Notificación de prueba',
        description: 'Esto es una notificación de prueba',
        date: new Date(),
    });
    console.log(taskAddResult4);

    queue.processAllTasks()

    const allTaskResult1 = queue.getAllTasks();
    console.log(allTaskResult1);

    const taskAddResult5 = queue.addTask(TaskType.REPORT, {
        title: 'Reporte de prueba',
        description: 'Esto es un reporte de prueba',
        priority: 1
    });
    console.log(taskAddResult5);

    const allTaskResult2 = queue.getAllTasks();
    console.log(allTaskResult2);

    const taskCancelResultIntent1 = queue.cancelTask(2);
    const taskCancelResultIntent2 = queue.cancelTask(1);

    console.log(taskCancelResultIntent1);
    console.log(taskCancelResultIntent2);

    const allTaskResult3 = queue.getAllTasks();
    console.log(allTaskResult3);
}