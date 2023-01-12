const files = document.querySelector('#image').files;
const fileList = document.querySelector('.file-list');
const fileInput = document.querySelector('#image');
let fileName = [];




fileInput.addEventListener('change',()=>{
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
        console.log(fileInput.files)
        let dataTrans = new DataTransfer();
        let fileArr = Array.from(fileInput.files);
        let remains = fileArr.filter(function(file){return file.name!=e.target.id})
        console.log(remains)
        remains.forEach(file=>{
            dataTrans.items.add(file)
        });
        console.log(dataTrans);
        fileInput.files = dataTrans.files;
        listContainer.remove();
        eachFile.remove();
        deleteBtn.remove();
    })
}