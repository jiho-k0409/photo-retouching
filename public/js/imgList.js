const files = document.querySelector('#image').files;
const fileList = document.querySelector('.file-list');
const fileInput = document.querySelector('#image');
const nameDisplay = document.querySelector('.input-box');
const selectPhoto = document.querySelector('#file-label');
let fileName = [];




fileInput.addEventListener('change',()=>{
    onlyImage()
    fileName= [];
    fileList.innerHTML = ''
    for(let x=0;x<fileInput.files.length;x++){
        fileName.push(fileInput.files[x].name);
    }
    for(let i=0;i<fileName.length;i++){
        createFileList(i);
    }
    
})


function createFileList(file){
    const listContainer = document.createElement('div');
    const eachFile = document.createElement('div');
    const deleteBtn = document.createElement('span');
    listContainer.className='list-container'
    eachFile.className = 'file-name';
    deleteBtn.className = 'delete';
    deleteBtn.id=fileName[file];
    eachFile.innerHTML = fileName[file];
    deleteBtn.innerHTML= '삭제';
    fileList.appendChild(listContainer)
    listContainer.appendChild(eachFile);
    listContainer.appendChild(deleteBtn);
    deleteBtn.addEventListener('click',(e)=>{
        let dataTrans = new DataTransfer();
        let fileArr = Array.from(fileInput.files);
        let remains = fileArr.filter(function(file){return file.name!=e.target.id})
        remains.forEach(file=>{
            dataTrans.items.add(file)
        });
        fileInput.files = dataTrans.files;
        listContainer.remove();
        eachFile.remove();
        deleteBtn.remove();
        
    })
}



fileInput.addEventListener('change',function(){
    let firstFile = fileInput.files[0].name
    nameDisplay.innerText = firstFile;
})

const toggleList = document.querySelector('.input-box');
toggleList.addEventListener('click',()=>{
    if(fileList.style.display =='none'){
        fileList.style.display='inline';
    }else{
        fileList.style.display='none';
    }
})

function onlyImage(){
    let fileArr = Array.from(fileInput.files);
    fileArr.forEach(file=>{
        console.log(file)
        let checkExtension=file.name.split('.')[-1]
        if(checkExtension!='jpg'||checkExtension!='png'){
            alert('jpg파일과 png파일만 전송할 수 있습니다');
            fileInput.value='';
        }
    })
}