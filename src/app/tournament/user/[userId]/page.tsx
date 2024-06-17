import { getUser } from "~/server/queries";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUser(params.userId);
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main>
      <h2>{user.name}</h2>
    </main>
  );
}
