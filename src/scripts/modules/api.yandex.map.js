module.exports = class{
    constructor(){}

    initMap(settings){
        return new Promise((resolve, reject) => ymaps.ready(resolve))
        .then(() => {
            this.map = new ymaps.Map("map", settings);

            this.cluster = new ymaps.Clusterer({
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: true,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
                clusterBalloonPanelMaxMapArea: 0,
                clusterBalloonContentLayoutWidth: 200,
                clusterBalloonContentLayoutHeight: 250,
                clusterBalloonPagerSize: 5,
                clusterBalloonPagerVisible: false,
                clusterOpenBalloonOnClick: true,
            })

            this.map.geoObjects.add(this.cluster);

            return this.map;
        })
    }

    async getMapPosition(e){
        const coords = e.get('coords');
        const geocode = await ymaps.geocode(coords);
        const address = geocode.geoObjects.get(0).properties.get('text');

        return {
            coords,
            address
        }
    }
    
    createPlacemark(pos, html){
        const myPlacemark = new ymaps.Placemark(pos.coords, {  
            hintContent: pos.address,
            balloonContent: [
                '<div>',
                `<strong>${html[1]}</strong>`,
                '<br/>',
                `<a class='link' href='#'>${html[0]}</a>`,
                '<br/>',
                `<strong>${html[2]}</strong>`,
                '</div>'
            ].join(''),
        },{
            //hideIconOnBalloonOpen: false
            openBalloonOnClick: false
        });
        
        this.cluster.add(myPlacemark)

        return [myPlacemark, this.cluster];
    }
}