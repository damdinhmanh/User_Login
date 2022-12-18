const API_URL = "http://localhost:8080/api/v1";
const userTableEl = document.querySelector(".user-table");
console.log(userTableEl);


let userList = [];

const getUserList = async() => {
    try {
        let res = await axios.get(`${API_URL}/users`);
        userList = res.data;

        userTableEl.innerHTML = "";
        renderUserList(userList);

    } catch (error) {
        console.log(error);
    }
}

const renderUserList = (arr) => {
    let html = "";
    arr.forEach(i => {
        html += `
                <tr>
                    <td>${i.id}</td>
                    <td>${i.name}</td>
                    <td>${i.email}</td>
                    <td>${i.phone}</td>
                    <td>${i.address}</td>
                    <td>
                        <a href="./detail.html?id=${i.id}" class="btn btn-success">Xem chi tiết</a>
                        <button class="btn btn-danger" onclick="deleteUserId(${i.id})">Xóa</button>
                    </td>
                </tr>
        `;
    });

    userTableEl.innerHTML = html;
}

const deleteUserId = async(uId) => {
    try {
        await axios.delete(`${API_URL}/users/${uId}`);

        userTableEl.innerHTML = "";
        let res = await axios.get(`${API_URL}/users`);
        userList = res.data;

        renderUserList(userList);
    } catch (error) {
        console.log(error);
    }
}

getUserList();