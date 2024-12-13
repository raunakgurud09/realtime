export type TTestUsers = {
  _id: number;
  username: string;
  password: string;
};

export const testUsers: TTestUsers[] = [
  {
    _id: 1,
    username: "user1",
    password: "Testpass1",
  },
  {
    _id: 2,
    username: "user2",
    password: "Testpass1",
  },
];
