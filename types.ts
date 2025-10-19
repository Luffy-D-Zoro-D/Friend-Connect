
export interface Status {
  id: string;
  text: string;
  timestamp: Date;
}

export interface Friend {
  id: 'friend1' | 'friend2';
  name: string;
  avatarUrl: string;
  currentStatus: Status;
  statusHistory: Status[];
}

export type FriendsData = {
  [key in Friend['id']]: Friend;
};
