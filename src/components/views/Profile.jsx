import { Form, Input, Button, Row, Col, notification, Divider } from "antd";
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState();

    var token;
    var userId;
    if(localStorage.getItem("todoAuthToken")){
        token = localStorage.getItem("todoAuthToken")
        userId = localStorage.getItem("todoUser")
    }

    useEffect(() => {
        if(!token || !userId){
            navigate("/login");
            return
        }
        fetch(`http://demo2.z-bit.ee/users/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setProfile(data)
        });
    }, []);

    const onFinish = (values) => {
        // fetch(`http://demo2.z-bit.ee/users/${userId}`, {
        //     method: "PUT",
        //     body: JSON.stringify(values.newPassword),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then((response) => response.json())
        // .then((data) => {
        //     if(data.status == 400){
        //         notification.error({
        //             message: 'Wrong username or password'
        //         });
        //     } else {
        //         notification.success({
        //             message: 'Logged in'
        //         });
        //         localStorage.setItem("todoUser", data.id)
        //         localStorage.setItem("todoAuthToken", data.access_token)
        //         navigate("/");
        //     }
        // });
        console.log(values.newPassword)
    };


    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ newPassword: ""}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="user"
                        id="userBox"
                        name="username"
                        rules={[{ message: `User ${profile.username} - not you?` }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        id="unBox"
                        name="username"
                        rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                        <Input.newPassword />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button type="primary" htmlType="submit">Change Password</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}