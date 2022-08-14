const deleteProduct = btnContext => {
 const productId = btnContext.parentNode.querySelector('[name=productId]').value;
 const csrf = btnContext.parentNode.querySelector('[name=_csrf]').value;

 const productElement= btnContext.closest('article');
 
 fetch('/admin/product/'+productId,{
  method : 'DELETE',
  headers:{
    'csrf-token' : csrf,
  }
 })
 .then(result=>{
  return result.json()
 })
 .then(data =>{
  console.log(data)
  productElement.remove()
  
  // productElement.parentNode.removeChild(productElement);
 })
 .catch(err=>{
  console.log(err)
 })
  
};
