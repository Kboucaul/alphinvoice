import axios from "axios";

function createUserRegistration(user)
{
    return axios.post("http://localhost:8000/api/users", user);
}

export default {
    createUserRegistration
}