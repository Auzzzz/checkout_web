// TODO: update when API is fixed
export type User = {
  id: number;
};
export type Items = {
  item: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    GroupItems?: [GroupInItems]
  };

};

export type Venue = {
  venue: {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  GroupVenues?: [GroupInVenues];
  }
};

export type Department = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  GroupDepartments?: GroupDepartments[];
};

export type Flags = {
  id: number;
  name: string;
  description: string;
  Group_Flags?: Group_Flags[];
};

export type Group = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  GroupMembers?: number;
};

export type GroupInItems = {
group: Group
}

export type GroupInVenues = {
  group: Group
  }

export type GroupMembers = {
  id: number;
  groupId: number;
  userId: number;

  groups?: Group[];
  users?: User[];
};

export type GroupItems = {
  id: number;
  groupId: number;
  itemId: number;

  groups?: Group[];
  items?: Items[];
};

export type GroupVenues = {
  id: number;
  groupId: number;
  venueId: number;

  groups?: Group[];
  venues?: Venue[];
};

export type GroupDepartments = {
  id: number;
  groupId: number;
  departmentId: number;

  groups?: Group[];
  departments?: Department[];
};

export type Group_Flags = {
  id: number;
  groupId: number;
  flagId: number;

  groups?: Group[];
  flags?: Flags[];
};

export type EntireGroup = {
  description: string;
  id: number;
  name: string;
  GroupItems?: GroupItems[];
  GroupMembers?: GroupMembers[];
  GroupVenues?: GroupVenues[];
  GroupDepartments?: GroupDepartments[];
  Group_Flags: Group_Flags[];
};
