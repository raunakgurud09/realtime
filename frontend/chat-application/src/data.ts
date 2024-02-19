export type TTestUsers = {
  _id: number;
  username: string;
  password: string;
};

export const testUsers: TTestUsers[] = [
  {
    _id: 1,
    username: "test_user_1",
    password: "testpassword123",
  },
  {
    _id: 2,
    username: "test_user_2",
    password: "testpassword123",
  },
];
