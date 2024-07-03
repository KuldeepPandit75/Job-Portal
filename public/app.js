function changeAction(){
    const homeForm=document.querySelector("#homeForm");
    if(homeForm.elements.identity.value=="user"){
        homeForm.action="/user";
    }else{
        homeForm.action="/admin";
    }
}