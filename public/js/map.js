// 마커를 담을 배열입니다
var markers = [];

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

const places = new kakao.maps.services.Places();
function placesSearch(result,status,pagination){
    if(status === kakao.maps.services.Status.OK){
        console.log(pagination.current)
        for(var i =0; i<result.length;i++){
            let searchResultName = result[i].place_name;
            console.log(searchResultName);
        }
        console.log(pagination.hasNextPage)
        if(pagination.hasNextPage){
            pagination.nextPage()
        }
    }
}

places.keywordSearch('부산맛집',placesSearch);