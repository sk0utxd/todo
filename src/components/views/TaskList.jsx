import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider, Empty } from "antd";
import produce from "immer";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
var _ = require('lodash');


export default function TaskList() {
    const [tasks, setTasks] = useState();
    const navigate = useNavigate();

    var token;
    if(localStorage.getItem("todoAuthToken")){
        token = localStorage.getItem("todoAuthToken")
    }

    useEffect(() => {
        if(!token){
            navigate("/login");
        }
        fetch('http://demo2.z-bit.ee/tasks', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setTasks(data)
        });
      }, []);

    const handleNameChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].title = event.target.value;
            draft[index].changed = true
        });
        setTasks(newTasks);
    };

    const handleCompletedChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].marked_as_done = event.target.checked;
            draft[index].changed = true
        });
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        const newTask = {
            id: Math.random(),
            title: "sus" + Math.random(),
            marked_as_done: false,
            local: true,
            created: true
        }

        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));
    };

    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].shouldDelete = !draft[index].shouldDelete
        }));
    };

    const saveTasks = (task) => {
        var createInfoArr = []
        for(var i = 0; i < tasks.length; i++){
            const item = tasks[i]
            if(item.created == true && (item.shouldDelete == false || item.shouldDelete == null)){
                const xd = fetch(`http://demo2.z-bit.ee/tasks`, {
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }})
                .then((response) => response.json())
                .then((data) => {
                    var obj = {oldId: item.id, newId: data.id}
                    return obj
                });

                createInfoArr.push(xd)
            }
        }

        Promise.all(createInfoArr).then((values) => {
            setTasks(produce(tasks, draft => {
                for(var i = draft.length - 1; i >= 0; i--){
                    var item = draft[i]
                    var ifEmpty = item.title.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
                    if(ifEmpty == ""){item.title = "Task " + item.id}
                    if(item.shouldDelete == true && item.created == true){
                        draft.splice(draft.findIndex(t => t.id === item.id), 1);
                    } else if(item.shouldDelete == true){
                        fetch(`http://demo2.z-bit.ee/tasks/${item.id}`, {
                        method: "DELETE",
                        body: Empty,    
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }})
                        draft.splice(draft.findIndex(t => t.id === item.id), 1);
                    } else if(item.created == true){
                        item.created = false
                        const index = values.findIndex(t => t.oldId === item.id);
                        item.id = values[index].newId
                    } else if(item.changed == true){
                        item.changed = false
                        fetch(`http://demo2.z-bit.ee/tasks/${item.id}`, {
                        method: "PUT",
                        body: JSON.stringify(item),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }})
                        .then((response) => response.json())
                        .then((data) => {});
                    }                
                }
                createInfoArr = []
            }));
        });
    };

    return (
        <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Button onClick={saveTasks} className={"saveBtn"}>Save Tasks</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item style={{backgroundColor: task.shouldDelete == true? 'red': 'white'}} key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%'}}>
                            <Space>
                                <Checkbox checked={task.marked_as_done} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.title} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined style={{color: task.shouldDelete == true? 'white': 'black'}} /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}