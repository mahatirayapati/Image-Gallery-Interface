const API_KEY="KYcNxZNdc315RCVODTizIN2owI122Y1ZTftwwsu9hRNb6yZ57xkgqtpR";

// loading elements into js
const searchbar=document.querySelector("#searchbar");
const lens=document.querySelector("#lens");
const gallery=document.querySelector(".gallery");
const home=document.querySelector("#b1");
const tree=document.querySelector("#b2");
const food=document.querySelector("#b3");
const animals=document.querySelector("#b4");
const dresses=document.querySelector("#b5");
const loader=document.querySelector("#loader");
const likeplace=document.querySelector("#b7");
const savedplace=document.querySelector("#b6");


// for liked images
let likedimages=JSON.parse(localStorage.getItem("likedimages"))||[];
/*likedimages is a temporary working copy that exists while the page is running, and Local Storage 
is the permanent browser storage that survives page refreshes and browser restarts. When the page loads, 
data is copied from Local Storage into likedimages, and when changes are made, likedimages is saved back into Local Storage.*/

 //for saved images
 let savedimages=JSON.parse(localStorage.getItem("savedimages"))||[];
 




lens.addEventListener("click",()=>{
    const input=searchbar.value;
    search(input);
});

//search image when enter is clicked
searchbar.addEventListener("keydown",()=>{
    if(event.key=="Enter"){
        const input=searchbar.value;
        search(input);
    }
});
  

//makes the entire searchbar focused
const searchcontainer=document.querySelector(".searchcontainer");
searchcontainer.addEventListener("click",()=>{
    searchbar.focus();
})



//search option for Buttons
home.addEventListener("click",()=>{
    search("Indian buildings");  // passing string Literal
});
tree.addEventListener("click",()=>{
    search("nature");
});
food.addEventListener("click",()=>{
    search("Dosa");
});
animals.addEventListener("click",()=>{
    search("pet animals ");
})
dresses.addEventListener("click",()=>{
    search("Indian dresses");
})


// Function for Searching image through API
async function search(input){
try{
loader.style.display="block";  // making the loader blocked -1)if no error , 2) when we click the buttons
const response=await fetch( `https://api.pexels.com/v1/search?query=${input}&per_page=20`, //API url for input
        {
            headers:{
                Authorization: API_KEY
            }
        });
let data=await response.json();//converting response into js object
gallery.innerHTML=""; //removing prev images from the page
data.photos.forEach(photo=>{ //foreach loop that navigates through each photos[] of data object returned by API
let imageurl=photo.src.large; // src.large --> Navigates into the src object of that photo to grab the "large" size image URL.
const isliked=likedimages.includes(imageurl); //to know whether the image is in the local storage or not
gallery.innerHTML += `
<div class="card">
<img src="${imageurl}">
        <button class="likebtn"  style="color:${isliked ? 'red' : 'black'}"> 
            <i class="fa-solid fa-heart"></i>
        </button>
        <button class="downloadbtn" >
            <i class="fa-solid fa-download"></i>
        </button>
</div> `;
})  //data-url="${imageurl}" stores the image URL inside the button
}
catch(error){
    console.log(error);
}
finally{ 
    loader.style.display="none";   // works in case of buttons
}
}

// storing liked images in local storage
gallery.addEventListener("click",(e)=>{
    const likebtn=e.target.closest(".likebtn");  //the exact HTML  element the mouse pointer touched and .closest() looks for the nearesr element (or itself) that matches the CSS selector
    if(likebtn){
     const card=likebtn.closest(".card"); //if we click on icon then closest() start searching upwards in the DOM tree and find the nearest element with class card (parent finding)
     const imgurl=card.querySelector("img").src; //inside the card find img and get its src and store in imgurl
     if(likedimages.includes(imgurl)){
        likedimages=likedimages.filter(item=>item !==imgurl ); // keep every item except the existing imgurl
     }
    else{
        likedimages.push(imgurl);                                                                     //JSON.parse() ↔ Text → Object                                                                 //JSON.stringify()  ↔ Object → Text
    }
    localStorage.setItem("likedimages",JSON.stringify(likedimages));
    if(likedimages.includes(imgurl)){
        likebtn.style.color="red";
    }
    else{
        likebtn.style.color="black";
    }
}
});

likeplace.addEventListener("click",()=>{
    gallery.innerHTML="";
    likedimages.forEach(url=>{
        const issaved = savedimages.includes(url);
        gallery.innerHTML+= `
        <div class="card">
         <img src="${url}">
           <button class="likebtn" style="color:red">
                <i class="fa-solid fa-heart"></i>
            </button>

            <button class="downloadbtn">
                <i class="fa-solid ${issaved ? "fa-check" : "fa-download"}"></i>
            </button>
        </div>
        `;
    });
});


// storing saved images in local storage
gallery.addEventListener("click",(e)=>{
    const savebtn=e.target.closest(".downloadbtn");
    if(savebtn){
        const savecard=savebtn.closest(".card");  
        const saveurl=savecard.querySelector("img").src;
        if(savedimages.includes(saveurl)){
            savedimages=savedimages.filter(item=>item!==saveurl);
        }
        else{
            savedimages.push(saveurl);
        }
            localStorage.setItem("savedimages",JSON.stringify(savedimages));
        const icon = savebtn.querySelector("i");
        if(savedimages.includes(saveurl)){
           icon.classList.remove("fa-download");
           icon.classList.add("fa-check");
        }
        else{
    icon.classList.remove("fa-check");
    icon.classList.add("fa-download");
    }
}
})

savedplace.addEventListener("click",()=>{
    gallery.innerHTML="";
    savedimages.forEach(url=>{
        const isliked = likedimages.includes(url);
        gallery.innerHTML+=`
        <div class="card">
        <img src="${url}">
        <button class="likebtn"
                    style="color:${isliked ? "red" : "black"}">
                <i class="fa-solid fa-heart"></i>
            </button>

            <button class="downloadbtn">
                <i class="fa-solid fa-check"></i>
            </button>
        </div>
        `; 
    });
})

