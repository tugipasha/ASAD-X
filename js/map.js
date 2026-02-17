
// Harita İşlemleri

const MapManager = {
    map: null,
    markers: [],
    currentMarker: null, // Kullanıcının eklediği geçici marker

    init: function(elementId, initialCoords = [37.0662, 37.3833]) { // Gaziantep merkezi (Örnek deprem bölgesi)
        this.map = L.map(elementId).setView(initialCoords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    },

    // Haritaya marker ekle (Gösterim için)
    addMarker: function(lat, lng, popupContent, type = 'default') {
        let iconClass = 'marker-user'; // default
        let iconHtml = '<div class="marker-pin"><i class="fas fa-home"></i></div>';

        if (type === 'emergency') {
            iconClass = 'marker-emergency';
            iconHtml = '<div class="marker-pin"><i class="fas fa-exclamation"></i></div>';
        } else if (type === 'medical') {
            iconClass = 'marker-doctor';
            iconHtml = '<div class="marker-pin"><i class="fas fa-user-md"></i></div>';
        } else if (type === 'security') {
            iconClass = 'marker-security';
            iconHtml = '<div class="marker-pin"><i class="fas fa-shield-alt"></i></div>';
        } else if (type === 'disability') {
            iconClass = 'marker-disability';
            iconHtml = '<div class="marker-pin"><i class="fas fa-wheelchair"></i></div>';
        }

        const customIcon = L.divIcon({
            className: `custom-div-icon ${iconClass}`,
            html: iconHtml,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -35]
        });
        
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
            .bindPopup(popupContent);
        
        this.markers.push(marker);
        return marker;
    },

    // Kullanıcının konum seçmesi için
    enableLocationSelection: function(onLocationSelected) {
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            
            // Varsa eski seçimi kaldır
            if (this.currentMarker) {
                this.map.removeLayer(this.currentMarker);
            }

            this.currentMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
                .bindPopup("Konumunuz. Sürükleyerek ayarlayabilirsiniz.")
                .openPopup();

            onLocationSelected(lat, lng);

            this.currentMarker.on('dragend', (event) => {
                const position = event.target.getLatLng();
                onLocationSelected(position.lat, position.lng);
            });
        });
    },

    clearMarkers: function() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    },

    centerMap: function(lat, lng) {
        this.map.setView([lat, lng], 15);
    },

    locateUser: function(onLocationFound, onError) {
        this.map.locate({setView: true, maxZoom: 16});
        
        // Önceki listener'ları temizle (tekrar tekrar bind olmasın)
        this.map.off('locationfound');
        this.map.off('locationerror');

        this.map.on('locationfound', (e) => {
            const { lat, lng } = e.latlng;
            
            // Varsa eski seçimi kaldır
            if (this.currentMarker) {
                this.map.removeLayer(this.currentMarker);
            }

            this.currentMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
                .bindPopup("Konumunuz bulundu! (Sürükleyerek ince ayar yapabilirsiniz)")
                .openPopup();

            // Sürükleme bittiğinde de konumu güncellememiz lazım, bu yüzden callback'i burada kullanamayız doğrudan.
            // Ama ilk konum bulunduğunda callback'i çağırabiliriz.
            if (onLocationFound) onLocationFound(lat, lng);

            this.currentMarker.on('dragend', (event) => {
                const position = event.target.getLatLng();
                if (onLocationFound) onLocationFound(position.lat, position.lng);
            });
        });

        this.map.on('locationerror', (e) => {
            if (onError) onError(e.message);
        });
    }
};
