import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export const LayoutWrapper = (props: Props) => {
  return (
    <div className="gb-gray-300">
      <div className="container mx-auto grid grid-rows-[auto, lfr, auto] min-h-screen">
        <Header />
        <main className="px-4 text-gray-600 bg-gray-100">
          <div>{props.children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
