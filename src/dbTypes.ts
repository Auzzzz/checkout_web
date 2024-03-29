
// TODO: update when API is fixed
export type User = {
    id: number; 


}
export type Items = {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    GroupItems?:  GroupItems[];
}

export type Venue = {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    GroupVenues?:  number;
}

export type Group = {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    GroupMembers?:  number;
}

export type GroupMembers = {
    id: number;
    groupId: number;
    userId: number;

    groups?: Group[];
    users?: User[];
}

export type GroupItems = {
    id: number;
    groupId: number;
    itemId: number;

    groups?: Group[];
    items?: Items[];
}

export type GroupVenues = {
    id: number;
    groupId: number;
    venueId: number;

    groups?: Group[];
    venues?: Venue[];
}

