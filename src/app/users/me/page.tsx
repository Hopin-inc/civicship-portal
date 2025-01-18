import { redirect } from "next/navigation";

const MyPage: React.FC = () => {
  redirect("/users/me/communities");
};

export default MyPage;
