const API_URL = "http://localhost:8080/api/v1";
const userAddressList = document.getElementById("address");
const btnCreateUser = document.getElementById("btn-save");

const getProviceAddress = async() => {
    try {
        let res = await axios.get(`https://provinces.open-api.vn/api/p/`);
        renderUserProvince(res.data);

    } catch (error) {
        console.log(error);
    }
}

const renderUserProvince = (arr) => {
    let html = "";
    arr.forEach(i => {
        html += `
            <option value="${i.codename}">${i.name}</option>
        `;
    });

    userAddressList.innerHTML = html;
}

btnCreateUser.addEventListener("click", async() => {
    try {
        await axios.post(`${API_URL}/users`, 
                            {name: document.getElementById("name").value,
                            email: document.getElementById("email").value,
                            phone: document.getElementById("phone").value,
                            address: $('#address').find(":selected").text(),
                            password: document.getElementById("password").value});
    } catch (error) {
        console.log(error);
    }
});

getProviceAddress();