const Map = require('../modules/api.yandex.map');
export default class{
    constructor(){
        this.myApiMap = new Map();

        this.modal = document.querySelector('#myModal');
        this.template = document.querySelector('#balloon_template').textContent;

        this.position = null;

        localStorage.clear();

        this.init();
    
    }

    async init(){

        this.yandexApi = await this.myApiMap.initMap({
            center: [59.945, 30.264],
            zoom: 15,
            controls: ["zoomControl", "fullscreenControl"]
        })

        this.yandexApi.events.add('click', async (e) => {
            this.position = await this.myApiMap.getMapPosition(e);            
            //console.log(this.position);               
            this.openPopUp();
            
        })        

        this.modal.addEventListener('click', (e) => {
            if(e.target.classList.contains('close')){
                this.modal.style.display = 'none';
            }
            if(e.target.classList.contains('btn')){
                let balloonInfo = this.saveForm(this.position.address);
                this.modal.innerHTML = this.popUpRender();
                
                let placemarks = this.myApiMap.createPlacemark(this.position, balloonInfo,);
                let balloon = placemarks[0];
                let cluster = placemarks[1]
                balloon.events.add('click', (e) => {
                    this.position.address = balloon.properties.get('hintContent');
                    this.openPopUp();
                })  
                cluster.events.add('balloonopen', (event) => {
                    document.addEventListener('click', (e) => {
                        if(e.target.classList.contains('link')){
                            e.preventDefault();
                            this.position.address = e.target.innerHTML;
                            cluster.balloon.close();
                            this.openPopUp();
                        }                        
                    })                    
                })                 
            }
        })        
    }

    saveForm(pos){
        let name = document.querySelector('#input_name');
        let place = document.querySelector('#input_place');
        let review = document.querySelector('#input_review');
        this.saveReview(pos, [name.value, place.value, review.value]);
        return [pos, place.value, review.value]
    }

    openPopUp(){                
        this.modal.innerHTML = this.popUpRender();    
        this.modal.style.display = 'block';
    }

    popUpRender() {
        let render = Handlebars.compile(this.template);
        let reviewList = this.checkStorage(JSON.stringify(this.position.address));
        let placeholder = null;
        if (reviewList.length === 0){
            placeholder = 'Still no reviews..'
        }        
        let renderObj = {
            address: this.position.address,
            reviews: reviewList,
            default: placeholder 
        };
        //console.log(renderObj)
        let html = render(renderObj);
        return html
    }

    checkStorage(address){
        let reviewObj = JSON.parse(localStorage[address] || "[]");
        return reviewObj
    }

    saveReview(address, review){
        let reviewObj = 
        {
            name: review[0],
            location: review[1],
            text: review[2]
        };
        let addressToStr = JSON.stringify(address)
        let reviewList = this.checkStorage(addressToStr);
        reviewList.push(reviewObj);
        localStorage[addressToStr] = JSON.stringify(reviewList)
    }        
}