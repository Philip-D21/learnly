
export enum Role {
    Admin='admin',
    User='user',
}

export interface BrcErr {
    readonly message:string
    readonly status:number
    readonly location?:string // the name of the function where the error occured or any tracable desc
} 

export interface BrcSucess {
    readonly message:string
    readonly statusCode:number
    readonly data?:object
}

export interface JwtPayloadI {
    readonly userId:string
    readonly userRole:Role
    readonly userName?:string
}


export enum TransactionType {
   Deposit= 'deposit',
   Transfer= 'transfer',
   Withdrawal='withdrawal'
}

export enum Status {
    Pending= 'pending',
    Completed='completed',
    Failed='failed'
}




