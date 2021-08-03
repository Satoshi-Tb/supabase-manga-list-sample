import { ReactNode, useCallback, useEffect, useState } from "react";
import { LayoutWrapper } from "../components/layoutWrapper";
import { Auth, Button, IconLogOut } from "@supabase/ui";
import { client } from "../libs/supabase";
import { Title, TitleList } from "../components/titleList";

type Props = {
  children: ReactNode;
};

// DBから漫画タイトルを取得
const getTitles = async () => {
  const { data, error } = await client
    .from("manga_title")
    .select("*")
    .order("title");
  if (!error && data) {
    console.log(data)
    return data;
  }
  console.log(error)
  return [];
};

const Container = (props: Props) => {
  console.log("index/Container start");
  const { user } = Auth.useUser();
  const [text, setText] = useState<string>("");
  const [titles, setTitles] = useState<Title[]>([]);

  // DBから取得した漫画タイトルをセット
  const getTitleList = useCallback(async () => {
    const data = await getTitles();
    setTitles(data);
  }, []);

  useEffect(() => {
    getTitleList();
  }, [user, getTitleList]);

  console.log(user);
  if (user) {
    return (
      <div>
        <div className="flex justify-center gap-2 p-4">
          <input
            className="w-full h-12 px-4 bg-white border border-gray-300 rounded shadow appearance-none hover:border-gray-700"
            placeholder="Filtering text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <TitleList
          titles={titles}
          uuid={user.id}
          getTitleList={getTitleList}
          filterText={text}
        />
        <div className="flex justify-end mx-2 my-4">
          <Button
            size="medium"
            icon={<IconLogOut />}
            onClick={() => client.auth.signOut()}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  } else {
    return <>{props.children}</>;
  }
};

export default function Home() {
  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={client}>
        <Container>
          <div className="flex justify-center pt-8">
            <div className="w-full sm:w-96">
              <Auth
                supabaseClient={client}
                providers={["github"]}
                socialColors={true}
              />
            </div>
          </div>
        </Container>
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
}
