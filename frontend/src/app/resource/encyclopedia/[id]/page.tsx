import { makeLearnDetail } from "@/components/LearnDetail";

const { generateStaticParams, generateMetadata, Page } = makeLearnDetail("wiki");

export { generateStaticParams, generateMetadata };
export default Page;
