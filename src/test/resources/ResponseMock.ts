export default class ResponseMock {
    status (number: number): StatusId{
        return new StatusId(number);
    }
}

class StatusId {
    status: number | undefined;
    data: any;

    json (data: any){
        this.data = data;
        return JSON.stringify({
            status: this.status,
            data: this.data
        });
    }

    constructor(id: number){
        this.status = id;
    }
}