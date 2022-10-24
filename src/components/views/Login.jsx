import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
    const navigate = useNavigate();
    
    var token;
    var userId;
    if(localStorage.getItem("todoAuthToken")){
        token = localStorage.getItem("todoAuthToken")
        userId = localStorage.getItem("userId")
    }

    useEffect(() => {
        if(!userId && token){
            navigate("/logout");
            return
        }
        if(token){
            navigate("/tasks");
            return
        }
    }, []);

    const onFinish = (values) => {
        fetch('http://demo2.z-bit.ee/users/get-token', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.status == 400){
                notification.error({
                    message: 'Wrong username or password'
                });
            } else {
                notification.success({
                    message: 'Logged in'
                });
                localStorage.setItem("todoUser", data.id)
                localStorage.setItem("todoAuthToken", data.access_token)
                navigate("/");
            }
        });
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        id="unBox"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        id="pwBox"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button type="primary" htmlType="submit">Login</Button>
                            <Link to={`/register`}>
                                <Button role="link">Sign up</Button>
                            </Link>
                        </div>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}