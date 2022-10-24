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


    return (
        <Row>
            <h1>Profile Page TBD</h1>
            <Divider />
            <h1>{JSON.stringify(profile)}</h1>
        </Row>
    )
}