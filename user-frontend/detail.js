const API_URL = "http://localhost:8080/api/v1";
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
console.log(userId);

if (!userId) {
    window.location.href = "./404.html";
}

//Truy cap
const imageContainerEl = document.querySelector(".image-container");
const btnChooseImage = document.getElementById("btn-choose-image");
const btnDeleteImage = document.getElementById("btn-delete-image");
const avatarPreview = document.getElementById("avatar-preview");
const avatarEl = document.getElementById("avatar"); 
const fullnameEl = document.getElementById("fullname");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const userAddressList = document.getElementById("address");


const modalImageEl = new bootstrap.Modal(document.getElementById('modal-image'), {
    keyboard: false
  })

let images = [];
const getImages = async() => {
    try {
        let res = await axios.get(`${API_URL}/users/${userId}/files`);
        console.log(res);
        images = res.data;
        renderPaginationAndRenderImages(images);
    } catch (error) {
        console.log(error);
    }
}

const renderImages = arr => {
    imageContainerEl.innerHTML = "";
    let html = "";

    arr.forEach(i => {
        html += `
        <div class="image-item" onclick="chooseImage(this)">
        <img src="http://localhost:8080${i}" data-url=${i} alt="anh">
        </div>
        `
    });
    imageContainerEl.innerHTML = html;
    btnChooseImage.disabled = true;
    btnDeleteImage.disabled = true;
}

//Phan Trang
const renderPaginationAndRenderImages = arr => {
    $('.pagination-container').pagination({
        dataSource: arr,
        pageSize: 8,
        callback: function(data, pagination) {
            console.log(data);
            console.log(pagination);
            renderImages(data);
        }
    })
}

const chooseImage = (imageEl) => {
    const imageActiveEl = document.querySelector(".image-active");
    if (imageActiveEl) {
        imageActiveEl.classList.remove("image-active");
    }

    imageEl.classList.add("image-active");
    btnChooseImage.disabled = false;
    btnDeleteImage.disabled = false;
}

//Xoa anh
btnDeleteImage.addEventListener("click", async() => {
    try {
        const imageActiveEl = document.querySelector(".image-active img");
        if (!imageActiveEl) {
            return;
        }
        
        //Xoa tren server
        const url = imageActiveEl.src;
        await axios.delete(url);

        //Xoa tren client
        images = images.filter(i => !url.includes(i))
    
        //Render lai images
        renderPaginationAndRenderImages(images);
    } catch (error) {
        console.log(error);
    }
})

//Cap nhat Avatar
btnChooseImage.addEventListener("click", async() => {
    try {
        const imageActiveEl = document.querySelector(".image-active img");
        if (!imageActiveEl) {
            return;
        }
        
        //Xoa tren server
        const url = imageActiveEl.dataset.url;
        console.log(url);
        await axios.put(`${API_URL}/users/${userId}/update-avatar`, {avatar: url});

        avatarPreview.src = `http://localhost:8080${url}`;

        modalImageEl.hide();

    } catch(error) {
        console.log(error);
    }
}) 

//Upload anh
avatarEl.addEventListener("change", async(e) => {
    try {
        const file = e.target.files[0];
        console.log(file);

        const formData = new FormData();
        formData.append("file", file);

        //upload file
        const res = await axios.post(`${API_URL}/users/${userId}/files`, formData);
        
        //Cap nhat giao dien
        images.unshift(res.data);
        renderPaginationAndRenderImages(images);

    } catch(error) {
        console.log(error);
    }
})


const getProviceAddress = async(userAddr) => {
    try {
        let res = await axios.get(`https://provinces.open-api.vn/api/p/`);
        renderUserProvince(res.data, userAddr);

    } catch (error) {
        console.log(error);
    }
}

const renderUserProvince = (arr, userAddr) => {
    let html = "";
    arr.forEach(i => {
        if (userAddr == i.name) {
            console.log(userAddr + "--" + i.name);
            html += `
                <option value="${i.codename}" selected>${i.name}</option>
            `;
        } else {      
            html += `
                <option value="${i.codename}">${i.name}</option>
            `;
        }
    });

    userAddressList.innerHTML = html;
 }

//Render default detail infors
const renderDefaultUserDetails = async() => {
    try {
        let res = await axios.get(`${API_URL}/users/${userId}`);
        let userData = res.data;
        console.log(userData);

        getProviceAddress(userData.address);

        fullnameEl.value = userData.name;
        emailEl.value = userData.email;
        phoneEl.value = userData.phone;
        avatarPreview.src = `http://localhost:8080${userData.avatar}`;


    } catch (error) {
        console.log(error);
    }
}

renderDefaultUserDetails();
getImages();