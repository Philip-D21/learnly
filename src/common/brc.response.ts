import { HttpException } from "@nestjs/common"
import { BrcErr, BrcSucess } from "./interface/main.interface";


class BrcException extends HttpException {
    constructor(message:string,status:number, state:boolean=false) {
      super({message, state, statusCode:status},status);
    }
}

export const brcResponse = {
     
    success:(message:string, data:object={}) =>  {
        return {
            message,
            status: true,
            data
        }
    },
    error: (err:BrcErr) => {

        let loc = err?.location ?? ''

        const message = err?.message ? err.message : `internal server error @ ${err?.location}`;

        throw new BrcException(message, err?.status ?? 500)
    }
    
}
