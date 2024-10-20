document.querySelector('.toggle-btn').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    console.log('drawer')
    sidebar.classList.toggle('active'); // Toggle the active class
    sidebar.classList.toggle('deActive'); // Toggle the active class
});


// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', (event) => {
        // Toggle the clicked accordion item
        const content = header.nextElementSibling;
        const isActive = content.style.display === "block";

        // Close all accordion items
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.style.display = "none";
        });

        // If the clicked item was not active, open it
        if (!isActive) {
            content.style.display = "block";
        }

        event.stopPropagation();
    });
});


window.addEventListener('click', ()=>{
    // Close all accordion items
    document.querySelectorAll('.accordion-content').forEach(item => {
        item.style.display = "none";
    });
})

// Get the button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Show or hide the button based on scroll position
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
});

function openOverlay(overlayId) {
    document.getElementById(overlayId).style.display = 'flex';
}

function closeOverlay() {
    const overlays = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlays.length; i++) {
        overlays[i].style.display = 'none';
    }
}

window.addEventListener('click', function(event) {
    // Check if the clicked element is the overlay (not the overlay content)
    const overlays = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlays.length; i++) {
        if (event.target === overlays[i]) {
            overlays[i].style.display = 'none';
        }
    }
});

const formProfilePic = document.getElementById('form-profile-pic')

formProfilePic.addEventListener('submit', async (event)=>{
    event.preventDefault();
    //console.log('axios')
        
    const formData = new FormData(formProfilePic) 
    const userId = formData.get('id'); // Extract the user id from the form data

    try{
        const response = await axios.put(`/user/edit-profile-pic/${userId}`, formData)
        
        document.getElementById('update-message').textContent = response.data.message
        
        const overlays = document.getElementsByClassName('overlay');
        for (let i = 0; i < overlays.length; i++) {
            if (overlays[i].style.display == 'flex') {
                overlays[i].style.display = 'none';
                break
            }
        }

    }catch(err){
        console.log(err.message)
    }  
})

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData.entries());  // Convert FormData to a plain object
}

const formPersonalInfo = document.getElementById('form-personal-info')

formPersonalInfo.addEventListener('submit', async (event)=>{
    event.preventDefault();
    //console.log('axios')
        
   // Convert the form data to a JSON object
   const formData = formDataToJSON(formPersonalInfo);
   const userId = formData.id;  // Assuming there's an 'id' field in the form

    try{
        const response = await axios.put(`/user/edit-personal-info/${userId}`, formData)
        
        document.getElementById('update-message').textContent = response.data.message
        
        const overlays = document.getElementsByClassName('overlay');
        for (let i = 0; i < overlays.length; i++) {
            if (overlays[i].style.display == 'flex') {
                overlays[i].style.display = 'none';
                break
            }
        }

    }catch(err){
        console.log(err.message)
    }  
})

const formContactInfo = document.getElementById('form-contact-info')

formContactInfo.addEventListener('submit', async (event)=>{
    event.preventDefault();
    //console.log('axios')
        
   // Convert the form data to a JSON object
   const formData = formDataToJSON(formContactInfo);
   const userId = formData.id;  // Assuming there's an 'id' field in the form

    try{
        const response = await axios.put(`/user/edit-contact-info/${userId}`, formData)
        
        document.getElementById('update-message').textContent = response.data.message
        
        const overlays = document.getElementsByClassName('overlay');
        for (let i = 0; i < overlays.length; i++) {
            if (overlays[i].style.display == 'flex') {
                overlays[i].style.display = 'none';
                break
            }
        }

    }catch(err){
        console.log(err.message)
    }  
})


async function deleteProfile(userId){

    try{
        console.log(userId)
        
        const response = await axios.delete(`/user/delete-profile/${userId}`)
        
        if(response.data.message)
            window.location.href = '/' 

    }catch(err){
        console.log(err.message)
    }  
}
