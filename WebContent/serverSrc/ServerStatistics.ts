export class ServerStatistics {
   
    numberOfRoomsCreated: number;
    numberOfRoomLimitReached: number;


    constructor() {
        this.numberOfRoomsCreated = 0;
        this.numberOfRoomLimitReached = 0;
    }

    public logStatics(){
        console.log('-------------');
       
        console.log('numberOfRoomsCreated: ', this.numberOfRoomsCreated);
        console.log('numberOfRoomLimitReached: ', this.numberOfRoomLimitReached);

        console.log('-------------');
    }

}