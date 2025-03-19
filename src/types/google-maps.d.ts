
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      addListener(eventName: string, handler: Function): MapsEventListener;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getBounds(): LatLngBounds | null;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
      toString(): string;
      equals(other: LatLng): boolean;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      toJSON(): LatLngBoundsLiteral;
      toString(): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
      contains(latLng: LatLng | LatLngLiteral): boolean;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }

    class MapsEventListener {
      remove(): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      setTitle(title: string): void;
      getTitle(): string | null;
      setIcon(icon: string | Icon | Symbol): void;
      setAnimation(animation: Animation): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      animation?: Animation;
    }

    interface Icon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }

    enum Animation {
      BOUNCE,
      DROP
    }

    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
    }

    interface DirectionsRequest {
      origin: string | LatLng | LatLngLiteral | Place;
      destination: string | LatLng | LatLngLiteral | Place;
      travelMode: TravelMode;
      waypoints?: DirectionsWaypoint[];
      optimizeWaypoints?: boolean;
      provideRouteAlternatives?: boolean;
      avoidFerries?: boolean;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
      region?: string;
      transitOptions?: TransitOptions;
      drivingOptions?: DrivingOptions;
      unitSystem?: UnitSystem;
    }

    interface DirectionsWaypoint {
      location: string | LatLng | LatLngLiteral | Place;
      stopover?: boolean;
    }

    interface Place {
      location: LatLng | LatLngLiteral;
      placeId: string;
      query: string;
    }

    enum TravelMode {
      BICYCLING,
      DRIVING,
      TRANSIT,
      WALKING
    }

    enum UnitSystem {
      IMPERIAL,
      METRIC
    }

    interface TransitOptions {
      arrivalTime?: Date;
      departureTime?: Date;
      modes?: TransitMode[];
      routingPreference?: TransitRoutePreference;
    }

    enum TransitMode {
      BUS,
      RAIL,
      SUBWAY,
      TRAIN,
      TRAM
    }

    enum TransitRoutePreference {
      FEWER_TRANSFERS,
      LESS_WALKING
    }

    interface DrivingOptions {
      departureTime: Date;
      trafficModel?: TrafficModel;
    }

    enum TrafficModel {
      BEST_GUESS,
      OPTIMISTIC,
      PESSIMISTIC
    }

    enum DirectionsStatus {
      INVALID_REQUEST,
      MAX_WAYPOINTS_EXCEEDED,
      NOT_FOUND,
      OK,
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      UNKNOWN_ERROR,
      ZERO_RESULTS
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    interface DirectionsRoute {
      bounds: LatLngBounds;
      copyrights: string;
      legs: DirectionsLeg[];
      overview_path: LatLng[];
      overview_polyline: string;
      warnings: string[];
      waypoint_order: number[];
    }

    interface DirectionsLeg {
      arrival_time: Time;
      departure_time: Time;
      distance: Distance;
      duration: Duration;
      duration_in_traffic: Duration;
      end_address: string;
      end_location: LatLng;
      start_address: string;
      start_location: LatLng;
      steps: DirectionsStep[];
      via_waypoint: LatLng[];
    }

    interface DirectionsStep {
      distance: Distance;
      duration: Duration;
      end_location: LatLng;
      instructions: string;
      path: LatLng[];
      start_location: LatLng;
      steps: DirectionsStep[];
      transit: TransitDetails;
      travel_mode: TravelMode;
    }

    interface Distance {
      text: string;
      value: number;
    }

    interface Duration {
      text: string;
      value: number;
    }

    interface Time {
      text: string;
      time_zone: string;
      value: Date;
    }

    interface TransitDetails {
      arrival_stop: TransitStop;
      arrival_time: Time;
      departure_stop: TransitStop;
      departure_time: Time;
      headsign: string;
      headway: number;
      line: TransitLine;
      num_stops: number;
    }

    interface TransitStop {
      location: LatLng;
      name: string;
    }

    interface TransitLine {
      agencies: TransitAgency[];
      color: string;
      icon: string;
      name: string;
      short_name: string;
      text_color: string;
      url: string;
      vehicle: TransitVehicle;
    }

    interface TransitAgency {
      name: string;
      phone: string;
      url: string;
    }

    interface TransitVehicle {
      icon: string;
      local_icon: string;
      name: string;
      type: VehicleType;
    }

    enum VehicleType {
      BUS,
      CABLE_CAR,
      COMMUTER_TRAIN,
      FERRY,
      FUNICULAR,
      GONDOLA_LIFT,
      HEAVY_RAIL,
      HIGH_SPEED_TRAIN,
      INTERCITY_BUS,
      METRO_RAIL,
      MONORAIL,
      OTHER,
      RAIL,
      SHARE_TAXI,
      SUBWAY,
      TRAM,
      TROLLEYBUS
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions);
      setDirections(directions: DirectionsResult): void;
      getDirections(): DirectionsResult;
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPanel(panel: Element | null): void;
      getPanel(): Element | null;
      setOptions(options: DirectionsRendererOptions): void;
    }

    interface DirectionsRendererOptions {
      directions?: DirectionsResult;
      draggable?: boolean;
      hideRouteList?: boolean;
      infoWindow?: InfoWindow;
      map?: Map;
      markerOptions?: MarkerOptions;
      panel?: Element;
      polylineOptions?: PolylineOptions;
      preserveViewport?: boolean;
      routeIndex?: number;
      suppressBicyclingLayer?: boolean;
      suppressInfoWindows?: boolean;
      suppressMarkers?: boolean;
      suppressPolylines?: boolean;
    }

    interface PolylineOptions {
      clickable?: boolean;
      draggable?: boolean;
      editable?: boolean;
      geodesic?: boolean;
      icons?: IconSequence[];
      map?: Map;
      path?: LatLng[] | LatLngLiteral[] | MVCArray<LatLng>;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      visible?: boolean;
      zIndex?: number;
    }

    interface IconSequence {
      icon: Symbol;
      offset: string;
      repeat: string;
    }

    class MVCArray<T> {
      constructor(array?: T[]);
      clear(): void;
      forEach(callback: (elem: T, i: number) => void): void;
      getArray(): T[];
      getAt(i: number): T;
      getLength(): number;
      insertAt(i: number, elem: T): void;
      pop(): T;
      push(elem: T): number;
      removeAt(i: number): T;
      setAt(i: number, elem: T): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      close(): void;
      getContent(): string | Element;
      getPosition(): LatLng | null;
      getZIndex(): number;
      open(map?: Map, anchor?: MVCObject): void;
      setContent(content: string | Element): void;
      setOptions(options: InfoWindowOptions): void;
      setPosition(position: LatLng | LatLngLiteral): void;
      setZIndex(zIndex: number): void;
    }

    interface InfoWindowOptions {
      content?: string | Element;
      disableAutoPan?: boolean;
      maxWidth?: number;
      pixelOffset?: Size;
      position?: LatLng | LatLngLiteral;
      zIndex?: number;
    }

    class MVCObject {
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
      get(key: string): any;
      notify(key: string): void;
      set(key: string, value: any): void;
      setValues(values: { [key: string]: any }): void;
      unbind(key: string): void;
      unbindAll(): void;
    }

    namespace places {
      class SearchBox {
        constructor(inputField: HTMLInputElement, opts?: SearchBoxOptions);
        getBounds(): LatLngBounds | undefined;
        getPlaces(): PlaceResult[];
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      }

      interface SearchBoxOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
      }

      interface PlaceResult {
        address_components?: AddressComponent[];
        adr_address?: string;
        formatted_address?: string;
        formatted_phone_number?: string;
        geometry?: PlaceGeometry;
        html_attributions?: string[];
        icon?: string;
        international_phone_number?: string;
        name?: string;
        permanently_closed?: boolean;
        photos?: PlacePhoto[];
        place_id?: string;
        plus_code?: PlusCode;
        price_level?: number;
        rating?: number;
        reviews?: PlaceReview[];
        types?: string[];
        url?: string;
        utc_offset?: number;
        vicinity?: string;
        website?: string;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface PlaceGeometry {
        location: LatLng;
        viewport: LatLngBounds;
      }

      interface PlacePhoto {
        height: number;
        html_attributions: string[];
        width: number;
        getUrl(opts: PhotoOptions): string;
      }

      interface PhotoOptions {
        maxHeight?: number;
        maxWidth?: number;
      }

      interface PlusCode {
        compound_code: string;
        global_code: string;
      }

      interface PlaceReview {
        author_name: string;
        author_url: string;
        language: string;
        profile_photo_url: string;
        rating: number;
        relative_time_description: string;
        text: string;
        time: number;
      }

      class PlacesService {
        constructor(attrContainer: HTMLDivElement | Map);
        findPlaceFromQuery(request: FindPlaceFromQueryRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus) => void): void;
        getDetails(request: PlaceDetailsRequest, callback: (result: PlaceResult, status: PlacesServiceStatus) => void): void;
        nearbySearch(request: PlaceSearchRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus, pagination: PlaceSearchPagination) => void): void;
        textSearch(request: TextSearchRequest, callback: (results: PlaceResult[], status: PlacesServiceStatus, pagination: PlaceSearchPagination) => void): void;
      }

      interface FindPlaceFromQueryRequest {
        fields: string[];
        query: string;
        locationBias?: LocationBias;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
        sessionToken?: AutocompleteSessionToken;
      }

      interface PlaceSearchRequest {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        keyword?: string;
        location?: LatLng | LatLngLiteral;
        maxPriceLevel?: number;
        minPriceLevel?: number;
        name?: string;
        openNow?: boolean;
        radius?: number;
        rankBy?: RankBy;
        type?: string;
      }

      interface TextSearchRequest {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        location?: LatLng | LatLngLiteral;
        query: string;
        radius?: number;
        type?: string;
      }

      interface LocationBias {
        circle?: CircularBias;
        rectangle?: RectangularBias;
      }

      interface CircularBias {
        center: LatLng | LatLngLiteral;
        radius: number;
      }

      interface RectangularBias {
        bounds: LatLngBounds | LatLngBoundsLiteral;
      }

      enum PlacesServiceStatus {
        INVALID_REQUEST,
        NOT_FOUND,
        OK,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        UNKNOWN_ERROR,
        ZERO_RESULTS
      }

      enum RankBy {
        DISTANCE,
        PROMINENCE
      }

      class AutocompleteSessionToken {}

      interface PlaceSearchPagination {
        hasNextPage: boolean;
        nextPage(): void;
      }
    }
  }
}
