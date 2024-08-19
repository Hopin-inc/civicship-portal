import { makeApolloClient } from "@/lib/apollo";
import { GET_ALL_ORGANIZATIONS } from "@/api/queries/organizations";

const TestOrganizationList: React.FC = async () => {
  const { data, loading, error } = await makeApolloClient().query({
    query: GET_ALL_ORGANIZATIONS,
    variables: {
      filter: { keyword: "テスト" },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });
  return (
    <ul className="gap-4">
      {loading ? (
        <p>Loading</p>
      ) : error ? (
        <p>Error</p>
      ) : (
        data.organizations.edges?.map((e) => (
          <li key={e?.node?.id}>
            <h2>
              {e?.node?.name} ({e?.node?.city.state.name} {e?.node?.city.name})
            </h2>
            <ul>
              {e?.node?.users?.map((u) => (
                <li className="ml-8 list-disc" key={u.id}>
                  {u.lastName} {u.firstName}
                </li>
              ))}
            </ul>
          </li>
        ))
      )}
    </ul>
  );
};

export default TestOrganizationList;
