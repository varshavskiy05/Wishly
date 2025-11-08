export type User = {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Category = {
    id: string;
    name: string;
    categoryId?: string;
    userId: string;
    shared?: boolean;
}

export type List = {
    id: string;
    listId: string;
    name:string;
    description?: string;
    link?: string;
    imageUrl?: string;
}

export type Share = { 
    id: string;
    listId: string;
    userId: string;
    createdAt: string;
}