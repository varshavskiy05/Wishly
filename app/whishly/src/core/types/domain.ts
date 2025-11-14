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
    name:string;
    description?: string;
    categoryId?: string;
    userId: string;
    link?: string;
    imageUrl?: string;
    shareId?: string | null;
}

export type Share = { 
    id: string;
    listId: string;
    userId: string;
    createdAt: string;
}