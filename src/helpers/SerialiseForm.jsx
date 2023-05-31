export const SerializeForm = (form)=>{
    const formData = new FormData(form)
    
    const completeObjet = {}
    
    for(let[name, value] of formData){
        completeObjet[name] = value;
    }
    return completeObjet;
}